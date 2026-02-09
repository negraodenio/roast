"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuditSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roast: any
    isLocked: boolean
}

export function AuditSection({ roast, isLocked }: AuditSectionProps) {

    if (isLocked) {
        return (
            <div className="relative mt-12 w-full max-w-4xl mx-auto">
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950/60 backdrop-blur-md rounded-xl border border-zinc-800 p-8 text-center">
                    <Lock className="w-16 h-16 text-primary mb-4" />
                    <h3 className="text-3xl font-bold mb-2">Unlock the Full Audit</h3>
                    <p className="text-zinc-400 mb-6 max-w-md">
                        Get detailed UX, SEO, and Copywriting analysis, plus 10 actionable conversion tips to fix your site.
                    </p>
                    <Button size="lg" className="bg-primary text-primary-foreground font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:scale-105 transition-transform">
                        Unlock for $9.99
                    </Button>
                    <p className="mt-4 text-sm text-zinc-500">Or get unlimited audits with Agency Plan</p>
                </div>

                {/* Blurred dummy content */}
                <div className="opacity-20 filter blur-sm pointer-events-none select-none">
                    <Tabs defaultValue="ux" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-zinc-900/50">
                            <TabsTrigger value="ux">UX Audit</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                            <TabsTrigger value="copy">Copy</TabsTrigger>
                            <TabsTrigger value="cro">Conversion</TabsTrigger>
                            <TabsTrigger value="perf">Performance</TabsTrigger>
                        </TabsList>
                        <TabsContent value="ux" className="mt-6">
                            <Card className="bg-zinc-900 border-zinc-800">
                                <CardHeader><CardTitle>UX Issues</CardTitle></CardHeader>
                                <CardContent>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="mb-4 p-4 bg-black/20 rounded border border-zinc-800">
                                            <div className="h-6 w-3/4 bg-zinc-800 rounded mb-2"></div>
                                            <div className="h-4 w-full bg-zinc-800/50 rounded"></div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-12">
            <Tabs defaultValue="ux" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-zinc-900/50 h-auto p-1 text-zinc-400">
                    <TabsTrigger value="ux" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">UX Audit</TabsTrigger>
                    <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">SEO</TabsTrigger>
                    <TabsTrigger value="copy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">Copywriting</TabsTrigger>
                    <TabsTrigger value="cro" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">Conversion</TabsTrigger>
                </TabsList>

                <TabsContent value="ux" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>User Experience</span>
                                <span className="text-2xl font-bold text-primary">{roast.ux_audit?.score || '?'}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.ux_audit?.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {roast.ux_audit?.issues?.map((issue: any, i: number) => (
                                <div key={i} className="p-4 rounded-lg bg-black/20 border border-zinc-800">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        {issue.severity === 'critical' ? <AlertCircle className="text-red-500 w-5 h-5 shrink-0" /> : <Info className="text-yellow-500 w-5 h-5 shrink-0" />}
                                        {issue.title}
                                    </div>
                                    <div className="text-sm text-zinc-400 mb-2 pl-7">
                                        <span className="font-semibold text-zinc-300">Why it matters:</span> {issue.description}
                                    </div>
                                    <div className="text-sm bg-green-500/10 text-green-400 p-3 rounded border border-green-500/20 ml-7">
                                        <strong className="block mb-1">How to Fix:</strong>
                                        {issue.fix}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
                {/* Repeating similar structure for SEO, Copy, etc. - Truncating for brevity in this single file, assume similar structure */}
                <TabsContent value="copy" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Copywriting</span>
                                <span className="text-2xl font-bold text-primary">{roast.copy_audit?.score || '?'}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.copy_audit?.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {roast.copy_audit?.issues?.map((issue: any, i: number) => (
                                <div key={i} className="p-4 rounded-lg bg-black/20 border border-zinc-800">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        {issue.severity === 'critical' ? <AlertCircle className="text-red-500 w-5 h-5 shrink-0" /> : <Info className="text-yellow-500 w-5 h-5 shrink-0" />}
                                        {issue.title}
                                    </div>
                                    <div className="text-sm text-zinc-400 mb-2 pl-7">
                                        <span className="font-semibold text-zinc-300">Why it matches:</span> {issue.description}
                                    </div>
                                    <div className="text-sm bg-green-500/10 text-green-400 p-3 rounded border border-green-500/20 ml-7">
                                        <strong className="block mb-1">How to Fix:</strong>
                                        {issue.fix}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cro" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Conversion (CRO)</span>
                                <span className="text-2xl font-bold text-primary">{roast.conversion_tips?.score || '?'}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.conversion_tips?.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {roast.conversion_tips?.issues?.map((issue: any, i: number) => (
                                <div key={i} className="p-4 rounded-lg bg-black/20 border border-zinc-800">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        {issue.severity === 'critical' ? <AlertCircle className="text-red-500 w-5 h-5 shrink-0" /> : <Info className="text-yellow-500 w-5 h-5 shrink-0" />}
                                        {issue.title}
                                    </div>
                                    <div className="text-sm text-zinc-400 mb-2 pl-7">
                                        <span className="font-semibold text-zinc-300">Why to fix:</span> {issue.description}
                                    </div>
                                    <div className="text-sm bg-green-500/10 text-green-400 p-3 rounded border border-green-500/20 ml-7">
                                        <strong className="block mb-1">Action Plan:</strong>
                                        {issue.fix}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="seo" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>SEO Analysis</span>
                                <span className="text-2xl font-bold text-primary">{roast.seo_audit?.score || '?'}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.seo_audit?.summary}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {roast.seo_audit?.issues?.map((issue: any, i: number) => (
                                <div key={i} className="p-4 rounded-lg bg-black/20 border border-zinc-800">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        {issue.severity === 'critical' ? <AlertCircle className="text-red-500 w-5 h-5 shrink-0" /> : <Info className="text-yellow-500 w-5 h-5 shrink-0" />}
                                        {issue.title}
                                    </div>
                                    <div className="text-sm text-zinc-400 mb-2 pl-7">
                                        <span className="font-semibold text-zinc-300">Impact:</span> {issue.description}
                                    </div>
                                    <div className="text-sm bg-green-500/10 text-green-400 p-3 rounded border border-green-500/20 ml-7">
                                        <strong className="block mb-1">Technical Fix:</strong>
                                        {issue.fix}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

