"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Sparkles, History, Loader2, ArrowUpRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UpgradeModal } from "@/components/upgrade-modal"

interface Profile {
    id: string
    plan: string
    credits: number
    stripe_customer_id?: string
}

export default function BillingPage() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [portalLoading, setPortalLoading] = useState(false)
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
    const supabase = createClient()
    const { toast } = useToast()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()
                setProfile(data)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [supabase])

    const handleManageSubscription = async () => {
        setPortalLoading(true)
        try {
            const res = await fetch('/api/stripe/portal', { method: 'POST' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to open portal')
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error: unknown) {
            toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive'
            })
        } finally {
            setPortalLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Billing</h1>
                <p className="text-zinc-500">Manage your subscription, credits, and transaction history.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Plan Status Card - Glassmorphism */}
                <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 shadow-2xl transition-all hover:border-red-500/30">
                    <div className="absolute top-0 right-0 p-6 opacity-10 -rotate-12 transition-transform group-hover:rotate-0">
                        <Sparkles className="w-24 h-24 text-red-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6 uppercase tracking-widest text-[10px] font-black text-zinc-500">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Current Plan
                        </div>

                        <h2 className="text-5xl font-black text-white mb-2 capitalize">{profile?.plan || 'Free'}</h2>
                        <p className="text-zinc-400 mb-8 italic">
                            {profile?.plan === 'agency' ? '"Ultimate power at your fingertips."' : '"The journey to brilliance begins here."'}
                        </p>

                        <div className="mt-auto pt-6 flex gap-3">
                            {profile?.stripe_customer_id ? (
                                <Button
                                    onClick={handleManageSubscription}
                                    disabled={portalLoading}
                                    className="bg-white text-black hover:bg-zinc-200 font-bold px-6 py-6 rounded-2xl h-auto flex-1 flex items-center justify-center gap-2"
                                >
                                    {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                                    Manage Subscription
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => setIsUpgradeModalOpen(true)}
                                    className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-6 rounded-2xl h-auto flex-1 flex items-center justify-center gap-2"
                                >
                                    <ArrowUpRight className="w-4 h-4" />
                                    Upgrade Now
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Credits Card */}
                <div className="relative group overflow-hidden rounded-3xl border border-zinc-800 bg-black/40 p-8 shadow-xl transition-all hover:border-zinc-700">
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-6 uppercase tracking-widest text-[10px] font-black text-zinc-500">
                            Credits Available
                        </div>

                        <div className="text-6xl font-black text-white mb-2">
                            {profile?.credits === -1 ? '∞' : profile?.credits}
                        </div>
                        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                            {profile?.credits === -1
                                ? "You have unlimited power. Use it wisely."
                                : `You have ${profile?.credits} credits remaining to roast your victims.`}
                        </p>

                        <div className="mt-auto pt-6">
                            <Button
                                variant="outline"
                                onClick={() => setIsUpgradeModalOpen(true)}
                                className="w-full border-zinc-700 text-zinc-300 hover:bg-zinc-800 font-bold py-6 rounded-2xl h-auto"
                            >
                                Buy More Credits
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction History - Data-Dense List */}
            <Card className="bg-transparent border-none shadow-none">
                <CardHeader className="px-0">
                    <div className="flex items-center gap-2 text-xl font-bold">
                        <History className="w-5 h-5 text-red-500" />
                        Transaction History
                    </div>
                    <CardDescription className="text-zinc-500">Your recent billing activity.</CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 overflow-hidden">
                        <div className="p-8 text-center text-zinc-500 italic text-sm">
                            Any transactions will appear here as soon as they are processed.
                        </div>
                    </div>
                </CardContent>
            </Card>

            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </div>
    )
}
