import { Navbar } from "@/components/navbar"
import { UrlInput } from "@/components/url-input"
import { RoastCard } from "@/components/roast-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export default async function Home() {
    const supabase = createClient()

    // Fetch a few public roasts for social proof
    const { data: recentRoasts } = await supabase
        .from('roasts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(3)

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="flex-1 flex flex-col">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 px-4 text-center overflow-hidden">
                    {/* Background Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-600/20 rounded-full blur-[120px] -z-10" />

                    <div className="container mx-auto max-w-4xl relative z-10">
                        <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-medium text-sm animate-pulse">
                            🔥 AI-Powered Brutality
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-500">
                            Your Website Sucks.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Let AI Tell You Why.</span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                            Get a brutally honest AI roast + actionable fixes for UX, SEO, and copy.
                            Increase conversions by fixing what&apos;s broken.
                        </p>

                        <UrlInput />

                        <p className="mt-4 text-sm text-zinc-500">
                            3 free roasts. No credit card required.
                        </p>

                        {/* Social Proof Numbers */}
                        <div className="mt-12 flex items-center justify-center gap-8 text-zinc-500">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">12,847+</div>
                                <div className="text-xs uppercase tracking-wider">Sites Roasted</div>
                            </div>
                            <div className="h-8 w-px bg-zinc-800" />
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">4.2/10</div>
                                <div className="text-xs uppercase tracking-wider">Avg Score</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-zinc-900/30 border-y border-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black mb-4">Complete 360° Analysis</h2>
                            <p className="text-zinc-400 max-w-2xl mx-auto">
                                Most tools just check SEO. We roast everything that makes your visitors leave.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-red-500/50 transition-colors group">
                                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                                    <span className="text-2xl">🎨</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">UX & Design</h3>
                                <p className="text-zinc-400">We analyze layout, navigation, and visual hierarchy to spot why users get confused.</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-orange-500/50 transition-colors group">
                                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                                    <span className="text-2xl">✍️</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Copywriting</h3>
                                <p className="text-zinc-400">Your headlines are boring. We tell you exactly how to rewrite them to sell more.</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-yellow-500/50 transition-colors group">
                                <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-500/20 transition-colors">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Conversion (CRO)</h3>
                                <p className="text-zinc-400">Identify friction points in your funnel and CTAs that are killing your sales.</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-green-500/50 transition-colors group">
                                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                                    <span className="text-2xl">🔍</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">SEO Health</h3>
                                <p className="text-zinc-400">Technical checks for meta tags, headings, and structure to help you rank.</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-blue-500/50 transition-colors group relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-bl-lg">New</div>
                                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                                    <span className="text-2xl">⚖️</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Legal & Compliance</h3>
                                <p className="text-zinc-400">Don't get sued. We check for Privacy Policies, Terms, and Accessibility basics.</p>
                            </div>

                            <div className="p-8 rounded-2xl bg-black border border-zinc-800 hover:border-purple-500/50 transition-colors group">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                                    <span className="text-2xl">🛠️</span>
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Actionable Fixes</h3>
                                <p className="text-zinc-400">We don't just roast. We give you step-by-step instructions on how to fix every issue.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Roasts */}
                <section className="py-20 bg-zinc-950/50 border-t border-zinc-900">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold">Recent Victims</h2>
                            <Link href="/wall">
                                <Button variant="outline">View All 🔥</Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {recentRoasts?.map((roast) => (
                                <RoastCard
                                    key={roast.id}
                                    id={roast.id}
                                    url={roast.url}
                                    score={roast.score}
                                    date={roast.created_at}
                                    headline={typeof roast.roast_text === 'string' ? JSON.parse(roast.roast_text).headline : roast.roast_text?.headline}
                                />
                            ))}
                            {!recentRoasts?.length && (
                                <div className="col-span-3 text-center py-10 text-zinc-500">
                                    No roasts yet. Be the first!
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-8 border-t border-zinc-900 text-center text-zinc-500 text-sm">
                Built with 😡 and ☕ by RoastThis.
            </footer>
        </div>
    )
}
