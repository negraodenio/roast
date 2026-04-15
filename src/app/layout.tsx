import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "RoastThis - Brutal AI Website Reviews",
    description: "Get a brutally honest AI roast of your website + actionable UX/SEO tips.",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.className} bg-background text-foreground min-h-screen antialiased`}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
                {/* Privacy-friendly analytics by Plausible */}
                <Script
                    async
                    src="https://plausible.io/js/pa-r2G6O2l14jajOQJHfV81J.js"
                    strategy="afterInteractive"
                />
                <Script id="plausible-init" strategy="afterInteractive">{`
                    window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
                    plausible.init()
                `}</Script>
            </body>
        </html>
    )
}
