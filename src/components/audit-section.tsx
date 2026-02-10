"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, Lock, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadCaptureForm } from "./lead-capture-form"

interface AuditSectionProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    roast: any
    isLocked: boolean
}

export function AuditSection({ roast, isLocked }: AuditSectionProps) {

    if (isLocked) {
        return (
            <div className="relative mt-8 w-full max-w-4xl mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-600/30 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

                <div className="relative z-10 flex flex-col items-center justify-center bg-zinc-950/80 backdrop-blur-xl rounded-2xl border border-zinc-800 p-8 md:p-12 text-center shadow-2xl">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 border border-primary/20 rotate-3">
                        <Lock className="w-10 h-10 text-primary -rotate-3" />
                    </div>

                    <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Unlock the Full Audit</h3>
                    <p className="text-zinc-400 mb-8 max-w-md text-balance leading-relaxed">
                        Get the detailed **UX, SEO, and Copywriting** analysis, plus **10 actionable tips** to boost your conversion rate.
                    </p>

                    <div className="w-full max-w-sm space-y-8">
                        {/* Phase 1: Lead Capture (Email) */}
                        <LeadCaptureForm
                            roastId={roast.id}
                            url={roast.url}
                            score={roast.score}
                            roastText={roast.roast_text?.roast || roast.roast_text || ""}
                            subScores={{
                                ux: roast.ux_audit?.score,
                                seo: roast.seo_audit?.score,
                                copy: roast.copy_audit?.score,
                                conversion: roast.conversion_tips?.score,
                                security: roast.performance_audit?.score
                            }}
                            audits={{
                                ux: roast.ux_audit,
                                seo: roast.seo_audit,
                                copy: roast.copy_audit,
                                conversion: roast.conversion_tips,
                                security: roast.performance_audit
                            }}
                        />

                        <div className="flex items-center gap-4 py-4">
                            <div className="h-px flex-1 bg-zinc-800" />
                            <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">or</span>
                            <div className="h-px flex-1 bg-zinc-800" />
                        </div>

                        {/* Phase 2: Instant Access (Paid) */}
                        <div className="space-y-4">
                            <Button size="lg" className="w-full bg-white text-black hover:bg-zinc-200 font-black text-lg h-14 rounded-2xl transition-all flex items-center justify-center gap-2">
                                <Sparkles className="w-5 h-5 fill-current" />
                                Instant Full Access $9.99
                            </Button>
                            <p className="text-xs text-zinc-500 font-medium">
                                No email? Get the full dashboard access immediately.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Blurred dummy content */}
                <div className="opacity-10 filter blur-md pointer-events-none select-none mt-12">
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
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-zinc-900/50 h-auto p-1 text-zinc-400">
                    <TabsTrigger value="ux" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">UX Audit</TabsTrigger>
                    <TabsTrigger value="seo" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">SEO</TabsTrigger>
                    <TabsTrigger value="copy" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">Copywriting</TabsTrigger>
                    <TabsTrigger value="cro" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">Conversion</TabsTrigger>
                    <TabsTrigger value="compliance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2">Security & Tech</TabsTrigger>
                </TabsList>

                <TabsContent value="ux" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>User Experience</span>
                                <span className="text-2xl font-bold text-primary">{roast.ux_audit?.score ?? 0}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.ux_audit?.summary || "Analyzing UX patterns..."}</CardDescription>
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

                <TabsContent value="seo" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>SEO Analysis</span>
                                <span className="text-2xl font-bold text-primary">{roast.seo_audit?.score ?? 0}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.seo_audit?.summary || "Analyzing search visibility..."}</CardDescription>
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

                <TabsContent value="copy" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Copywriting</span>
                                <span className="text-2xl font-bold text-primary">{roast.copy_audit?.score ?? 0}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.copy_audit?.summary || "Analyzing messaging and persuasion..."}</CardDescription>
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

                <TabsContent value="cro" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Conversion (CRO)</span>
                                <span className="text-2xl font-bold text-primary">{roast.conversion_tips?.score ?? 0}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.conversion_tips?.summary || "Analyzing conversion triggers..."}</CardDescription>
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
                                        <span className="font-semibold text-zinc-300">Profit Impact:</span> {issue.description}
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
                <TabsContent value="compliance" className="mt-6 space-y-4">
                    <Card className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">Security & Compliance</span>
                                <span className="text-2xl font-bold text-primary">{roast.performance_audit?.score ?? 0}/100</span>
                            </CardTitle>
                            <CardDescription>{roast.performance_audit?.summary || "Analyzing site security and legal compliance..."}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {roast.performance_audit?.issues?.map((issue: any, i: number) => (
                                <div key={i} className="p-4 rounded-lg bg-black/20 border border-zinc-800">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        {issue.severity === 'critical' ? <AlertCircle className="text-red-500 w-5 h-5 shrink-0" /> : <Info className="text-yellow-500 w-5 h-5 shrink-0" />}
                                        {issue.title}
                                    </div>
                                    <div className="text-sm text-zinc-400 mb-2 pl-7">
                                        <span className="font-semibold text-zinc-300">Analysis:</span> {issue.description}
                                    </div>
                                    <div className="text-sm bg-green-500/10 text-green-400 p-3 rounded border border-green-500/20 ml-7">
                                        <strong className="block mb-1">Action:</strong>
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

