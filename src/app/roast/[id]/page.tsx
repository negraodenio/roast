import { createClient } from "@/lib/supabase/server"
import { ScoreCounter } from "@/components/score-counter"
import { AuditSection } from "@/components/audit-section"
import { ShareButtons } from "@/components/share-buttons"
import { Navbar } from "@/components/navbar"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { marked } from 'marked'

export const maxDuration = 60

export default async function RoastResultPage({ params }: { params: { id: string } }) {
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

    // Mask audit data if locked to prevent HTML scraping of unlocked content
    const safeRoast = showFullDetails ? roast : {
        ...roast,
        ux_audit: null,
        seo_audit: null,
        copy_audit: null,
        conversion_tips: null,
        performance_audit: null
    }

    // Parse roast text
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

    // Prepare sub-scores for credibility
    const subScores = {
        ux: roast.ux_audit?.score,
        seo: roast.seo_audit?.score,
        copy: roast.copy_audit?.score,
        conversion: roast.conversion_tips?.score,
        security: roast.performance_audit?.score
    }

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

                            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.9] text-white">
                                <span className="text-primary italic mr-2">&quot;</span>
                                {headline}
                                <span className="text-primary italic ml-1">&quot;</span>
                            </h1>
                        </header>

                        <section className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <ScoreCounter score={roast.score} subScores={subScores} />
                        </section>

                        <div className="bg-zinc-900/40 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-zinc-800 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <span className="text-8xl font-black italic">!</span>
                            </div>

                            <h2 className="text-xl font-bold mb-6 text-zinc-400 flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full items-center" />
                                The Savage Truth
                            </h2>

                            <article className="prose prose-invert prose-lg max-w-none 
                                prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                                prose-p:text-zinc-400 prose-p:leading-relaxed
                                prose-strong:text-primary prose-strong:font-bold
                                prose-li:text-zinc-400">
                                <div dangerouslySetInnerHTML={{ __html: marked.parse(roastBody) as string }} />
                            </article>
                        </div>

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

