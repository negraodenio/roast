"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { User } from "@supabase/supabase-js"
import { LogOut, LayoutDashboard, Flame } from "lucide-react"
import { useRouter } from "next/navigation"

export function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:opacity-80 transition-all group">
                    <div className="relative">
                        <Flame className="w-8 h-8 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full -z-10 group-hover:bg-red-500/40 transition-all" />
                    </div>
                    <span>Roast<span className="text-red-500">This</span></span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/wall" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                        Roast Wall
                    </Link>

                    {user ? (
                        <>
                            <Link href="/dashboard">
                                <Button variant="ghost" className="text-zinc-400 hover:text-white">
                                    <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                                </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={handleSignOut}>
                                <LogOut className="w-4 h-4 text-zinc-400" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" className="text-zinc-400 hover:text-white">Login</Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-white text-black hover:bg-zinc-200">Get Started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
