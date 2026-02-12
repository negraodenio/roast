"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Info, Lock, Sparkles, Scale, Gavel, ShieldAlert, Eye, Search, ShieldCheck, Target, Zap, TrendingUp, AlertTriangle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LeadCaptureForm } from "./lead-capture-form"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

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

                <div className="opacity-10 filter blur-md pointer-events-none select-none mt-12">
                    <Tabs defaultValue="ux" className="w-full">
                        <TabsList className="grid w-full grid-cols-5 bg-zinc-900/50">
                            <TabsTrigger value="ux">UX Audit</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                            <TabsTrigger value="copy">Copy</TabsTrigger>
                            <TabsTrigger value="cro">Conversion</TabsTrigger>
                            <TabsTrigger value="perf">Performance</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto mt-12">
            <Tabs defaultValue="compliance" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 bg-zinc-900/50 h-auto p-1 text-zinc-400 gap-1 rounded-xl">
                    <TabsTrigger value="compliance" className="data-[state=active]:bg-red-500 data-[state=active]:text-white py-2.5 font-bold rounded-lg transition-all">
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="ux" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white py-2.5 font-bold rounded-lg transition-all">
                        <Eye className="w-4 h-4 mr-2" />
                        UX Audit
                    </TabsTrigger>
                    <TabsTrigger value="cro" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white py-2.5 font-bold rounded-lg transition-all">
                        <Target className="w-4 h-4 mr-2" />
                        Conversion
                    </TabsTrigger>
                    <TabsTrigger value="seo" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white py-2.5 font-bold rounded-lg transition-all">
                        <Search className="w-4 h-4 mr-2" />
                        SEO
                    </TabsTrigger>
                    <TabsTrigger value="copy" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white py-2.5 font-bold rounded-lg transition-all">
                        <Zap className="w-4 h-4 mr-2" />
                        Copywriting
                    </TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent value="compliance">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-6"
                    >
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-red-500/5 border border-red-500/20 mb-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                                <ShieldCheck className="w-24 h-24 text-red-500" />
                            </div>
                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                                <ShieldCheck className="w-10 h-10 text-red-500" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">The Compliance Guard</h3>
                                    <Badge variant="destructive" className="bg-red-500 text-white animate-pulse">Strict</Badge>
                                </div>
                                <p className="text-sm text-zinc-400 leading-tight italic">"Your legal exposure is not just an error, it's a liability. Fix this before the fines arrive."</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-red-500" />
                                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Audit Findings</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Risk Score</span>
                                    <span className="text-3xl font-black text-red-500">{roast.performance_audit?.score ?? 0}/100</span>
                                </div>
                            </div>

                            <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-visible group hover:border-red-500/30 transition-all duration-500">
                                <CardContent className="p-6 space-y-6">
                                    <TooltipProvider>
                                        {roast.performance_audit?.issues?.map((issue: any, i: number) => (
                                            <div key={i} className="relative p-6 rounded-2xl bg-black/40 border border-zinc-800/50 group-hover:bg-black/60 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-help mt-1 shrink-0">
                                                                {issue.severity === 'critical' ?
                                                                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                                                        <AlertTriangle className="text-red-500 w-5 h-5" />
                                                                    </div> :
                                                                    <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10">
                                                                        <Info className="text-red-400/60 w-5 h-5" />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-red-950 border-red-900 text-red-100 font-bold px-3 py-2 shadow-2xl">
                                                            <p className="flex items-center gap-2">
                                                                <ShieldAlert className="w-4 h-4" />
                                                                {issue.severity === 'critical' ? 'FATAL COMPLIANCE RISK' : 'LEGAL IMPROVEMENT NEEDED'}
                                                            </p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-white mb-2 leading-tight">{issue.title}</h4>
                                                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed font-medium">
                                                            <span className="text-red-500/80 uppercase font-black text-[10px] tracking-widest block mb-1">Impact Analysis</span>
                                                            {issue.description}
                                                        </p>
                                                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/90 text-[13px] leading-relaxed font-semibold">
                                                            <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                                                            <div>
                                                                <strong className="block text-red-500 uppercase text-[10px] tracking-widest mb-1.5 font-black text-xs">Emergency Patch Required</strong>
                                                                {issue.fix}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TooltipProvider>

                                    {/* LGPD Penalty Section */}
                                    <div className="relative overflow-hidden p-8 mt-12 rounded-[2rem] bg-gradient-to-br from-red-600/20 via-black/40 to-transparent border-2 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-pulse hover:animate-none transition-all duration-700">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 -rotate-12">
                                            <Gavel className="w-40 h-40 text-red-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-3 rounded-2xl bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] text-white">
                                                    <ShieldAlert className="w-8 h-8" />
                                                </div>
                                                <h4 className="text-3xl font-black text-white uppercase tracking-tighter leading-none italic">
                                                    LGPD <span className="text-red-500">Death Sentence</span>
                                                </h4>
                                            </div>

                                            <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-8">
                                                <div className="space-y-6">
                                                    <div className="space-y-2">
                                                        <p className="text-zinc-300 font-bold text-lg leading-tight uppercase tracking-tight">Maximum Penalty Exposure</p>
                                                        <p className="text-5xl font-black text-white tracking-tighter shadow-sm">
                                                            2% <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] uppercase italic">of Annual Revenue</span>
                                                        </p>
                                                        <Badge className="bg-black/80 text-white border-red-500/50 py-1 px-4 text-xs font-black tracking-widest border-2 uppercase tracking-tighter">Capped at R$ 50M per violation</Badge>
                                                    </div>

                                                    <p className="text-sm text-zinc-400 font-medium leading-relaxed max-w-md">
                                                        "Based on your compliance fallout score, you are raw-dogging the internet in a business suit. This is a fatal legal liability."
                                                    </p>
                                                </div>

                                                <div className="flex flex-col justify-center space-y-4">
                                                    <div className="p-4 rounded-2xl bg-black/60 border border-white/5 backdrop-blur-xl">
                                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-[0.2em] mb-2">The Exposure Formula</p>
                                                        <p className="text-2xl font-mono text-white font-black flex items-center gap-2">
                                                            <Scale className="text-red-500 w-6 h-6" />
                                                            Fine = Revenue * 0.02
                                                        </p>
                                                    </div>
                                                    <Button className="w-full bg-red-600 hover:bg-red-500 text-white font-black h-12 uppercase tracking-widest rounded-xl shadow-xl shadow-red-900/20 group">
                                                        Download Compliance Kit
                                                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="ux">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mt-6 space-y-6"
                    >
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 mb-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12">
                                <Eye className="w-24 h-24 text-purple-500" />
                            </div>
                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Eye className="w-10 h-10 text-purple-500" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">The UI Critic</h3>
                                    <Badge variant="outline" className="text-purple-400 border-purple-500/50">Brutally Honest</Badge>
                                </div>
                                <p className="text-sm text-zinc-400 leading-tight italic">"Your design choices are actually hurting my eyes. Let's fix the friction before your users go blind."</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-purple-500" />
                                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">UX Audit Elements</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">UX Score</span>
                                    <span className="text-3xl font-black text-purple-500">{roast.ux_audit?.score ?? 0}/100</span>
                                </div>
                            </div>

                            <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-visible group hover:border-purple-500/30 transition-all duration-500">
                                <CardContent className="p-6 space-y-4">
                                    <TooltipProvider>
                                        {roast.ux_audit?.issues?.map((issue: any, i: number) => (
                                            <div key={i} className="p-6 rounded-2xl bg-black/40 border border-zinc-800/50 hover:bg-black/60 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-help mt-1 shrink-0">
                                                                {issue.severity === 'critical' ?
                                                                    <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                                                                        <AlertCircle className="text-orange-500 w-5 h-5" />
                                                                    </div> :
                                                                    <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
                                                                        <Info className="text-purple-400/60 w-5 h-5" />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-zinc-800 border-zinc-700 text-white font-medium">
                                                            <p>{issue.severity === 'critical' ? 'Critical Friction Found' : 'UX Optimization Needed'}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-white mb-2">{issue.title}</h4>
                                                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed font-medium">
                                                            <span className="text-purple-400/80 uppercase font-black text-[10px] tracking-widest block mb-1">Psychological Impact</span>
                                                            {issue.description}
                                                        </p>
                                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10 text-green-400/90 text-[13px] leading-relaxed font-semibold">
                                                            <Zap className="w-5 h-5 shrink-0 mt-0.5 text-green-500/60" />
                                                            <div>
                                                                <strong className="block text-green-500 uppercase text-[10px] tracking-widest mb-1.5 font-black">Critic's Prescription</strong>
                                                                {issue.fix}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TooltipProvider>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="cro">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 space-y-6"
                    >
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-purple-600/5 border border-purple-600/20 mb-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-45">
                                <Target className="w-24 h-24 text-purple-600" />
                            </div>
                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-purple-600/10 flex items-center justify-center border border-purple-600/20">
                                <Target className="w-10 h-10 text-purple-600" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">The CRO Hitman</h3>
                                    <Badge className="bg-purple-600 text-white border-none shadow-lg shadow-purple-900/40 text-[10px] uppercase font-black">Sales Killer</Badge>
                                </div>
                                <p className="text-sm text-zinc-400 leading-tight italic">"You're literally begging people to leave without buying. Let's plug these leaks before you go bankrupt."</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-purple-600" />
                                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Conversion Holes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">CRO Score</span>
                                    <span className="text-3xl font-black text-purple-600">{roast.conversion_tips?.score ?? 0}/100</span>
                                </div>
                            </div>

                            <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-visible group hover:border-purple-600/30 transition-all duration-500">
                                <CardHeader className="border-b border-zinc-900 pb-4">
                                    <CardDescription className="text-zinc-400 font-medium italic">"{roast.conversion_tips?.summary || "Analyzing conversion triggers..."}"</CardDescription>
                                </CardHeader>
                                <CardContent className="p-6 space-y-4">
                                    <TooltipProvider>
                                        {roast.conversion_tips?.issues?.map((issue: any, i: number) => (
                                            <div key={i} className="p-6 rounded-2xl bg-black/30 border border-zinc-800/50 hover:bg-black/60 transition-all group/item">
                                                <div className="flex items-start gap-4">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-help mt-1 shrink-0">
                                                                {issue.severity === 'critical' ?
                                                                    <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 shadow-lg shadow-red-900/20">
                                                                        <AlertCircle className="text-red-500 w-5 h-5" />
                                                                    </div> :
                                                                    <div className="p-2 rounded-lg bg-orange-500/5 border border-orange-500/10">
                                                                        <Info className="text-orange-400/60 w-5 h-5" />
                                                                    </div>
                                                                }
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-zinc-800 border-zinc-700 text-white font-medium">
                                                            <p>{issue.severity === 'critical' ? 'Fatal Conversion Blocker' : 'Optimization Tip'}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-white mb-2">{issue.title}</h4>
                                                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed font-medium">
                                                            <span className="text-purple-500/80 uppercase font-black text-[10px] tracking-widest block mb-1">Profit Destruction</span>
                                                            {issue.description}
                                                        </p>
                                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/5 border border-green-500/20 text-green-400/90 text-sm leading-relaxed font-bold shadow-inner">
                                                            <Zap className="w-6 h-6 shrink-0 mt-0.5 text-green-400" />
                                                            <div>
                                                                <strong className="block text-green-500 uppercase text-[10px] tracking-[0.2em] mb-1.5 font-black">Money-Saving Action</strong>
                                                                {issue.fix}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TooltipProvider>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="seo">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-6"
                    >
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                                <Search className="w-24 h-24 text-amber-500" />
                            </div>
                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                                <Search className="w-10 h-10 text-amber-500" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">The Search Spy</h3>
                                    <Badge className="bg-amber-500 text-black border-none font-black text-[10px] uppercase">Invisible Mode</Badge>
                                </div>
                                <p className="text-sm text-zinc-400 leading-tight italic">"Your competitors are eating your lunch while you're ghosting Google. Let's hijack their traffic."</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-amber-500" />
                                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Visibility Leaks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">SEO Authority</span>
                                    <span className="text-3xl font-black text-amber-500">{roast.seo_audit?.score ?? 0}/100</span>
                                </div>
                            </div>

                            <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-visible group hover:border-amber-500/30 transition-all duration-500">
                                <CardContent className="p-6 space-y-4">
                                    <TooltipProvider>
                                        {roast.seo_audit?.issues?.map((issue: any, i: number) => (
                                            <div key={i} className="p-6 rounded-2xl bg-black/40 border border-zinc-800/50 hover:bg-black/60 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-help mt-1 shrink-0">
                                                                <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10">
                                                                    <Search className="text-amber-400/60 w-5 h-5" />
                                                                </div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-zinc-800 border-zinc-700 text-white font-medium">
                                                            <p>Search Intelligence Finding</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-white mb-2">{issue.title}</h4>
                                                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed font-medium">
                                                            <span className="text-amber-400/80 uppercase font-black text-[10px] tracking-widest block mb-1">Competitor Advantage</span>
                                                            {issue.description}
                                                        </p>
                                                        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-400/90 text-[13px] leading-relaxed font-semibold">
                                                            <Target className="w-4 h-4 shrink-0 mt-0.5 text-amber-500/60" />
                                                            <div>
                                                                <strong className="block text-amber-500 uppercase text-[10px] tracking-widest mb-1.5 font-black">Spy's Tactic</strong>
                                                                {issue.fix}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TooltipProvider>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </TabsContent>

                <TabsContent value="copy">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-6 space-y-6"
                    >
                        <div className="flex items-center gap-4 p-6 rounded-2xl bg-amber-600/5 border border-amber-600/20 mb-8 overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                                <Zap className="w-24 h-24 text-amber-600" />
                            </div>
                            <div className="relative z-10 w-16 h-16 rounded-2xl bg-amber-600/10 flex items-center justify-center border border-amber-600/20">
                                <Zap className="w-10 h-10 text-amber-600" />
                            </div>
                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter">The Copy Assassin</h3>
                                    <Badge className="bg-amber-600 text-white border-none font-black text-[10px] uppercase">Lethal Hooks</Badge>
                                </div>
                                <p className="text-sm text-zinc-400 leading-tight italic">"Your words are boring your customers to sleep. Let's inject some adrenaline into your messaging."</p>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            <div className="flex items-center justify-between px-4">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-amber-600" />
                                    <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Messaging Gaps</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Persuasion Score</span>
                                    <span className="text-3xl font-black text-amber-600">{roast.copy_audit?.score ?? 0}/100</span>
                                </div>
                            </div>

                            <Card className="bg-zinc-900/40 backdrop-blur-md border-zinc-800/50 shadow-2xl relative overflow-visible group hover:border-amber-600/30 transition-all duration-500">
                                <CardContent className="p-6 space-y-4">
                                    <TooltipProvider>
                                        {roast.copy_audit?.issues?.map((issue: any, i: number) => (
                                            <div key={i} className="p-6 rounded-2xl bg-black/40 border border-zinc-800/50 hover:bg-black/60 transition-colors">
                                                <div className="flex items-start gap-4">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="cursor-help mt-1 shrink-0">
                                                                <div className="p-2 rounded-lg bg-amber-600/5 border border-amber-600/10">
                                                                    <Zap className="text-amber-400/60 w-5 h-5" />
                                                                </div>
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent className="bg-zinc-800 border-zinc-700 text-white font-medium">
                                                            <p>Conversion Copy Insight</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-white mb-2">{issue.title}</h4>
                                                        <p className="text-sm text-zinc-400 mb-4 leading-relaxed font-medium">
                                                            <span className="text-amber-500/80 uppercase font-black text-[10px] tracking-widest block mb-1">Persuasion Leak</span>
                                                            {issue.description}
                                                        </p>
                                                        <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-600/5 border border-amber-600/10 text-amber-400/90 text-[13px] leading-relaxed font-semibold">
                                                            <Zap className="w-5 h-5 shrink-0 mt-0.5 text-amber-500/60" />
                                                            <div>
                                                                <strong className="block text-amber-500 uppercase text-[10px] tracking-widest mb-1.5 font-black">Copy injection</strong>
                                                                {issue.fix}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </TooltipProvider>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                </TabsContent>
            </Tabs>
        </div>
    )
}
