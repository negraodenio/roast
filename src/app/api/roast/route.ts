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

const DEFAULT_MODELS = {
    roast: process.env.SILICONFLOW_ROAST_MODEL || 'deepseek-ai/DeepSeek-V3',
    ux: process.env.SILICONFLOW_UX_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
    seo: process.env.SILICONFLOW_SEO_MODEL || 'deepseek-ai/DeepSeek-V3'
}

export async function POST(req: NextRequest) {
    try {
        const { url, isPublic, tone = 'medium' } = await req.json()

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
      Legal Links Found: Privacy=${siteData.legalLinks.privacy}, Terms=${siteData.legalLinks.terms}, Cookies=${siteData.legalLinks.cookies}
      Accessibility Stats: ${siteData.accessibility.imagesWithAlt}/${siteData.accessibility.totalImages} images have alt text. ${siteData.accessibility.ariaElements} ARIA elements found.
      Body Preview: ${siteData.bodyText.substring(0, 2000)}...
    `

        // 4. Parallel LLM Calls
        // Define tone personalities
        const toneInstructions = {
            mild: "You are a constructive website consultant. Be polite, professional, and encouraging while pointing out areas of improvement. Focus on strengths and frame weaknesses as opportunities.",
            medium: "You are a direct and honest website roaster, similar to Gordon Ramsay. Point out issues bluntly but professionally. Balance criticism with constructive advice.",
            spicy: "You are a brutally savage website roaster with zero filter. Unleash maximum sarcasm and roast without mercy. Make it hurt but keep it funny. Channel your inner drill sergeant mixed with a stand-up comedian."
        }

        // Roast Task
        const roastPromise = callSiliconFlow(
            DEFAULT_MODELS.roast,
            `${toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.medium}
             Return JSON only: { "score": number (0-100), "headline": string, "roast": string (markdown), "tldr": string }`,
            `Roast this site:\n${siteContext}`
        )

        // UX Audit Task
        const uxPromise = callSiliconFlow(
            DEFAULT_MODELS.ux,
            `You are a UX expert. Analyze the site context.
             Return JSON only: { 
                "score": number (0-100), 
                "summary": "Short summary of UX state",
                "issues": [{ 
                    "severity": "critical"|"warning", 
                    "title": "Short title of issue", 
                    "description": "Why this is bad for users",
                    "fix": "Actionable step-by-step fix" 
                }] 
             }`,
            `Audit UX for:\n${siteContext}`
        )

        // SEO Audit Task
        const seoPromise = callSiliconFlow(
            DEFAULT_MODELS.seo,
            `You are an SEO expert. Analyze the site context.
             Return JSON only: { 
                "score": number (0-100), 
                "summary": "Short summary of SEO state",
                "issues": [{ 
                    "severity": "critical"|"warning", 
                    "title": "Short title of issue", 
                    "description": "Impact on ranking",
                    "fix": "Specific technical fix" 
                }] 
             }`,
            `Audit SEO for:\n${siteContext}`
        )

        // Copywriting Audit Task
        const copyPromise = callSiliconFlow(
            DEFAULT_MODELS.ux, // reusing high intel model
            `You are a Copywriting expert. Analyze the site text.
             Return JSON only: { 
                "score": number (0-100), 
                "summary": "Short summary of copy effectiveness",
                "issues": [{ 
                    "severity": "critical"|"warning", 
                    "title": "Short title", 
                    "description": "Why the copy fails to convert",
                    "fix": "Rewrite suggestion or structural change" 
                }] 
             }`,
            `Audit Copy for:\n${siteContext}`
        )

        // Conversion (CRO) Audit Task
        const croPromise = callSiliconFlow(
            DEFAULT_MODELS.ux, // reusing high intel model
            `You are a CRO (Conversion Rate Optimization) expert. Analyze the CTAs and flow.
             Return JSON only: { 
                "score": number (0-100), 
                "summary": "Analysis of conversion potential",
                "issues": [{ 
                    "severity": "critical"|"warning", 
                    "title": "Short title", 
                    "description": "Why users might drop off",
                    "fix": "Actionable tactic to increase conversions" 
                }] 
             }`,
            `Audit CRO for:\n${siteContext}`
        )

        // Compliance, Accessibility & Security Task (saved to performance_audit column)
        const securityPromise = callSiliconFlow(
            DEFAULT_MODELS.ux,
            `You are a Web Security and Compliance expert. Analyze for:
             1. SSL/HTTPS state.
             2. Security Headers (X-Powered-By, HSTS).
             3. General Accessibility (Alt text, ARIA).
             4. Legal (Privacy/Terms).
             Return JSON only: { 
                "score": number (0-100), 
                "summary": "Security & Compliance snapshot",
                "issues": [{ 
                    "severity": "critical"|"warning", 
                    "title": "Short title", 
                    "description": "Security/Access risk explanation",
                    "fix": "How to resolve" 
                }] 
             }`,
            `Audit Security & Compliance for:\n${siteContext}`
        )

        // Wait for all
        const [roastRaw, uxRaw, seoRaw, copyRaw, croRaw, securityRaw] = await Promise.all([
            roastPromise,
            uxPromise,
            seoPromise,
            copyPromise,
            croPromise,
            securityPromise
        ])

        const parseJSON = (str: string, fallbackScore = 50) => {
            try {
                const data = JSON.parse(str)
                if (typeof data.score !== 'number') data.score = fallbackScore
                if (!data.issues) data.issues = []
                return data
            } catch {
                return { score: fallbackScore, summary: "Analysis partial due to AI timeout.", issues: [] }
            }
        }

        const roast = parseJSON(roastRaw, 50)
        const ux = parseJSON(uxRaw, 60)
        const seo = parseJSON(seoRaw, 60)
        const copy = parseJSON(copyRaw, 60)
        const cro = parseJSON(croRaw, 60)
        const security = parseJSON(securityRaw, 70)

        const finalScore = roast.score || 50

        // 5. Save to DB
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
                copy_audit: copy,
                conversion_tips: cro,
                performance_audit: security, // Repurposed for Security & Compliance
                is_public: isPublic ?? true,
                tone: tone // Save user's tone preference
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
