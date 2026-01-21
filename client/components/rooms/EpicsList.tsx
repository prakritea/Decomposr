import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project, Epic, TaskPriority } from "@/types/project";
import { Layers, ListTodo } from "lucide-react";

export function EpicsList({ project }: { project: Project }) {
    if (!project.epics || project.epics.length === 0) {
        return (
            <div className="text-center py-12 text-white/40">
                <Layers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No epics defined yet. Generate an AI plan to see the breakdown.</p>
            </div>
        );
    }

    const priorityColors: Record<string, string> = {
        low: "text-gray-400 border-gray-400/20",
        medium: "text-blue-400 border-blue-400/20",
        high: "text-yellow-400 border-yellow-400/20",
        urgent: "text-red-400 border-red-400/20"
    };

    return (
        <div className="space-y-6">
            {project.epics.map((epic) => (
                <Card key={epic.id} className="bg-black/40 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl text-white flex items-center justify-between">
                            {epic.name}
                            <Badge variant="secondary" className="bg-white/10 text-white/60">
                                {epic.tasks?.length || 0} Tasks
                            </Badge>
                        </CardTitle>
                        {epic.description && <p className="text-sm text-white/60">{epic.description}</p>}
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 mt-4">
                            {epic.tasks?.map((task) => (
                                <div key={task.id} className="flex items-start justify-between p-3 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">{task.title}</span>
                                            {task.category && (
                                                <Badge variant="outline" className="text-[10px] border-white/10 text-white/40">
                                                    {task.category}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-white/50 line-clamp-1">{task.description}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {task.effort && <span className="text-xs text-white/40 font-mono">{task.effort}</span>}
                                        <Badge variant="outline" className={`capitalize ${priorityColors[task.priority] || priorityColors.medium}`}>
                                            {task.priority}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
