import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Cpu, AlignLeft, Sparkles, Loader2 } from "lucide-react";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ProjectOverview({
    project,
    onGenerate
}: {
    project: Project,
    onGenerate?: () => Promise<void>
}) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!onGenerate) return;
        setIsGenerating(true);
        try {
            await onGenerate();
        } finally {
            setIsGenerating(false);
        }
    };

    if (!project.isAIPlanGenerated) {
        return (
            <Card className="bg-black/80 border-white/10 backdrop-blur-xl border-dashed py-12">
                <CardContent className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                        <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl text-white mb-3">Decompose with AI</CardTitle>
                    <CardDescription className="text-white/60 max-w-md mx-auto mb-8">
                        Generate a complete execution plan including an executive summary, architecture, timeline, and an automated Kanban board.
                    </CardDescription>
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-primary hover:bg-primary/90 text-black font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Decomposing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-2" />
                                Generate Project Plan
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="grid gap-6">
            <Card className="bg-black/60 border-white/10 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-3 text-white text-xl">
                            <AlignLeft className="w-6 h-6 text-primary" />
                            Executive Summary
                        </CardTitle>
                        {onGenerate && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="text-white/40 hover:text-primary hover:bg-primary/5 text-[10px] font-bold uppercase tracking-widest gap-2"
                            >
                                {isGenerating ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                    <Sparkles className="w-3 h-3" />
                                )}
                                Recreate with AI
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-white/80 leading-relaxed text-lg pt-2">{project.summary}</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-black/60 border-white/10 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-3 text-white text-xl">
                            <Cpu className="w-6 h-6 text-accent" />
                            Architecture & Stack
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-white/80 leading-relaxed pt-2">{project.architecture}</p>
                    </CardContent>
                </Card>

                <Card className="bg-black/60 border-white/10 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-3 text-white text-xl">
                            <Calendar className="w-6 h-6 text-green-400" />
                            Estimated Timeline
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="pt-4 flex items-center">
                            <div className="px-6 py-3 rounded-2xl bg-green-500/10 border border-green-500/30">
                                <span className="text-2xl font-bold text-green-400">{project.timeline}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
