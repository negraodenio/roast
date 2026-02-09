import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RoastCard } from "@/components/roast-card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

    const { data: roasts } = await supabase
        .from('roasts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const credits = profile?.credits ?? 0
    const totalRoasts = roasts?.length ?? 0
    const avgScore = roasts?.length ? Math.round(roasts.reduce((acc, r) => acc + r.score, 0) / roasts.length) : '-'

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Link href="/dashboard/new">
                    <Button className="bg-red-600 hover:bg-red-700">
                        <Plus className="w-4 h-4 mr-2" /> New Roast
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Credits Remaining</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold">{credits}</div></CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Total Roasts</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold">{totalRoasts}</div></CardContent>
                </Card>
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-400">Average Score</CardTitle></CardHeader>
                    <CardContent><div className="text-3xl font-bold">{avgScore}</div></CardContent>
                </Card>
            </div>

            <h2 className="text-xl font-bold mb-6">Your Recent Roasts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {!roasts?.length && (
                    <div className="col-span-3 text-center py-10 text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                        You haven&apos;t roasted any sites yet.
                        <Link href="/dashboard/new" className="text-red-500 hover:underline ml-1">Get started.</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
