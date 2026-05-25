import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Moon, Bell, Shield, LogOut, Trash2 } from "lucide-react";
import Aurora from "@/components/ui/Aurora";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);

    if (!user) return null;

    const handleSave = () => {
        toast({
            title: "Settings saved",
            description: "Your preferences have been updated.",
        });
    };

    return (
        <div className="min-h-screen bg-black relative pt-20">
            {/* Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] z-0 opacity-30 pointer-events-none">
                <Aurora
                    colorStops={["#60ff50", "#a64dff", "#2000ff"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <div className="container max-w-4xl mx-auto px-4 py-8 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                        <p className="text-white/60">Manage your account preferences and configurations.</p>
                    </div>
                    <Button onClick={handleSave} className="bg-white text-black hover:bg-white/90">
                        Save Changes
                    </Button>
                </div>

                <div className="space-y-6">
                    {/* Appearance */}
                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <Moon className="w-5 h-5 text-primary" />
                                <CardTitle className="text-xl text-white">Appearance</CardTitle>
                            </div>
                            <CardDescription className="text-white/60">Customize how the application looks.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Dark Mode</Label>
                                    <p className="text-sm text-white/60">
                                        Use a dark theme for the interface (Currently enforced).
                                    </p>
                                </div>
                                <Switch checked={true} disabled />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <Bell className="w-5 h-5 text-accent" />
                                <CardTitle className="text-xl text-white">Notifications</CardTitle>
                            </div>
                            <CardDescription className="text-white/60">Choose what updates you want to receive.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Push Notifications</Label>
                                    <p className="text-sm text-white/60">
                                        Receive real-time alerts for task updates.
                                    </p>
                                </div>
                                <Switch
                                    checked={notifications}
                                    onCheckedChange={setNotifications}
                                />
                            </div>
                            <Separator className="bg-white/10" />
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-white">Email Digest</Label>
                                    <p className="text-sm text-white/60">
                                        Receive a daily summary of your team's activity.
                                    </p>
                                </div>
                                <Switch
                                    checked={emailAlerts}
                                    onCheckedChange={setEmailAlerts}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account */}
                    <Card className="bg-black/80 border-white/10 backdrop-blur-xl border-dashed">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <Shield className="w-5 h-5 text-white" />
                                <CardTitle className="text-xl text-white">Account</CardTitle>
                            </div>
                            <CardDescription className="text-white/60">Manage your account authentication and data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-red-400">Danger Zone</Label>
                                    <p className="text-sm text-red-400/60">
                                        Permanently delete your account and all data.
                                    </p>
                                </div>
                                <Button variant="destructive" size="sm" className="gap-2">
                                    <Trash2 className="w-4 h-4" />
                                    Delete Account
                                </Button>
                            </div>

                            <Button variant="outline" className="w-full border-white/10 text-white hover:bg-white/5" onClick={logout}>
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
