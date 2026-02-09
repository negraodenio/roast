"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScoreCounterProps {
    score: number
}

export function ScoreCounter({ score }: ScoreCounterProps) {
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
    let bgGradient = "from-red-500/20 to-transparent"

    if (displayScore > 30) {
        color = "text-orange-500"
        label = "Needs CPR 🚑"
        bgGradient = "from-orange-500/20 to-transparent"
    }
    if (displayScore > 50) {
        color = "text-yellow-500"
        label = "Mid, Not Gonna Lie 😐"
        bgGradient = "from-yellow-500/20 to-transparent"
    }
    if (displayScore > 70) {
        color = "text-green-500"
        label = "Actually Decent 👀"
        bgGradient = "from-green-500/20 to-transparent"
    }
    if (displayScore > 85) {
        color = "text-yellow-400"
        label = "Chef's Kiss 🤌"
        bgGradient = "from-yellow-400/20 to-transparent"
    }

    return (
        <div className="relative flex flex-col items-center justify-center p-10 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className={cn("absolute inset-0 bg-gradient-to-b opacity-30", bgGradient)} />

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className={cn("text-9xl font-black tabular-nums z-10 drop-shadow-lg", color)}
            >
                {displayScore}
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className={cn("text-2xl font-bold mt-4 z-10 px-4 py-2 bg-black/50 rounded-full border border-white/10 backdrop-blur-md", color)}
            >
                {label}
            </motion.div>
        </div>
    )
}
