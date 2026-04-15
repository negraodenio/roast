"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2, Flame } from "lucide-react"
import { useRouter } from "next/navigation"
import { ToneSelector } from "./tone-selector"
import { LoadingRoast } from "./loading-roast"

type RoastTone = "mild" | "medium" | "spicy"

export function UrlInput() {
    const [url, setUrl] = useState("")
    const [tone, setTone] = useState<RoastTone>("medium")
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

        try {
            const res = await fetch('/api/roast', {
                method: 'POST',
                body: JSON.stringify({ url: validUrl, tone }),
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

    if (loading) {
        return <LoadingRoast />
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-lg mx-auto">
            <ToneSelector value={tone} onChange={setTone} />

            <div className="flex flex-col sm:flex-row gap-4">
                <Input
                    id="url-input-field"
                    placeholder="example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="flex-1 bg-zinc-900/50 border-zinc-700 h-12 text-lg"
                    required
                />
                <Button
                    type="submit"
                    size="lg"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 shadow-[0_0_20px_rgba(255,68,68,0.2)] transition-all hover:scale-105"
                    disabled={loading}
                >
                    <Flame className="mr-2 fill-white" />
                    Analyze My Website →
                </Button>
            </div>
        </form>
    )
}
