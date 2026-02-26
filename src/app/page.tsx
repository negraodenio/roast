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

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-24 md:py-40 px-4 text-center overflow-hidden">
                    {/* Dynamic Background Effects */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-red-600/10 rounded-full blur-[160px] -z-10 animate-pulse" />
                    <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] -z-10" />

                    <div className="container mx-auto max-w-5xl relative z-10">
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            AI-Powered Brutality
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
                            Your Website Sucks.<br />
                            <span className="text-red-500 italic">Let AI Tell You Why.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-zinc-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                            Stop guessing. Get a <span className="text-zinc-200">brutally honest</span> audit + actionable fixes for UX, SEO, and copy.
                        </p>

                        <div className="max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
                            <UrlInput />
                        </div>

                        <p className="mt-6 text-sm text-zinc-600 font-bold uppercase tracking-widest leading-none">
                            3 free roasts &bull; No credit card &bull; Instant Analysis
                        </p>
                    </div>
                </section>

                {/* Features Section - Bento Grid */}
                <section className="py-32 bg-black border-y border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase whitespace-nowrap">360° Forensic Analysis</h2>
                            <p className="text-zinc-500 max-w-2xl mx-auto text-lg leading-relaxed">
                                We don&apos;t just check SEO. We tear down everything that makes your visitors leave.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[240px]">
                            {/* UX Card - Large */}
                            <div className="md:col-span-3 md:row-span-2 p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 backdrop-blur-xl flex flex-col justify-end group hover:border-red-500/30 transition-all">
                                <span className="text-4xl mb-6">🎨</span>
                                <h3 className="text-3xl font-black mb-3 text-white uppercase tracking-tighter">UX & Design</h3>
                                <p className="text-zinc-400 text-lg leading-relaxed">Layout, navigation, and visual hierarchy. We find where users get stuck and why they bounce.</p>
                            </div>

                            {/* Copy Card */}
                            <div className="md:col-span-3 md:row-span-1 p-8 rounded-[2rem] bg-zinc-900/20 border border-zinc-800 flex items-center gap-6 group hover:border-zinc-700 transition-all">
                                <div className="text-4xl">✍️</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 text-white">Copywriting</h3>
                                    <p className="text-zinc-500 text-sm">Convert readers into buyers with punchy headlines.</p>
                                </div>
                            </div>

                            {/* SEO Card */}
                            <div className="md:col-span-3 md:row-span-1 p-8 rounded-[2rem] bg-zinc-900/20 border border-zinc-800 flex items-center gap-6 group hover:border-zinc-700 transition-all">
                                <div className="text-4xl">🔍</div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1 text-white">SEO Health</h3>
                                    <p className="text-zinc-500 text-sm">Technical audits that Google will actually love.</p>
                                </div>
                            </div>

                            {/* Conversion Card */}
                            <div className="md:col-span-2 md:row-span-1 p-8 rounded-[2rem] bg-red-600/10 border border-red-500/20 flex flex-col justify-center gap-2 group hover:bg-red-600/20 transition-all">
                                <div className="text-2xl">💰</div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Conversion</h3>
                                <p className="text-zinc-400 text-xs leading-tight">Identity friction points in your funnel.</p>
                            </div>

                            {/* Legal Card */}
                            <div className="md:col-span-2 md:row-span-1 p-8 rounded-[2rem] bg-zinc-900/40 border border-white/5 flex flex-col justify-center gap-2">
                                <div className="text-2xl">⚖️</div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Legal</h3>
                                <p className="text-zinc-400 text-xs leading-tight">GDPR, Terms, and Privacy checks.</p>
                            </div>

                            {/* Fixes Card */}
                            <div className="md:col-span-2 md:row-span-1 p-8 rounded-[2rem] bg-zinc-800 border border-zinc-700 flex flex-col justify-center gap-2">
                                <div className="text-2xl">🛠️</div>
                                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">Fixes</h3>
                                <p className="text-zinc-400 text-xs leading-tight">Step-by-step implementation logs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section className="py-32 bg-black relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[180px] -z-10" />

                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Simple, Brutal Pricing</h2>
                            <p className="text-zinc-500 max-w-xl mx-auto text-lg leading-relaxed">
                                No hidden fees. Just the truth your designers are too afraid to tell you.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Single Roast */}
                            <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/10 flex flex-col items-center text-center relative group hover:border-red-500/50 transition-all backdrop-blur-xl">
                                <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] uppercase font-black px-4 py-1.5 rounded-bl-[1.5rem] tracking-widest">Most Popular</div>
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-zinc-400">Single Roast</h3>
                                <div className="text-6xl font-black mb-4 text-white">9,99€</div>
                                <p className="text-zinc-500 text-sm mb-10 italic">&quot;The reality check your site needs.&quot;</p>

                                <ul className="space-y-4 text-left w-full mb-12 text-zinc-400 font-medium">
                                    <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✓</span> Full UX/SEO/Copy Roast</li>
                                    <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✓</span> 10 Actionable Fixes</li>
                                    <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✓</span> PDF Export (Basic)</li>
                                    <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✓</span> Lifetime Access to Report</li>
                                </ul>

                                <Link href="#" className="w-full">
                                    <Button className="w-full bg-white text-black hover:bg-zinc-200 font-black h-16 rounded-2xl text-lg uppercase tracking-widest shadow-xl shadow-white/5 transition-all">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>

                            {/* Agency Plan */}
                            <div className="p-10 rounded-[2.5rem] bg-black border border-white/5 flex flex-col items-center text-center hover:border-zinc-700 transition-all group">
                                <h3 className="text-2xl font-black mb-2 uppercase tracking-tight text-zinc-600">Agency</h3>
                                <div className="text-6xl font-black mb-4 text-white">49€<span className="text-2xl text-zinc-700">/mo</span></div>
                                <p className="text-zinc-500 text-sm mb-10 italic">&quot;Roast your clients into submission.&quot;</p>

                                <ul className="space-y-4 text-left w-full mb-12 text-zinc-500">
                                    <li className="flex items-center gap-3"><span className="text-zinc-700 font-bold">✓</span> Unlimited Roasts</li>
                                    <li className="flex items-center gap-3"><span className="text-zinc-700 font-bold">✓</span> White-label Reports</li>
                                    <li className="flex items-center gap-3"><span className="text-zinc-700 font-bold">✓</span> Custom Expert Persona</li>
                                    <li className="flex items-center gap-3"><span className="text-zinc-700 font-bold">✓</span> API Access</li>
                                </ul>

                                <Link href="#" className="w-full">
                                    <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800 font-black h-16 rounded-2xl text-lg uppercase tracking-widest transition-all">
                                        Go Pro
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Recent Roasts */}
                <section className="py-32 bg-zinc-950/20 border-t border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2">Recent Victims</h2>
                                <p className="text-zinc-500">Public audits of sites that dared to ask.</p>
                            </div>
                            <Link href="/wall">
                                <Button variant="outline" className="border-zinc-800 rounded-xl hover:bg-zinc-900 px-8 h-12 font-bold transition-all w-full md:w-auto">
                                    View Roast Wall 🔥
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                                <div className="col-span-3 text-center py-20 rounded-[2rem] border border-dashed border-zinc-900 text-zinc-600 font-medium bg-zinc-950/50 italic">
                                    No roasts yet. Be the first to be annihilated.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-zinc-600 text-xs font-black uppercase tracking-[0.3em]">
                Built with 😡 and ☕ by RoastThis &bull; All Sins Exposed
            </footer>
        </div>
    )
}
