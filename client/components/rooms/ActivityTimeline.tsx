import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Activity, CheckCircle2, Circle, FolderPlus, Clock, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

export interface ActivityItem {
    id: string;
    type: 'room_created' | 'task_created' | 'task_updated' | 'task_done' | 'task_review';
    title: string;
    description?: string;
    timestamp: Date;
    roomName?: string;
    projectName?: string;
    status?: string;
    assignedTo?: { name: string; avatar?: string | null };
}

interface ActivityTimelineProps {
    activities: ActivityItem[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
    // Sort by timestamp descending and take top 10
    const sortedActivities = [...activities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

    if (sortedActivities.length === 0) return (
        <Card className="bg-black/50 border-white/10 mt-6">
            <CardContent className="py-12 text-center text-white/40">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>No activity recorded yet across your projects.</p>
            </CardContent>
        </Card>
    );

    const getIcon = (type: ActivityItem['type']) => {
        switch (type) {
            case 'room_created': return <FolderPlus className="w-5 h-5 text-primary" />;
            case 'task_created': return <div className="w-3 h-3 rounded-full bg-blue-400" />;
            case 'task_review': return <ClipboardCheck className="w-5 h-5 text-accent" />;
            case 'task_done': return <CheckCircle2 className="w-5 h-5 text-green-400" />;
            default: return <div className="w-3 h-3 rounded-full bg-white/40" />;
        }
    };

    return (
        <div className="py-8">
            <div className="flex items-center gap-3 mb-10 px-4">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Activity className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Recent Activity</h2>
            </div>

            <div className="relative">
                {/* Central Line */}
                <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />

                <div className="space-y-12">
                    {sortedActivities.map((activity, index) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                        >
                            {/* Dot/Icon on the Line */}
                            <div className="absolute left-6 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-20">
                                <div className="w-10 h-10 rounded-full bg-black border-2 border-white/10 flex items-center justify-center shadow-lg">
                                    {getIcon(activity.type)}
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className={`ml-16 md:ml-0 md:w-[45%] group`}>
                                <div className={`bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/10 p-5 rounded-2xl backdrop-blur-md hover:border-white/20 transition-all duration-300 shadow-xl`}>
                                    <div className="flex flex-col gap-1 mb-3">
                                        <div className="flex items-center gap-2">
                                            {activity.roomName && (
                                                <span className="text-[10px] uppercase font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                                                    {activity.roomName}
                                                </span>
                                            )}
                                            {activity.projectName && (
                                                <span className="text-[10px] uppercase font-bold text-accent/60 bg-accent/5 px-2 py-0.5 rounded border border-accent/10">
                                                    {activity.projectName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-start gap-4">
                                            <h4 className="font-bold text-white group-hover:text-primary transition-colors leading-tight">
                                                {activity.title}
                                            </h4>
                                            <span className="text-[10px] text-white/40 font-mono tracking-tighter whitespace-nowrap bg-white/5 py-1 px-2 rounded">
                                                {(() => {
                                                    try {
                                                        const date = new Date(activity.timestamp);
                                                        return isNaN(date.getTime()) ? 'just now' : formatDistanceToNow(date, { addSuffix: true });
                                                    } catch (e) {
                                                        return 'recently';
                                                    }
                                                })()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-sm text-white/60 mb-4 flex items-center gap-2">
                                        {activity.type === 'room_created' ? (
                                            <p>New project room <span className="text-primary font-semibold">created</span></p>
                                        ) : activity.type === 'task_created' ? (
                                            <p>Project plan generated: Task <span className="text-white font-semibold">added</span></p>
                                        ) : activity.type === 'task_done' ? (
                                            <p>Task marked as <span className="text-green-400 font-semibold">done</span></p>
                                        ) : activity.type === 'task_review' ? (
                                            <p>Task sent for <span className="text-accent font-semibold">review</span></p>
                                        ) : (
                                            <p>Task status updated to <span className="text-white font-semibold">{activity.status}</span></p>
                                        )}
                                    </div>

                                    {activity.assignedTo && (
                                        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                                            <Avatar className="w-6 h-6 border border-white/10">
                                                <AvatarImage src={activity.assignedTo.avatar || undefined} />
                                                <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                                                    {activity.assignedTo.name?.charAt(0) || '?'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-white/40">
                                                Managed by <span className="text-white/70 font-medium">{activity.assignedTo.name}</span>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Spacer for MD screens */}
                            <div className="hidden md:block md:w-[45%]" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
