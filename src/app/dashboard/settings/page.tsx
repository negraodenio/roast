"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Shield, Bell, Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
]

interface SettingsProfile {
    id: string
    username?: string
    full_name?: string
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general')
    const [profile, setProfile] = useState<SettingsProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const supabase = createClient()
    const { toast } = useToast()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, full_name, avatar_url, website, plan, credits') // Specifically exclude username for now if it's failing
                    .eq('id', user.id)
                    .single()

                if (error) {
                    // Try one more time with a basic select if the specific one fails
                    const { data: fallbackData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single()
                    setProfile(fallbackData)
                } else {
                    setProfile(data)
                }
            }
            setLoading(false)
        }
        fetchProfile()
    }, [supabase])

    const handleSave = async () => {
        if (!profile) return
        setIsSaving(true)
        try {
            // Build update object dynamically to avoid schema errors
            const updateData: any = {
                full_name: profile.full_name,
            }

            // Only add username if we believe it exists in this profile object
            if ('username' in profile) {
                updateData.username = profile.username
            }

            const { error } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', profile.id)

            if (error) throw error

            toast({
                title: 'Success',
                description: 'Profile updated successfully.',
            })
        } catch (error: unknown) {
            toast({
                title: 'Error',
                description: (error as Error).message,
                variant: 'destructive'
            })
        } finally {
            setIsSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-red-500" />
            </div>
        )
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-black tracking-tighter">Settings</h1>
                <p className="text-zinc-500">Manage your account preferences and personal information.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Vertical Tabs Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${activeTab === tab.id
                                ? 'bg-zinc-900 text-white border border-zinc-800'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'
                                }`}
                        >
                            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-red-500' : ''}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                    <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-sm shadow-2xl rounded-3xl overflow-hidden">
                        <CardHeader className="border-b border-zinc-900 pb-6 px-8 pt-8">
                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2 capitalize">
                                {activeTab} Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="username" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Username</Label>
                                            <Input
                                                id="username"
                                                value={profile?.username || ''}
                                                onChange={(e) => profile && setProfile({ ...profile, username: e.target.value })}
                                                className="bg-black/40 border-zinc-800 rounded-xl focus:border-red-500/50 h-12"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="fullName" className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                value={profile?.full_name || ''}
                                                onChange={(e) => profile && setProfile({ ...profile, full_name: e.target.value })}
                                                className="bg-black/40 border-zinc-800 rounded-xl focus:border-red-500/50 h-12"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-zinc-800 flex justify-end">
                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-red-600 hover:bg-red-500 text-white font-bold px-8 h-12 rounded-xl flex items-center gap-2"
                                        >
                                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'security' && (
                                <div className="p-8 text-center text-zinc-500 italic text-sm">
                                    Security settings coming soon. Manage your password via Supabase Auth.
                                </div>
                            )}

                            {activeTab === 'notifications' && (
                                <div className="p-8 text-center text-zinc-500 italic text-sm">
                                    Notification preferences are coming soon.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
