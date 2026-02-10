"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScoreCounterProps {
    score: number
    subScores?: {
        ux?: number
        seo?: number
        copy?: number
        conversion?: number
    }
}

export function ScoreCounter({ score, subScores }: ScoreCounterProps) {
    const spring = useSpring(0, { bounce: 0, duration: 2000 })
    const value = useTransform(spring, (current) => Math.round(current))
    const [displayScore, setDisplayScore] = useState(0)

    useEffect(() => {
        spring.set(score)
    }, [score, spring])

    useEffect(() => {
        const unsubscribe = value.on("change", (latest) => {
            setDisplayScore(latest)
        })
        return () => unsubscribe()
    }, [value])

    let color = "text-red-500"
    let label = "Dumpster Fire 🗑️🔥"
    let bgGradient = "from-red-600/20 via-red-900/10 to-transparent"
    let glowColor = "shadow-red-500/50"

    if (displayScore > 30) {
        color = "text-orange-500"
        label = "Needs CPR 🚑"
        bgGradient = "from-orange-600/20 via-orange-900/10 to-transparent"
        glowColor = "shadow-orange-500/50"
    }
    if (displayScore > 50) {
        color = "text-yellow-500"
        label = "Mid, Not Gonna Lie 😐"
        bgGradient = "from-yellow-600/20 via-yellow-900/10 to-transparent"
        glowColor = "shadow-yellow-500/50"
    }
    if (displayScore > 70) {
        color = "text-green-500"
        label = "Actually Decent 👀"
        bgGradient = "from-green-600/20 via-green-900/10 to-transparent"
        glowColor = "shadow-green-500/50"
    }
    if (displayScore > 85) {
        color = "text-yellow-400"
        label = "Chef's Kiss 🤌"
        bgGradient = "from-yellow-400/20 via-amber-900/10 to-transparent"
        glowColor = "shadow-amber-400/50"
    }

    return (
        <div className="relative flex flex-col items-center justify-center p-8 md:p-12 bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px] shadow-black/50 group">
            {/* Animated Glow Background */}
            <div className={cn("absolute inset-0 bg-gradient-to-b opacity-40 transition-colors duration-1000", bgGradient)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent)]" />

            {/* Score Display */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "text-8xl md:text-9xl font-black tabular-nums transition-all duration-700 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]",
                        color
                    )}
                >
                    {displayScore}
                    <span className="text-3xl md:text-4xl opacity-30 ml-2 font-medium">/100</span>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className={cn(
                        "mt-4 px-6 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl text-xl md:2xl font-bold tracking-tight shadow-xl transition-all duration-700",
                        color
                    )}
                >
                    {label}
                </motion.div>
            </div>

            {/* Sub-scores Logic (Credibility) */}
            {subScores && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-10 relative z-10 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                    <ScoreMetric label="UX" value={subScores.ux} />
                    <ScoreMetric label="SEO" value={subScores.seo} />
                    <ScoreMetric label="Copy" value={subScores.copy} />
                    <ScoreMetric label="CRO" value={subScores.conversion} />
                </div>
            )}

            <div className="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest font-bold z-10">
                AI Powered Web Analysis v2.0
            </div>
        </div>
    )
}

function ScoreMetric({ label, value }: { label: string, value?: number }) {
    return (
        <div className="flex flex-col items-center justify-center py-2 px-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mb-1">{label}</span>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden mb-1.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value || 0}%` }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className={cn(
                        "h-full rounded-full",
                        (value || 0) > 70 ? "bg-green-500" : (value || 0) > 40 ? "bg-yellow-500" : "bg-red-500"
                    )}
                />
            </div>
            <span className="text-sm font-mono font-bold text-zinc-300">{value || '--'}</span>
        </div>
    )
}

