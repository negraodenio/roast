"use client"

import { Flame } from "lucide-react"
import { cn } from "@/lib/utils"

type RoastTone = "mild" | "medium" | "spicy"

interface ToneSelectorProps {
    value: RoastTone
    onChange: (tone: RoastTone) => void
}

const TONES = [
    {
        value: "mild" as RoastTone,
        label: "Mild",
        emoji: "🔥",
        description: "Constructive & Polite",
        color: "from-green-500 to-emerald-600"
    },
    {
        value: "medium" as RoastTone,
        label: "Medium",
        emoji: "🔥🔥",
        description: "Direct & Professional",
        color: "from-orange-500 to-red-500"
    },
    {
        value: "spicy" as RoastTone,
        label: "Spicy",
        emoji: "🔥🔥🔥",
        description: "Brutally Honest",
        color: "from-red-600 to-rose-700"
    }
]

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
    return (
        <div className="w-full space-y-3">
            <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4" />
                Roast Intensity
            </label>
            <div className="grid grid-cols-3 gap-3">
                {TONES.map((tone) => (
                    <button
                        key={tone.value}
                        type="button"
                        onClick={() => onChange(tone.value)}
                        className={cn(
                            "relative p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 active:scale-95 group",
                            value === tone.value
                                ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                                : "border-zinc-800 bg-black/40 hover:border-zinc-700"
                        )}
                    >
                        <div className="flex flex-col items-center text-center gap-2">
                            <span className="text-2xl">{tone.emoji}</span>
                            <div className="font-bold text-white text-sm">{tone.label}</div>
                            <div className={cn(
                                "text-[10px] uppercase tracking-wider font-medium transition-colors",
                                value === tone.value ? "text-primary" : "text-zinc-500"
                            )}>
                                {tone.description}
                            </div>
                        </div>
                        {value === tone.value && (
                            <div className={cn(
                                "absolute inset-0 rounded-xl opacity-20 bg-gradient-to-br",
                                tone.color
                            )} />
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
