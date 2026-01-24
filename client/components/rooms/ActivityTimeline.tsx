import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task } from "@/types/project";
import { formatDistanceToNow } from "date-fns";
import { Activity, CheckCircle2, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface ActivityTimelineProps {
    tasks: Task[];
}

export function ActivityTimeline({ tasks }: ActivityTimelineProps) {
    // Sort tasks by updatedAt descending and take top 8 for a more complete timeline
    const recentTasks = [...tasks]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 8);

    if (recentTasks.length === 0) return (
        <Card className="bg-black/50 border-white/10 mt-6">
            <CardContent className="py-12 text-center text-white/40">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No activity recorded yet for this project.</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="py-8">
            <div className="flex items-center gap-3 mb-10 px-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <Activity className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
            </div>

            <div className="relative">
                {/* Central Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500/50 via-white/10 to-transparent hidden md:block" />

                {/* Mobile Line */}
                <div className="absolute left-6 w-0.5 h-full bg-gradient-to-b from-blue-500/50 via-white/10 to-transparent md:hidden" />

                <div className="space-y-12">
                    {recentTasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Dot on the Line */}
                            <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                                <div className="w-10 h-10 rounded-full bg-black border-2 border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className={`ml-16 md:ml-0 md:w-[45%] group`}>
                                <div className={`bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:border-blue-500/30 transition-all duration-300 shadow-xl`}>
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{task.title}</h4>
                                        <span className="text-[10px] text-white/40 font-mono tracking-tighter ml-4 whitespace-nowrap bg-white/5 py-1 px-2 rounded">
                                            {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className="text-sm text-white/60 mb-4 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60" />
                                        Status updated to <span className="text-white font-semibold">{task.status}</span>
                                    </div>

                                    {task.assignedTo && (
                                        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                                            <Avatar className="w-6 h-6 border border-white/10">
                                                <AvatarImage src={task.assignedTo.avatar || undefined} />
                                                <AvatarFallback className="bg-blue-500/20 text-blue-400 text-[10px] font-bold">
                                                    {task.assignedTo.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-white/40">
                                                Assigned to <span className="text-white/70 font-medium">{task.assignedTo.name}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Spacer for MD screens to maintain layout */}
                            <div className="hidden md:block md:w-[45%]" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
