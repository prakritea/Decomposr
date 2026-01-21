import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { Activity, CheckCircle2, Circle } from "lucide-react";

interface ActivityTimelineProps {
    tasks: Task[];
}

export function ActivityTimeline({ tasks }: ActivityTimelineProps) {
    // Sort tasks by updatedAt descending and take top 5
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 5);

    if (recentTasks.length === 0) return null;

    return (
        <Card className="bg-black/50 border-white/10 mt-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white text-lg">
                    <Activity className="w-5 h-5 text-blue-400" />
                    Recent Activity
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                    {recentTasks.map((task) => (
                        <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            {/* Icon/Dot on the Line */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-black/80 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                {task.status === 'done' ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                ) : (
                                    <Circle className="w-4 h-4 text-blue-400" />
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white/5 border border-white/5 p-4 rounded-xl backdrop-blur-sm">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-medium text-white text-sm">{task.title}</h4>
                                    <span className="text-[10px] text-white/40 whitespace-nowrap ml-2">
                                        {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                                    </span>
                                </div>
                                <div className="text-xs text-white/60 mb-2">
                                    Status updated to <span className="text-white font-medium capitalize">{task.status}</span>
                                </div>

                                {task.assignedTo && (
                                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5">
                                        <div className="flex items-center gap-1.5">
                                            <Avatar className="w-4 h-4">
                                                <AvatarImage src={task.assignedTo.avatar || undefined} />
                                                <AvatarFallback className="text-[8px]">
                                                    {task.assignedTo.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-[10px] text-white/40">
                                                Assigned to {task.assignedTo.name}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
