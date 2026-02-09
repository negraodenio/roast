import { Navbar } from "@/components/navbar"
import { RoastCard } from "@/components/roast-card"
import { createClient } from "@/lib/supabase/server"

export default async function WallPage() {
    const supabase = createClient()

    const { data: roasts } = await supabase
        .from('roasts')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(50)

    return (
        <div className="min-h-screen bg-black flex flex-col">
            <Navbar />

            <main className="container mx-auto px-4 py-12 flex-1">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black mb-4">Roast Wall of Fame</h1>
                    <p className="text-zinc-400 text-xl">The best of the worst. Browse recent victims.</p>
                </div>

                {/* Masonry-like grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {roasts?.map((roast) => (
                        <RoastCard
                            key={roast.id}
                            id={roast.id}
                            url={roast.url}
                            score={roast.score}
                            date={roast.created_at}
                            headline={typeof roast.roast_text === 'string' ? JSON.parse(roast.roast_text).headline : roast.roast_text?.headline}
                        />
                    ))}
                </div>
            </main>

            <footer className="py-8 border-t border-zinc-900 text-center text-zinc-500 text-sm">
                RoastMySite &copy; {new Date().getFullYear()}
            </footer>
        </div>
    )
}
