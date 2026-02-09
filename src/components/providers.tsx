"use client"

import * as React from "react"
// import { ThemeProvider as NextThemesProvider } from "next-themes"
// import { type ThemeProviderProps } from "next-themes/dist/types"

// We can add ThemeProvider if we want to toggle dark/light, but prompt said "Dark mode by default". 
// We enforce dark mode in globals.css or layout.
// So this is just a wrapper for children for now.

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
        </>
    )
}
