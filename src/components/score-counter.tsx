"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScoreCounterProps {
    score: number
    tone?: "mild" | "medium" | "spicy"
    subScores?: {
        ux?: number
        seo?: number
        copy?: number
        conversion?: number
        security?: number
    }
    stats?: {
        elementsAnalyzed?: number
        issuesFound?: number
        analysisTime?: number
    }
}

export function ScoreCounter({ score, tone = "medium", subScores, stats }: ScoreCounterProps) {
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

    // Tone-adaptive labels
    const getLabel = (score: number, tone: string) => {
        if (score <= 30) {
            return {
                mild: "Needs Work 🔧",
                medium: "Dumpster Fire 🗑️🔥",
                spicy: "Absolute Catastrophe 💀🔥"
            }[tone]
        }
        if (score <= 50) {
            return {
                mild: "Room for Improvement 📈",
                medium: "Needs CPR 🚑",
                spicy: "Train Wreck 🚂💥"
            }[tone]
        }
        if (score <= 70) {
            return {
                mild: "Getting There 👍",
                medium: "Mid, Not Gonna Lie 😐",
                spicy: "Meh... Nothing Special 🥱"
            }[tone]
        }
        if (score <= 85) {
            return {
                mild: "Well Done! ✨",
                medium: "Actually Decent 👀",
                spicy: "Not Bad, Surprisingly 🤔"
            }[tone]
        }
        return {
            mild: "Excellent Work! 🌟",
            medium: "Chef's Kiss 🤌",
            spicy: "Holy Sh*t, Finally! 🎉"
        }[tone]
    }

    let color = "text-red-500"
    let bgGradient = "from-red-600/20 via-red-900/10 to-transparent"

    if (displayScore > 30) {
        color = "text-orange-500"
        bgGradient = "from-orange-600/20 via-orange-900/10 to-transparent"
    }
    if (displayScore > 50) {
        color = "text-yellow-500"
        bgGradient = "from-yellow-600/20 via-yellow-900/10 to-transparent"
    }
    if (displayScore > 70) {
        color = "text-green-500"
        bgGradient = "from-green-600/20 via-green-900/10 to-transparent"
    }
    if (displayScore > 85) {
        color = "text-yellow-400"
        bgGradient = "from-yellow-400/20 via-amber-900/10 to-transparent"
    }

    const label = getLabel(displayScore, tone)

    return (
        <div className="relative flex flex-col items-center justify-center p-8 md:p-12 bg-zinc-950 border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_50px_-12px] shadow-black/50 group">
            {/* Animated Glow Background - Increased opacity */}
            <div className={cn("absolute inset-0 bg-gradient-to-b opacity-60 transition-colors duration-1000", bgGradient)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.08),transparent)]" />

            {/* Score Display - Slightly smaller for better hierarchy */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                        "text-7xl md:text-8xl font-black tabular-nums transition-all duration-700 drop-shadow-[0_0_20px_rgba(0,0,0,0.6)]",
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
                        "mt-4 px-6 py-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-xl text-lg md:text-xl font-bold tracking-tight shadow-xl transition-all duration-700",
                        color
                    )}
                >
                    {label}
                </motion.div>
            </div>

            {/* Credibility Stats */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative z-10 mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-500 font-medium"
                >
                    {stats.elementsAnalyzed && (
                        <span className="flex items-center gap-1">
                            <span className="text-green-500">✓</span> {stats.elementsAnalyzed} elements analyzed
                        </span>
                    )}
                    {stats.issuesFound !== undefined && (
                        <span className="flex items-center gap-1">
                            <span className="text-orange-500">⚠</span> {stats.issuesFound} critical issues
                        </span>
                    )}
                    {stats.analysisTime && (
                        <span className="flex items-center gap-1">
                            <span className="text-blue-500">⚡</span> Analyzed in {stats.analysisTime}s
                        </span>
                    )}
                </motion.div>
            )}

            {/* Sub-scores with Context Labels */}
            {subScores && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 w-full mt-10 relative z-10 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                    <ScoreMetric label="UX" value={subScores.ux} index={0} />
                    <ScoreMetric label="SEO" value={subScores.seo} index={1} />
                    <ScoreMetric label="Copy" value={subScores.copy} index={2} />
                    <ScoreMetric label="CRO" value={subScores.conversion} index={3} />
                    <ScoreMetric label="Tech" value={subScores.security} index={4} />
                </div>
            )}

            <div className="mt-6 text-[10px] text-zinc-600 uppercase tracking-widest font-bold z-10">
                Powered by DeepSeek V3 AI
            </div>
        </div>
    )
}

function ScoreMetric({ label, value, index }: { label: string, value?: number, index: number }) {
    const getContextLabel = (score?: number) => {
        if (!score) return "—"
        if (score <= 30) return "Critical"
        if (score <= 60) return "Needs Work"
        if (score <= 85) return "Good"
        return "Excellent"
    }

    const getContextColor = (score?: number) => {
        if (!score) return "text-zinc-600"
        if (score <= 30) return "text-red-400"
        if (score <= 60) return "text-orange-400"
        if (score <= 85) return "text-green-400"
        return "text-emerald-400"
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
            className="flex flex-col items-center justify-center py-3 px-3"
        >
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-tight mb-2">{label}</span>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden mb-2">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value || 0}%` }}
                    transition={{ duration: 1, delay: 1.5 + (index * 0.1) }}
                    className={cn(
                        "h-full rounded-full",
                        (value || 0) > 70 ? "bg-green-500" : (value || 0) > 40 ? "bg-yellow-500" : "bg-red-500"
                    )}
                />
            </div>
            <span className="text-lg font-mono font-bold text-white mb-1">{value || '--'}</span>
            <span className={cn("text-[9px] font-bold uppercase tracking-wider", getContextColor(value))}>
                {getContextLabel(value)}
            </span>
        </motion.div>
    )
}

