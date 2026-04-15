"use client";

import { Button } from "@/components/ui/button";

interface CTAButtonProps {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    size?: "default" | "sm" | "lg" | "icon";
}

export function CTAButton({ children, className, variant = "default", size = "lg" }: CTAButtonProps) {
    const handleFocus = () => {
        const input = document.getElementById("url-input-field");
        if (input) {
            input.focus();
            input.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <Button 
                variant={variant} 
                size={size} 
                className={className}
                onClick={handleFocus}
            >
                {children}
            </Button>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">
                No signup • 10 seconds
            </p>
        </div>
    );
}
