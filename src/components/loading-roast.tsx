"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const MESSAGES = [
    "Judging your font choices...",
    "Counting your pop-ups...",
    "Questioning your color palette...",
    "Looking for your CTA... still looking...",
    "Analyzing your hero section... yikes...",
    "Calculating emotional damage...",
    "Consulting the design gods...",
    "Trying to find the value proposition...",
]

export function LoadingRoast() {
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length)
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-4xl">🔥</div>
            </div>

            <div className="h-10 relative overflow-hidden w-full max-w-sm">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500"
                    >
                        {MESSAGES[index]}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
