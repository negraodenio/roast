"use client"

import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Link as LinkIcon, Download } from "lucide-react"

interface ShareButtonsProps {
    roastId: string
    score: number
    url: string
}

export function ShareButtons({ roastId, score, url }: ShareButtonsProps) {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/roast/${roastId}` : ''
    const shareText = `My website just got roasted by AI and scored ${score}/100 💀🔥 ${url} via @roastthis`

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        alert("Link copied!")
    }

    return (
        <div className="flex flex-wrap gap-2 justify-center mt-6">
            <Button variant="outline" size="sm" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}>
                <Twitter className="w-4 h-4 mr-2" /> Share on X
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}>
                <Linkedin className="w-4 h-4 mr-2" /> Share on LinkedIn
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
                <LinkIcon className="w-4 h-4 mr-2" /> Copy Link
            </Button>
            <Button variant="outline" size="sm" onClick={() => window.open(`/api/roast/${roastId}/og`, '_blank')}>
                <Download className="w-4 h-4 mr-2" /> Download Card
            </Button>
        </div>
    )
}
