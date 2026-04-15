import { Navbar } from "@/components/navbar"
import { UrlInput } from "@/components/url-input"
import { RoastCard } from "@/components/roast-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { CTAButton } from "@/components/cta-button"
import { Rocket, ShieldAlert, Zap, Target, TrendingDown, Users, Search, PenTool } from "lucide-react"

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
        <div className="min-h-screen bg-black flex flex-col selection:bg-red-500/30">
            <Navbar />

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="relative py-24 md:py-40 px-4 text-center overflow-hidden border-b border-white/5">
                    {/* Background Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-red-600/10 rounded-full blur-[160px] -z-10 animate-pulse" />
                    
                    <div className="container mx-auto max-w-5xl relative z-10">
                        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-500 font-bold text-xs uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            🔥 1,247 websites analyzed this week
                        </div>

                        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.85] text-white">
                            Your website is <br />
                            <span className="text-red-500 italic">losing you money.</span>
                        </h1>
                        
                        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                            <span className="text-zinc-200">Find exactly why visitors don’t convert</span> — in 10 seconds. Brutally honest audit of your UX, SEO, and copy.
                        </p>

                        <div className="max-w-2xl mx-auto transform hover:scale-[1.01] transition-transform duration-500 bg-zinc-900/40 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <UrlInput />
                        </div>

                        <div className="mt-8 flex flex-col items-center gap-1">
                            <div className="flex items-center gap-4 text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">
                                <span>No Signup</span>
                                <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                <span>Takes 10 seconds</span>
                                <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                <span>3 Free Credits</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. PAIN SECTION (CRITICAL) */}
                <section className="py-32 bg-zinc-950 border-b border-white/5">
                    <div className="container mx-auto px-4 max-w-4xl text-center">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white uppercase">
                            Most websites don&apos;t have a traffic problem.
                        </h2>
                        <p className="text-2xl md:text-3xl text-red-500 font-bold italic mb-12">
                            They have a conversion problem.
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-6 text-left">
                            {[
                                "Visitors don't understand what you do in 3 seconds",
                                "Your messaging is weak and generic",
                                "Your UX confuses people and kills trust",
                                "You're losing revenue every single day"
                            ].map((text, i) => (
                                <div key={i} className="flex items-start gap-4 p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
                                    <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                                    <p className="text-lg text-zinc-300 font-medium leading-tight">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. WHAT WE DO (BENTO GRID) */}
                <section className="py-32 bg-black relative">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20 max-w-3xl mx-auto">
                            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white uppercase">
                                We find exactly where you&apos;re losing customers.
                            </h2>
                            <p className="text-zinc-500 text-xl leading-relaxed">
                                UX, SEO, copywriting and conversion — brutally analyzed by AI and expert patterns.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { title: "UX Audit", desc: "Where users get confused and leave", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
                                { title: "Copy Roast", desc: "Why your message isn't converting", icon: PenTool, color: "text-orange-500", bg: "bg-orange-500/10" },
                                { title: "SEO Health", desc: "Hidden technical issues killing visibility", icon: Search, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                                { title: "Conversion", desc: "Identify exact revenue leak points", icon: TrendingDown, color: "text-red-500", bg: "bg-red-500/10" }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-zinc-700 transition-all group">
                                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                                    <p className="text-zinc-500 leading-snug">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. MID-PAGE INTERRUPT */}
                <section className="py-24 bg-red-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tighter uppercase italic">
                            🚫 Stop guessing.
                        </h2>
                        <p className="text-xl md:text-2xl text-red-100 font-bold mb-10 max-w-2xl mx-auto">
                            🔥 This site is costing you customers right now. Every day you wait = lost revenue.
                        </p>
                        <CTAButton className="bg-white text-black hover:bg-zinc-100 px-12 h-16 rounded-2xl font-black text-lg shadow-2xl">
                            Fix My Website Now →
                        </CTAButton>
                    </div>
                </section>

                {/* 5. PRICING (REWRITTEN) */}
                <section className="py-32 bg-black">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter text-white">
                                Fix your website before it costs you more.
                            </h2>
                        </div>

                        <div className="max-w-xl mx-auto">
                            <div className="p-1 md:p-12 rounded-[3rem] bg-zinc-900/50 border border-red-500/20 flex flex-col items-center text-center relative backdrop-blur-xl shadow-2xl shadow-red-500/5">
                                <div className="absolute -top-4 bg-red-600 text-white text-xs uppercase font-black px-6 py-2 rounded-full tracking-widest shadow-xl">
                                    Recommended
                                </div>
                                <h3 className="text-3xl font-black mb-2 uppercase tracking-tight text-white mt-4">Full Audit</h3>
                                <div className="flex items-baseline gap-1 mb-2">
                                    <span className="text-7xl font-black text-white">€9.99</span>
                                </div>
                                <p className="text-zinc-500 text-sm mb-10 font-bold italic">&quot;The reality check your revenue needs.&quot;</p>

                                <ul className="space-y-4 text-left w-full mb-12 text-zinc-300">
                                    {[
                                        "Full UX & Layout breakdown",
                                        "Copy & Messaging fixes",
                                        "Technical SEO Audit",
                                        "Conversion improvement tips",
                                        "Step-by-step actionable list"
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Zap className="w-4 h-4 text-red-500 fill-red-500" />
                                            <span className="font-medium text-lg">{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <CTAButton className="w-full bg-red-600 hover:bg-red-700 text-white font-black h-20 rounded-[2rem] text-xl uppercase tracking-widest shadow-2xl shadow-red-600/20">
                                    Fix My Website Now →
                                </CTAButton>
                                
                                <p className="mt-8 text-sm text-red-500 font-black uppercase tracking-widest animate-pulse">
                                    🔥 You&apos;re already losing visitors
                                </p>
                            </div>

                            {/* Hidden/Secondary Agency Plan */}
                            <div className="mt-12 text-center opacity-60 hover:opacity-100 transition-opacity">
                                <p className="text-zinc-500 font-bold mb-4 uppercase text-xs tracking-widest">Running multiple sites?</p>
                                <Link href="#" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white font-bold border border-zinc-800 rounded-full px-6 py-3 transition-colors">
                                    For agencies → €49/mo (Unlimited Roasts)
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. SOCIAL PROOF (WALL) */}
                <section className="py-32 bg-zinc-950/20 border-t border-white/5">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                            <div>
                                <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 text-white">Recent websites roasted 🔥</h2>
                                <p className="text-zinc-500">Public audits of sites that dared to seek the truth.</p>
                            </div>
                            <Link href="/wall">
                                <Button variant="outline" className="border-zinc-800 rounded-xl hover:bg-zinc-900 px-8 h-12 font-bold transition-all w-full md:w-auto">
                                    View Roast Wall
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
                                    No roasts yet. Be the first victim.
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 7. FINAL CTA */}
                <section className="py-40 border-t border-white/5 relative overflow-hidden">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 rounded-full blur-[120px] -z-10" />
                    
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase max-w-4xl mx-auto leading-none">
                            Your competitors are already fixing their websites. <br />
                            <span className="text-red-500 italic text-5xl md:text-8xl block mt-4">You&apos;re not.</span>
                        </h2>
                        <div className="mt-12">
                            <CTAButton className="bg-white text-black hover:bg-zinc-100 px-14 h-20 rounded-3xl font-black text-2xl shadow-3xl transform hover:scale-105 transition-all">
                                Get My Audit →
                            </CTAButton>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em]">
                Built with 😡 by RoastThis &bull; All Rights to the Truth
            </footer>
        </div>
    )
}
