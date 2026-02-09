import { createClient } from "@/lib/supabase/server"
import { ScoreCounter } from "@/components/score-counter"
import { AuditSection } from "@/components/audit-section"
import { ShareButtons } from "@/components/share-buttons"
import { Navbar } from "@/components/navbar"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
    const isOwner = user?.id && roast.user_id === user.id
    const showFullDetails = isOwner || roast.paid || false // Agency check omitted for MVP simplicity

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
        if (typeof roast.roast_text === 'string') {
            const parsed = JSON.parse(roast.roast_text)
            headline = parsed.headline || headline
            roastBody = parsed.roast || roast.roast_text
        } else if (typeof roast.roast_text === 'object') {
            headline = (roast.roast_text as { headline?: string }).headline || headline
            roastBody = (roast.roast_text as { roast?: string }).roast || ""
        }
    } catch { }

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="container mx-auto px-4 py-10 flex-1">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Roast Another Site
                </Link>

                <div className="grid lg:grid-cols-2 gap-12 items-start opacity-0 animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-forwards">
                    {/* Left Column: The Roast */}
                    <div className="space-y-8">
                        <div className="text-center lg:text-left">
                            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400">
                                Target: {roast.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
                                &quot;{headline}&quot;
                            </h1>
                        </div>

                        <ScoreCounter score={roast.score} />

                        <div className="prose prose-invert prose-lg max-w-none bg-zinc-900/30 p-6 rounded-xl border border-zinc-800">
                            <div dangerouslySetInnerHTML={{ __html: roastBody.replace(/\n/g, '<br/>') }} />
                        </div>

                        <ShareButtons roastId={roast.id} score={roast.score} url={roast.url} />
                    </div>

                    {/* Right Column: Audits */}
                    <div>
                        <div className="sticky top-24">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                Detailed Audit
                                {!showFullDetails && <span className="ml-2 text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">LOCKED</span>}
                            </h2>
                            <AuditSection roast={safeRoast} isLocked={!showFullDetails} />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-8 border-t border-zinc-900 text-center text-zinc-500 text-sm">
                RoastMySite &copy; {new Date().getFullYear()}
            </footer>
        </div>
    )
}
