import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { scrapeWebsite } from '@/lib/scraper'
import { callSiliconFlow } from '@/lib/siliconflow'

// Prevent build-time execution
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const DEFAULT_MODELS = {
    roast: process.env.SILICONFLOW_ROAST_MODEL || 'deepseek-ai/DeepSeek-V3',
    ux: process.env.SILICONFLOW_UX_MODEL || 'Qwen/Qwen2.5-72B-Instruct',
    seo: process.env.SILICONFLOW_SEO_MODEL || 'deepseek-ai/DeepSeek-V3',
    security: process.env.SILICONFLOW_SECURITY_MODEL || 'Qwen/Qwen2.5-7B-Instruct'
}


// --- IP RATE LIMITER ---
// In-memory store. Works per Vercel instance. Upgrade to Upstash Redis for multi-region at scale.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutes

function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = rateLimitStore.get(ip)
    if (!entry || now > entry.resetAt) {
        rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
        return false
    }
    if (entry.count >= RATE_LIMIT_MAX) return true
    entry.count++
    return false
}
// Cleanup old entries to prevent memory leak
setInterval(() => {
    const now = Date.now()
    rateLimitStore.forEach((value, key) => { if (now > value.resetAt) rateLimitStore.delete(key) })
}, RATE_LIMIT_WINDOW)

export async function POST(req: NextRequest) {
    try {
        console.time('⏱️ Total Request Time')
        const { url, isPublic, tone = 'medium' } = await req.json()

        // --- IP RATE LIMIT CHECK ---
        const forwarded = req.headers.get('x-forwarded-for')
        const ip = forwarded ? forwarded.split(',')[0].trim() : req.headers.get('x-real-ip') || 'unknown'
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Too many requests. Please wait a few minutes before analyzing again.' },
                { status: 429 }
            )
        }

        // 1. Basic URL Validation
        let validUrl: URL
        try {
            validUrl = new URL(url.startsWith('http') ? url : `https://${url}`)
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
        }

        // 1.1 Self-Roast Guard & Sanity Check
        const host = validUrl.hostname.toLowerCase()
        if (host === 'localhost' || host === '127.0.0.1' || host === 'roasty.ai' || host.includes('vercel.app')) {
            return NextResponse.json({ error: "I won't roast myself or your local machine. Nice try!" }, { status: 400 })
        }

        // 2. Check cache for recent analysis (within 24h)
        console.time('🔍 Cache Check')
        const supabase = await createClient()
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

        const { data: cachedRoast } = await supabase
            .from('roasts')
            .select('*')
            .eq('url', validUrl.toString())
            .gte('created_at', twentyFourHoursAgo)
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        console.timeEnd('🔍 Cache Check')

        if (cachedRoast) {
            // SECURITY: If cached roast is paid, do NOT return it to a potential new user.
            // This prevents cache-based paywall bypass: paid roast -> free access for next visitor of same URL.
            if (!cachedRoast.paid) {
                console.log('✅ Cache HIT (free roast) - returning cached result')
                console.timeEnd('⏱️ Total Request Time')
                return NextResponse.json({ roastId: cachedRoast.id, cached: true })
            }
            console.log('⚠️  Cache HIT but roast is paid — running fresh analysis to prevent paywall bypass')
        } else {
            console.log('❌ Cache MISS - running fresh analysis')
        }

        // --- LLM DAILY BUDGET CAP ---
        // Counts today's roast records to estimate LLM spend. Each roast = 6 LLM calls.
        // Cap is configurable via LLM_DAILY_ROAST_LIMIT env var (default: 500 roasts/day).
        const dailyLimit = parseInt(process.env.LLM_DAILY_ROAST_LIMIT || '500', 10)
        const startOfDay = new Date()
        startOfDay.setUTCHours(0, 0, 0, 0)
        const { count: todayCount } = await supabase
            .from('roasts')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', startOfDay.toISOString())

        if (todayCount !== null && todayCount >= dailyLimit) {
            console.error(`🚨 LLM BUDGET CAP HIT: ${todayCount}/${dailyLimit} roasts today`)
            return NextResponse.json(
                { error: 'Service is temporarily at capacity. Please try again tomorrow.' },
                { status: 503 }
            )
        }

        // 3. Auth Check & Credits
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
        }

        // 3. Scrape Website
        console.time('🌐 Scraping')
        let siteData
        try {
            siteData = await scrapeWebsite(validUrl.toString())
            console.timeEnd('🌐 Scraping')
        } catch (error: unknown) {
            console.timeEnd('🌐 Scraping')
            return NextResponse.json({ error: (error as Error).message || 'Could not access website' }, { status: 400 })
        }

        const siteContext = `
<site_context>
      URL: ${validUrl.toString()}
      Title: ${siteData.title}
      Meta Description: ${siteData.metaDescription}
      Headings: ${siteData.headings.join(' | ')}
      Image Count: ${siteData.imageCount}
      Link Count: ${siteData.linkCount}
      Main CTAs detected: ${siteData.ctaTexts.join(', ')}
      Legal Links Found: Privacy=${siteData.legalLinks.privacy}, Terms=${siteData.legalLinks.terms}, Cookies=${siteData.legalLinks.cookies}
      Accessibility Stats: ${siteData.accessibility.imagesWithAlt}/${siteData.accessibility.totalImages} images have alt text. ${siteData.accessibility.ariaElements} ARIA elements found.
      Body Preview: 
      --- START BODY ---
      ${siteData.bodyText.replace(/<|>/g, '')} 
      --- END BODY ---
</site_context>
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
             
             FORMATTING RULES (STRICT):
             - Act as a "Master Marketing Creator". 
             - Use EMOJIS for every section header (e.g., 💀, 📉, 🚨).
             - Use **Bold** for key stats and fails.
             - Keep paragraphs short and punchy.
             - Add double line breaks between sections for maximum readability.
             
             Return JSON only: { "score": number (0-100), "headline": string, "roast": string (markdown), "tldr": string }`,
            `Audit UX for the content inside <site_context> in the following snapshot:\n${siteContext}`
        )

        // UX Audit Task
        const uxPromise = callSiliconFlow(
            DEFAULT_MODELS.ux,
            `You are a UX expert. Analyze the site context inside <site_context>. Always respond in English.
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
            `Audit UX for the content inside <site_context> in the following snapshot:\n${siteContext}`
        )
        // SEO Audit Task
        const seoPromise = callSiliconFlow(
            DEFAULT_MODELS.seo,
            `You are an SEO expert. Analyze the site context inside <site_context>. Always respond in English.
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
            `Audit SEO for the content inside <site_context> in the following snapshot:\n${siteContext}`
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
            `Audit Copy for the content inside <site_context> in the following snapshot:\n${siteContext}`
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
            `Audit CRO for the content inside <site_context> in the following snapshot:\n${siteContext}`
        )

        // Compliance, Accessibility & Security Task (saved to performance_audit column)
        const securityPromise = callSiliconFlow(
            DEFAULT_MODELS.security, // Using lighter Qwen 2.5 7B for faster security checks
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
            `Audit Security & Compliance for the content inside <site_context> in the following snapshot:\n${siteContext}`
        )

        // Wait for all LLM calls
        console.time('🤖 LLM Calls (6 parallel)')
        const [roastRaw, uxRaw, seoRaw, copyRaw, croRaw, securityRaw] = await Promise.all([
            roastPromise,
            uxPromise,
            seoPromise,
            copyPromise,
            croPromise,
            securityPromise
        ])
        console.timeEnd('🤖 LLM Calls (6 parallel)')

        const parseJSON = (str: string, fallbackScore = 50) => {
            try {
                // Remove potential markdown wrappers often returned by models
                const cleaned = str.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim()
                const data = JSON.parse(cleaned)
                if (typeof data.score !== 'number') data.score = fallbackScore
                if (!data.issues) data.issues = []
                return data
            } catch {
                console.warn('❌ JSON Parse Failed for AI output:', str.substring(0, 100))
                return { score: fallbackScore, summary: "Analysis partial due to AI formatting error.", issues: [] }
            }
        }

        const roast = parseJSON(roastRaw, 50)
        const ux = parseJSON(uxRaw, 60)
        const seo = parseJSON(seoRaw, 60)
        const copy = parseJSON(copyRaw, 60)
        const cro = parseJSON(croRaw, 60)
        const security = parseJSON(securityRaw, 70)

        // Calculate final score
        const finalScore = Math.round((roast.score + ux.score + seo.score + copy.score + cro.score + security.score) / 6)

        console.log('📊 Final Calculations:', {
            finalScore,
            roastScore: roast.score,
            uxScore: ux.score,
            seoScore: seo.score,
            copyScore: copy.score,
            croScore: cro.score,
            securityScore: security.score
        })

        // 6. Save to DB using service role
        const supabaseAdmin = createSupabaseClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        // Log what we're about to insert
        console.log('💾 Preparing DB insert:', {
            user_id: userId || null,
            url: validUrl.toString(),
            score: finalScore,
            has_roast: !!roast,
            has_ux: !!ux,
            has_seo: !!seo,
            has_copy: !!copy,
            has_cro: !!cro,
            has_security: !!security,
            is_public: isPublic ?? true,
            tone
        })

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
            console.error('❌ DB Insert Error:', {
                message: dbError.message,
                details: dbError.details,
                hint: dbError.hint,
                code: dbError.code
            })
            return NextResponse.json({
                error: 'Failed to save roast result',
                details: dbError.message
            }, { status: 500 })
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
