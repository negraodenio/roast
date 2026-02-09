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
        <nav className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
                    <Flame className="w-6 h-6 text-red-500 fill-red-500" />
                    <span>RoastMySite</span>
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
