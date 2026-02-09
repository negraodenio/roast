import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { scrapeWebsite } from '@/lib/scraper'
import { callSiliconFlow } from '@/lib/siliconflow'

// Prevent build-time execution
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
// Allow long running process (max 60s on Vercel Pro/Hobby is usually 10s so be careful, edge runtime might be needed but Cheerio is Node)
export const maxDuration = 60

export async function POST(req: NextRequest) {
    try {
        const { url, isPublic } = await req.json()

        // 1. Basic URL Validation
        let validUrl: URL
        try {
            validUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
        } catch {
            return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
        }

        // 2. Auth Check & Credits
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const userId = user?.id

        if (userId) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('credits, plan')
                .eq('id', userId)
                .single()

            if (profile && profile.plan === 'free' && profile.credits <= 0) {
                return NextResponse.json({ error: 'No credits left. Please upgrade.' }, { status: 403 })
            }
        } else {
            // Rate limit usage for non-logged in users check IP via Vercel headers later?
            // For MVP, just allow it.
        }

        // 3. Scrape Website
        let siteData
        try {
            siteData = await scrapeWebsite(validUrl.toString())
        } catch (error: unknown) {
            return NextResponse.json({ error: (error as Error).message || 'Could not access website' }, { status: 400 })
        }

        const siteContext = `
      URL: ${validUrl.toString()}
      Title: ${siteData.title}
      Meta Description: ${siteData.metaDescription}
      Headings: ${siteData.headings.join(' | ')}
      Image Count: ${siteData.imageCount}
      Link Count: ${siteData.linkCount}
      Main CTAs detected: ${siteData.ctaTexts.join(', ')}
      Body Preview: ${siteData.bodyText.substring(0, 2000)}...
    `

        // 4. Parallel LLM Calls
        // Only running Roast + UX + SEO for MVP speed, others can be separate or combined if too slow
        // The user asked for specific models.

        // Roast Task
        const roastPromise = callSiliconFlow(
            'deepseek-ai/DeepSeek-V2.5',
            `You are a savage but constructive website roaster. You are the Gordon Ramsay of web design.
         Return JSON only: { "score": number (0-100), "headline": string, "roast": string (markdown), "tldr": string }`,
            `Roast this site:\n${siteContext}`
        )

        // UX Audit Task
        const uxPromise = callSiliconFlow(
            'Qwen/Qwen2.5-72B-Instruct',
            `You are a UX expert. Return JSON only: { "score": number, "issues": [{ "severity": "critical"|"warning", "title": string, "fix": string }], "summary": string }`,
            `Audit UX for:\n${siteContext}`
        )

        // SEO Audit Task
        const seoPromise = callSiliconFlow(
            'deepseek-ai/DeepSeek-V2.5',
            `You are an SEO expert. Return JSON only: { "score": number, "title_check": string, "meta_check": string, "issues": [{ "severity": "critical"|"warning", "title": string, "fix": string }] }`,
            `Audit SEO for:\n${siteContext}`
        )

        // Wait for all
        const [roastRaw, uxRaw, seoRaw] = await Promise.all([roastPromise, uxPromise, seoPromise])

        const parseJSON = (str: string) => {
            try { return JSON.parse(str) } catch { return null }
        }

        const roast = parseJSON(roastRaw) || { score: 50, headline: "Roast Failed", roast: roastRaw, tldr: "AI timed out roasting you." }
        const ux = parseJSON(uxRaw)
        const seo = parseJSON(seoRaw)

        const finalScore = roast.score || 50

        // 5. Save to DB (using service role to bypass RLS for insert if needed, but user can insert own)
        // Actually, usually easier to use service role for backend logic
        // But let's try with the authenticated client if user is logged in

        // For anonymous users, we might need a service role client to insert with user_id=null if RLS prevents it?
        // My schema said: "Users can insert their own roasts." check (auth.uid() = user_id or user_id is null);
        // So if user_id is null, anyone can insert? No, auth.uid() is null for anon. 
        // Wait, `auth.uid() = user_id` where user_id is null means `null = null` which is false in SQL (needs `is null`).
        // So anon inserts might fail with standard client. 
        // I will use service_role client for saving roasts to be safe.

        // Re-create supabase with service role
        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: roastRecord, error: dbError } = await supabaseAdmin
            .from('roasts')
            .insert({
                user_id: userId || null,
                url: validUrl.toString(),
                score: finalScore,
                roast_text: roast,
                ux_audit: ux,
                seo_audit: seo,
                is_public: isPublic ?? true,
            })
            .select()
            .single()

        if (dbError) {
            console.error('DB Insert Error:', dbError)
            return NextResponse.json({ error: 'Failed to save roast result' }, { status: 500 })
        }

        // Decrement credits
        if (userId) {
            await supabaseAdmin.rpc('decrement_credits', { user_id_input: userId })
        }

        return NextResponse.json({
            success: true,
            roastId: roastRecord.id, // Return ID for redirect
            score: finalScore
        })

    } catch (error: unknown) {
        console.error('Generaton Error:', error)
        return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 })
    }
}
