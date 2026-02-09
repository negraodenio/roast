"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2, Flame } from "lucide-react"
import { useRouter } from "next/navigation"

export function UrlInput() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!url) return

        setLoading(true)

        // Validate URL lightly
        let validUrl = url
        if (!url.startsWith('http')) {
            validUrl = 'https://' + url
        }

        // We navigate to /roast/new?url=... or we start the process here?
        // Best UX: POST to API directly, get ID, then redirect.
        // BUT we need to show loading animation which is its own page or state.
        // Implementation: POST from here (client side) to start the job, then redirect to /roast/[id]
        // Or redirect to /dashboard/new?url=... if logged in?

        // Prompt said: "Landing Page ... Input ... If user is not logged in, still run the roast"
        // So we can POST to /api/roast from here.

        try {
            const res = await fetch('/api/roast', {
                method: 'POST',
                body: JSON.stringify({ url: validUrl }),
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            if (data.roastId) {
                router.push(`/roast/${data.roastId}`)
            } else {
                alert(data.error || "Something went wrong")
                setLoading(false)
            }
        } catch (e) {
            console.error(e)
            setLoading(false)
            alert("Failed to start roast")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-lg mx-auto">
            <Input
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-zinc-900/50 border-zinc-700 h-12 text-lg"
                required
            />
            <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold h-12 px-8 shadow-[0_0_20px_rgba(255,68,68,0.3)] transition-all hover:scale-105"
                disabled={loading}
            >
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Flame className="mr-2 fill-white" />}
                Roast It
            </Button>
        </form>
    )
}
