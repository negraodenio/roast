import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-black p-4">
            <Card className="w-full max-w-md bg-zinc-950 border-zinc-800">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Authentication Error</CardTitle>
                    <CardDescription className="text-center text-zinc-400">
                        We couldn't verify your account. The link might have expired or is invalid.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-zinc-500 text-sm">
                    Please try to sign up again or request a new login link.
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild className="w-full">
                        <Link href="/login">Back to Login</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
