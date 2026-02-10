"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle2, Loader2, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface LeadCaptureFormProps {
    roastId: string
    url: string
    score: number
    roastText: string
}

export function LeadCaptureForm({ roastId, url, score, roastText }: LeadCaptureFormProps) {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setIsLoading(true)
        try {
            const response = await fetch("/api/send-report", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    roastData: {
                        url,
                        score,
                        roastText,
                        timestamp: new Date().toISOString()
                    },
                    isPremium: false // Freemium report with 25% text
                })
            })

            if (!response.ok) throw new Error("Failed to send report")

            setIsSuccess(true)
            toast({
                title: "Report Sent! 🔥",
                description: "Check your inbox (and spam) for your PDF analysis.",
            })
        } catch (error) {
            console.error("Lead capture error:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not send report. Please try again later.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-green-500/10 border border-green-500/20 rounded-2xl animate-in fade-in zoom-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Check Your Email!</h3>
                <p className="text-zinc-400 text-center text-sm">
                    We&apos;ve sent the PDF analysis of <strong>{url}</strong> to your inbox.
                </p>
                <Button
                    variant="link"
                    className="mt-4 text-zinc-500 hover:text-white"
                    onClick={() => setIsSuccess(false)}
                >
                    Send to another email
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-primary transition-colors" />
                <Input
                    type="email"
                    placeholder="Enter your email to get the PDF report"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-14 bg-black/40 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-2xl text-lg transition-all"
                />
            </div>
            <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        Get My Free PDF Report
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </Button>
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">
                🔒 No spam. Just a savage analysis of your site.
            </p>
        </form>
    )
}
