"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export function LoadingRoast() {
    const [step, setStep] = useState(0);

    const steps = [
        "Scanning UX issues...",
        "Checking conversion leaks...",
        "Analyzing copy weaknesses...",
        "⚠️ We found critical issues"
    ];

    useEffect(() => {
        let currentStep = 0;
        const interval = setInterval(() => {
            currentStep += 1;
            if (currentStep < steps.length) {
                setStep(currentStep);
            } else {
                clearInterval(interval);
            }
        }, 3000); // changes every 3 seconds
        
        return () => clearInterval(interval);
    }, [steps.length]);

    return (
        <div className="text-center py-20 flex flex-col items-center gap-6 animate-in fade-in duration-500">
            {step < steps.length - 1 && <Loader2 className="w-12 h-12 text-red-500 animate-spin" />}
            
            <div className="space-y-4">
                {steps.map((text, i) => (
                    <p 
                        key={i} 
                        className={`text-xl md:text-2xl font-bold transition-all duration-500 ${
                            i === step 
                                ? i === steps.length - 1 
                                    ? "text-red-500 scale-110" 
                                    : "text-white opacity-100" 
                                : "text-zinc-600 opacity-0 hidden"
                        }`}
                        style={{ display: i <= step ? 'block' : 'none' }}
                    >
                        {text}
                    </p>
                ))}
            </div>
            {step === steps.length - 1 && (
                <p className="text-zinc-400 mt-4 animate-pulse">
                    Finalizing report...
                </p>
            )}
        </div>
    );
}
