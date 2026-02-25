'use client'

import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function RoastLoading() {
    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2 w-full md:w-1/2">
                        <Skeleton className="h-10 w-3/4 bg-zinc-800" />
                        <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                    </div>
                    <Skeleton className="h-12 w-32 bg-zinc-800 rounded-xl" />
                </div>

                {/* Hero Score Skeleton */}
                <Card className="p-8 bg-zinc-900 border-zinc-800 flex flex-col items-center text-center space-y-4">
                    <Skeleton className="h-32 w-32 rounded-full bg-zinc-800" />
                    <Skeleton className="h-8 w-64 bg-zinc-800" />
                    <Skeleton className="h-4 w-full max-w-2xl bg-zinc-800" />
                </Card>

                {/* Tabs Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton key={i} className="h-12 bg-zinc-800 rounded-lg" />
                    ))}
                </div>

                {/* Content Skeleton */}
                <Card className="p-6 bg-zinc-900 border-zinc-800 space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full bg-zinc-800" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32 bg-zinc-800" />
                            <Skeleton className="h-4 w-48 bg-zinc-800" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full bg-zinc-800" />
                        <Skeleton className="h-4 w-full bg-zinc-800" />
                        <Skeleton className="h-4 w-3/4 bg-zinc-800" />
                    </div>
                </Card>
            </div>
        </div>
    )
}
