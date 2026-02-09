"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Flame, LayoutDashboard, Plus, CreditCard, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
    }

    const links = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/new", label: "New Roast", icon: Plus },
        { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-black flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 font-black text-xl hover:opacity-80 transition-opacity">
                        <Flame className="w-6 h-6 text-red-500 fill-red-500" />
                        <span>RoastMySite</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {links.map(link => {
                        const isActive = pathname === link.href
                        return (
                            <Link key={link.href} href={link.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn("w-full justify-start", isActive ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900")}
                                >
                                    <link.icon className="w-4 h-4 mr-2" />
                                    {link.label}
                                </Button>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-zinc-800">
                    <Button variant="ghost" className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-red-950/20" onClick={handleSignOut}>
                        <LogOut className="w-4 h-4 mr-2" /> Sign Out
                    </Button>
                </div>
            </aside>

            {/* Mobile Header (TODO: Hamburger) */}

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}
