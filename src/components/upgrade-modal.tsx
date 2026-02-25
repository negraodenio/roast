"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Check, Zap, Loader2 } from "lucide-react"

export function UpgradeModal() {
    const [isLoading, setIsLoading] = useState<string | null>(null)
    const { toast } = useToast()

    const handleCheckout = async (priceId: string) => {
        setIsLoading(priceId)
        try {
            const res = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ priceId })
            })

            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Failed to initialize checkout')
            if (data.url) {
                window.location.href = data.url
            }
        } catch (error: any) {
            console.error('Checkout error:', error)
            toast({
                title: 'Checkout Error',
                description: error.message || 'Could not start checkout.',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white border-0 shadow-lg hover:scale-105 transition-all">
                    <Zap className="w-4 h-4 mr-2 fill-white" /> Upgrade to Pro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-zinc-800 text-zinc-100">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        Unlock Full Roasts <Zap className="text-yellow-500 fill-yellow-500" />
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        Get actionable feedback to actually fix your website.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-zinc-900 border border-zinc-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-1 px-3 bg-primary text-xs font-bold text-primary-foreground rounded-bl-lg">
                            RECOMMENDED
                        </div>
                        <h3 className="font-bold text-xl">Single Report</h3>
                        <div className="text-3xl font-bold">9,99€</div>
                        <div className="text-sm text-zinc-500 mb-4">One-time payment</div>

                        <ul className="space-y-2 text-sm text-zinc-300">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Full UX Audit</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> SEO Analysis</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Conversion Tips</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Copywriting Checks</li>
                        </ul>

                        <Button
                            className="mt-4 w-full bg-white text-black hover:bg-zinc-200 font-bold"
                            onClick={() => handleCheckout('price_single')}
                            disabled={isLoading !== null}
                        >
                            {isLoading === 'price_single' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Get This Roast
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2 p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
                        <h3 className="font-bold text-xl">Agency</h3>
                        <div className="text-3xl font-bold">49€<span className="text-base font-normal text-zinc-500">/mo</span></div>

                        <ul className="space-y-2 text-sm text-zinc-300">
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Unlimited Roasts</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> White-label PDF</li>
                            <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Priority Support</li>
                        </ul>

                        <Button
                            variant="outline"
                            className="mt-4 w-full border-zinc-700 hover:bg-zinc-800 hover:text-white font-bold"
                            onClick={() => handleCheckout('price_agency')}
                            disabled={isLoading !== null}
                        >
                            {isLoading === 'price_agency' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Subscribe
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
