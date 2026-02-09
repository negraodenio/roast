"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { LoadingRoast } from "@/components/loading-roast"
import { createClient } from "@/lib/supabase/client"

export default function NewRoastPage() {
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [isPublic, setIsPublic] = useState(true)
    const [roasting, setRoasting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

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
            const { data: { user } } = await supabase.auth.getUser()

            setRoasting(true) // Show animation

            const res = await fetch('/api/roast', {
                method: 'POST',
                body: JSON.stringify({
                    url: validUrl,
                    userId: user?.id,
                    isPublic
                }),
                headers: { 'Content-Type': 'application/json' }
            })

            const data = await res.json()

            if (data.roastId) {
                router.push(`/roast/${data.roastId}`)
            } else {
                setRoasting(false)
                setLoading(false)
                alert(data.error || "Something went wrong")
            }
        } catch (e) {
            console.error(e)
            setRoasting(false)
            setLoading(false)
            alert("Failed to start roast")
        }
    }

    if (roasting) {
        return (
            <div className="h-full flex items-center justify-center">
                <LoadingRoast />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">New Roast</h1>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle>Enter Website URL</CardTitle>
                    <CardDescription>Prepare to be judged by AI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label>Website URL</Label>
                            <Input
                                placeholder="example.com"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="bg-zinc-950 border-zinc-700 h-12 text-lg"
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox id="public" checked={isPublic} onCheckedChange={(c) => setIsPublic(!!c)} />
                            <Label htmlFor="public">Make roast public on the wall (Show off your pain)</Label>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12"
                            disabled={loading}
                        >
                            {loading && <Loader2 className="animate-spin mr-2" />}
                            Roast This Site 🔥
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
