import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"
import Link from "next/link"

interface RoastCardProps {
    id: string
    url: string
    score: number
    headline?: string
    date: string
    compact?: boolean
}

export function RoastCard({ id, url, score, headline, date, compact = false }: RoastCardProps) {
    const domain = url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : 'unknown.com'

    let scoreColor = "bg-red-500"
    if (score > 30) scoreColor = "bg-orange-500"
    if (score > 50) scoreColor = "bg-yellow-500"
    if (score > 70) scoreColor = "bg-green-500"
    if (score > 85) scoreColor = "bg-yellow-400"

    return (
        <Link href={`/roast/${id}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer group bg-zinc-950/50 backdrop-blur-sm border-zinc-800">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap text-lg font-bold w-full pr-2">
                        {domain}
                    </CardTitle>
                    <Badge className={`${scoreColor} text-black font-bold text-md w-12 justify-center`}>
                        {score}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-zinc-400 line-clamp-2 text-sm">
                        {headline || "Roasting in progress..."}
                    </div>
                </CardContent>
                {!compact && (
                    <CardFooter className="text-xs text-zinc-500 flex justify-between">
                        <span>{new Date(date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1 group-hover:text-primary transition-colors">View <Flame className="w-3 h-3" /></span>
                    </CardFooter>
                )}
            </Card>
        </Link>
    )
}
