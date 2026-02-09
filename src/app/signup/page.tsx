"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SignupPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`
            }
        })

        if (signUpError) {
            alert(signUpError.message)
            setLoading(false)
        } else {
            alert("Check your email for confirmation link!")
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
                    <CardDescription className="text-center">
                        Get 3 free roasts when you sign up
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSignup}>
                        <div className="grid gap-2 mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="grid gap-2 mb-6">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                        </div>
                        <Button className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 text-center text-sm">
                    <Link href="/login" className="text-zinc-400 hover:text-white underline underline-offset-4">
                        Already have an account? Login
                    </Link>
                    <Link href="/" className="text-zinc-600 hover:text-zinc-400">Back to Home</Link>
                </CardFooter>
            </Card>
        </div>
    )
}
