import { createClient } from "@/lib/supabase/server"
import { ScoreCounter } from "@/components/score-counter"
import { AuditSection } from "@/components/audit-section"
import { ShareButtons } from "@/components/share-buttons"
import { Navbar } from "@/components/navbar"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { marked } from 'marked'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const supabase = createClient()
    const { data: roast } = await supabase
        .from('roasts')
        .select('website_url, headline, summary')
        .eq('id', params.id)
        .single()

    const title = roast ? `Roast: ${roast.website_url}` : 'Roast Report'
    const description = roast?.headline || 'Behold the brutal truth about this website.'

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: `/api/og?id=${params.id}`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`/api/og?id=${params.id}`],
        },
    }
}

export const maxDuration = 60

export default async function RoastPage({ params }: { params: { id: string } }) {
    const supabase = createClient()

    const { data: roast } = await supabase
        .from('roasts')
        .select('*')
        .eq('id', params.id)
        .single()

    if (!roast) {
        notFound()
    }

    const { data: { user } } = await supabase.auth.getUser()

    // Access Control Logic (server-side check matches API)
    const { data: profile } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user?.id || '')
        .single()

    const isOwner = user?.id && roast.user_id === user.id
    const isAgency = profile?.plan === 'agency'
    const showFullDetails = isOwner || isAgency || roast.paid || false

    // Parse roast text first so we can include the clean version in safeRoast
    let headline = "Your Website Sucks."
    let roastBody = ""
    try {
        const rawRoast = roast.roast_text
        if (rawRoast && typeof rawRoast === 'object') {
            headline = rawRoast.headline || headline
            roastBody = rawRoast.roast || ""
        } else if (typeof rawRoast === 'string') {
            try {
                const parsed = JSON.parse(rawRoast)
                headline = parsed.headline || headline
                roastBody = parsed.roast || rawRoast
            } catch {
                roastBody = rawRoast
            }
        }
    } catch (e) {
        console.error("Error parsing roast text:", e)
    }

    // SECURITY: Strict whitelist — never send full data to browser if not paid.
    // Using explicit field selection, NOT spread, to prevent accidental data leaks.
    const safeRoast = showFullDetails ? { ...roast, roast_text: roastBody } : {
        // Safe metadata only
        id: roast.id,
        url: roast.url,
        score: roast.score,
        paid: roast.paid,
        is_public: roast.is_public,
        created_at: roast.created_at,
        tone: roast.tone,
        user_id: roast.user_id,
        // Only preview of roast text (first 160 chars)
        roast_text: roastBody.substring(0, 160) + "...",
        // Scores only + max 2 issues per category
        ux_audit: { score: roast.ux_audit?.score, issues: roast.ux_audit?.issues?.slice(0, 2) },
        seo_audit: { score: roast.seo_audit?.score, issues: roast.seo_audit?.issues?.slice(0, 2) },
        copy_audit: { score: roast.copy_audit?.score, issues: [] }, // Zero issues for copy on free tier
        conversion_tips: { score: roast.conversion_tips?.score, issues: [] }, // Zero for conversion on free tier
        performance_audit: { score: roast.performance_audit?.score, issues: roast.performance_audit?.issues?.slice(0, 1) },
    }



    // Prepare sub-scores for credibility
    const subScores = {
        ux: roast.ux_audit?.score,
        seo: roast.seo_audit?.score,
        copy: roast.copy_audit?.score,
        conversion: roast.conversion_tips?.score,
        security: roast.performance_audit?.score
    }

    // Calculate credibility stats
    const calculateStats = () => {
        let elementsAnalyzed = 0
        let issuesFound = 0

        // Count issues from all audits
        const audits = [roast.ux_audit, roast.seo_audit, roast.copy_audit, roast.conversion_tips, roast.performance_audit]
        audits.forEach(audit => {
            if (audit?.issues) {
                issuesFound += audit.issues.length
                elementsAnalyzed += audit.issues.length * 3 // Approximation
            }
        })

        // Add baseline elements
        elementsAnalyzed += 50

        return {
            elementsAnalyzed,
            issuesFound,
            analysisTime: 28 // Could be calculated from created_at if we store start time
        }
    }

    const stats = calculateStats()

    return (
        <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans selection:bg-primary/30">
            <Navbar />

            <main className="container mx-auto px-4 py-12 md:py-20 flex-1 max-w-7xl">
                <Link href="/" className="group inline-flex items-center text-zinc-500 hover:text-primary transition-colors mb-10 text-sm font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Roast Another Site
                </Link>

                <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-16 items-start">
                    {/* Left Column: The Roast Content */}
                    <div className="space-y-12">
                        <header className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/50 border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <span className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                                Analyzing: {roast.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </div>

                            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
                                💀 Your site is underperforming
                            </h1>
                            <p className="text-xl text-zinc-500 font-medium">
                                You&apos;re losing visitors right now.
                            </p>
                        </header>

                        <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 shadow-xl">
                            <h2 className="text-3xl font-black text-white">
                                Score: {roast.score}/100
                            </h2>
                            <p className="text-zinc-500 mt-2 font-medium">
                                Every day you wait = lost conversions.
                            </p>
                        </div>

                        {/* Top Problems Extracted */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-white">
                                You&apos;re losing visitors because:
                            </h3>
                            <ul className="space-y-4">
                                {safeRoast.ux_audit?.issues?.slice(0, 2).map((issue: any, i: number) => (
                                    <li key={`ux-${i}`} className="flex items-start gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                                        <div className="mt-1 text-red-500 font-bold shrink-0">❌</div>
                                        <div>
                                            <strong className="block text-white mb-1">{issue.title}</strong>
                                            <span className="text-zinc-400 text-sm leading-relaxed">{issue.description}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-zinc-900/40 p-8 md:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
                            <h2 className="text-xl font-bold mb-6 text-zinc-400 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full items-center" />
                                🚨 Savage Truth (preview)
                            </h2>

                            <article className="prose prose-invert prose-lg max-w-none 
                                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                                prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-l-4 prose-h2:border-primary prose-h2:pl-4
                                prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5 prose-h3:text-orange-400
                                prose-p:text-zinc-300 prose-p:leading-relaxed prose-p:mb-5
                                prose-strong:text-white prose-strong:font-bold
                                prose-em:text-primary prose-em:not-italic
                                prose-ul:space-y-3 prose-ul:my-6
                                prose-li:text-zinc-300 prose-li:leading-relaxed prose-li::marker:text-primary
                                prose-code:bg-zinc-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-primary prose-code:font-mono
                                prose-blockquote:border-l-4 prose-blockquote:border-yellow-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-zinc-400">
                                <div dangerouslySetInnerHTML={{ __html: marked.parse(showFullDetails ? roastBody : roastBody.substring(0, 160) + "...") as string }} />
                            </article>

                            {!showFullDetails && (
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent flex items-end p-8">
                                    <p className="text-sm font-bold text-zinc-400 tracking-widest uppercase">
                                        🔒 + more brutal insights hidden
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        {/* Mid-Page Interrupt */}
                        {!showFullDetails && (
                            <div className="bg-red-600 p-8 rounded-3xl text-center shadow-[0_0_40px_rgba(220,38,38,0.2)]">
                                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter">
                                    🚫 Stop guessing.
                                </h3>
                                <p className="mt-3 text-red-100 font-medium text-lg">
                                    Your competitors are fixing this right now.
                                </p>
                            </div>
                        )}

                        <div className="pt-4 border-t border-zinc-900">
                            <ShareButtons roastId={roast.id} score={roast.score} url={roast.url} />
                        </div>
                    </div>

                    {/* Right Column: Detailed Audit & Gated Content */}
                    <aside className="lg:sticky lg:top-24 space-y-8">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                                Detailed Audit
                            </h2>
                            {!showFullDetails && (
                                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-1 rounded-md border border-primary/20 tracking-widest uppercase">
                                    Locked
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <AuditSection roast={safeRoast} isLocked={!showFullDetails} />
                        </div>

                        {/* Summary Card for credibility if locked */}
                        {!showFullDetails && (
                            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-sm text-zinc-500 leading-relaxed italic">
                                &ldquo;The analysis covers accessibility, semantic HTML, mobile responsiveness, and
                                psychological triggers in your copywriting.&rdquo;
                            </div>
                        )}
                    </aside>
                </div>
            </main>

            <footer className="py-12 border-t border-zinc-900/50 bg-black/50 text-center text-zinc-600 text-[11px] font-bold uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} RoastThis AI Labs &bull; All Sins Exposed
            </footer>
        </div>
    )
}

