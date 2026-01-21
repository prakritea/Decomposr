import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Cpu, AlignLeft } from "lucide-react";
import { Project } from "@/types/project";
import { ActivityTimeline } from "./ActivityTimeline";

export function ProjectOverview({ project }: { project: Project }) {
    if (!project.isAIPlanGenerated) {
        return null;
    }

    return (
        <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-black/50 border-white/10 md:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <AlignLeft className="w-5 h-5 text-primary" />
                        Executive Summary
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-white/80 leading-relaxed">{project.summary}</p>
                </CardContent>
            </Card>

            <Card className="bg-black/50 border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Cpu className="w-5 h-5 text-accent" />
                        Architecture & Stack
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-white/80 leading-relaxed">{project.architecture}</p>
                </CardContent>
            </Card>

            <Card className="bg-black/50 border-white/10">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Calendar className="w-5 h-5 text-green-400" />
                        Estimated Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-400 border-green-400/20 text-lg py-1 px-4">
                            {project.timeline}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <div className="md:col-span-2">
                <ActivityTimeline tasks={project.tasks} />
            </div>
        </div>
    );
}
