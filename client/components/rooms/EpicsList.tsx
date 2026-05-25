import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Project, Epic, Task, TaskPriority } from "@/types/project";
import { Layers, ListTodo, Clock, ChevronRight, Zap, Target } from "lucide-react";

export function EpicsList({ project }: { project: Project }) {
    if (!project.epics || project.epics.length === 0) {
        return (
            <div className="text-center py-20 bg-black/40 border border-white/5 rounded-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-20" />
                <Layers className="w-16 h-16 mx-auto mb-6 text-white/20 group-hover:text-primary/40 transition-colors" />
                <h3 className="text-xl font-bold text-white mb-2">No Epics Found</h3>
                <p className="text-white/40 max-w-sm mx-auto">
                    Generate an AI plan inside a project to see the detailed breakdown of strategic modules.
                </p>
            </div>
        );
    }

    const priorityColors: Record<string, string> = {
        low: "text-gray-400 border-gray-400/20 bg-gray-400/5",
        medium: "text-blue-400 border-blue-400/20 bg-blue-400/5",
        high: "text-yellow-400 border-yellow-400/20 bg-yellow-400/5",
        urgent: "text-red-400 border-red-400/20 bg-red-400/5"
    };

    const categoryColors: Record<string, string> = {
        Backend: "bg-blue-500",
        Frontend: "bg-purple-500",
        Database: "bg-green-500",
        Security: "bg-red-500",
        DevOps: "bg-orange-500",
        Integration: "bg-cyan-500",
        Testing: "bg-pink-500"
    };

    return (
        <div className="space-y-6">
            <Accordion type="single" collapsible className="space-y-6">
                {project.epics.map((epic, index) => {
                    // Group tasks by category
                    const tasksByCategory: Record<string, Task[]> = {};
                    epic.tasks?.forEach(task => {
                        const cat = task.category || "General";
                        if (!tasksByCategory[cat]) tasksByCategory[cat] = [];
                        tasksByCategory[cat].push(task);
                    });

                    return (
                        <AccordionItem
                            key={epic.id}
                            value={epic.id}
                            className="border-none shadow-lg"
                        >
                            <Card className="bg-[#0c0c14]/80 border-white/5 overflow-hidden backdrop-blur-3xl group">
                                <AccordionTrigger className="hover:no-underline py-0 w-full group">
                                    <div className="flex items-center w-full text-left p-6">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mr-5 border border-white/10 group-data-[state=open]:border-primary/50 transition-all">
                                            <Target className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-xl font-bold text-white tracking-tight">{epic.name}</h3>
                                                <Badge variant="outline" className="text-[10px] h-5 bg-white/5 border-white/10 text-white/60">
                                                    {epic.tasks?.length || 0} tasks
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-white/50 line-clamp-1 pr-6">{epic.description}</p>
                                        </div>
                                    </div>
                                </AccordionTrigger>

                                <AccordionContent className="pt-0 border-t border-white/5">
                                    <div className="p-6 pt-2 space-y-8">
                                        {Object.entries(tasksByCategory).map(([category, tasks]) => (
                                            <div key={category} className="space-y-4">
                                                <div className="flex items-center gap-3 group/cat">
                                                    <div className={`w-3 h-3 rounded-full ${categoryColors[category] || "bg-gray-500"} shadow-lg shadow-${category.toLowerCase()}-500/20`} />
                                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-white/40 group-hover/cat:text-white/60 transition-colors">
                                                        {category}
                                                    </h4>
                                                    <div className="flex-1 h-px bg-white/5" />
                                                </div>

                                                <div className="grid gap-4 pl-6 relative">
                                                    <div className="absolute left-1.5 top-0 bottom-0 w-px bg-white/5" />
                                                    {tasks.map((task) => (
                                                        <div
                                                            key={task.id}
                                                            className="relative flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group/task"
                                                        >
                                                            <div className="flex-1 pr-8">
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover/task:bg-primary transition-colors" />
                                                                    <h5 className="text-white font-semibold text-sm tracking-wide">{task.title}</h5>
                                                                    {task.ownerRole && (
                                                                        <Badge variant="secondary" className="text-[9px] bg-primary/10 text-primary border-primary/20 h-4">
                                                                            {task.ownerRole}
                                                                        </Badge>
                                                                    )}
                                                                    <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter h-4 px-1 ${priorityColors[task.priority]}`}>
                                                                        {task.priority}
                                                                    </Badge>
                                                                </div>
                                                                <p className="text-xs text-white/40 leading-relaxed pl-4.5 line-clamp-2">{task.description}</p>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                                {task.effort && (
                                                                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-white/30 bg-black/20 px-2 py-1 rounded-md border border-white/5">
                                                                        <Clock className="w-3 h-3" />
                                                                        {task.effort}
                                                                    </div>
                                                                )}
                                                                {task.dependencies !== "None" && (
                                                                    <div className="flex items-center gap-1.5 text-[9px] text-accent/60 bg-accent/5 px-2 py-0.5 rounded-full border border-accent/10">
                                                                        <Zap className="w-3 h-3" />
                                                                        Deps
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
}
