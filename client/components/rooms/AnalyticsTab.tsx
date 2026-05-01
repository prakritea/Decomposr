import { Project, Task } from "@/types/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import { format, differenceInDays, addDays, isAfter, isBefore } from "date-fns";

interface AnalyticsTabProps {
    project: Project;
}

export function AnalyticsTab({ project }: AnalyticsTabProps) {
    // 1. Calculate Stats
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(t => t.status === 'done').length;
    const totalEstimate = project.tasks.reduce((sum, t) => sum + (t.timeEstimate || 0), 0);
    const totalSpent = project.tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

    // 2. Prepare Burndown Data
    // Find project start date (earliest task created or project created)
    const startDate = new Date(project.createdAt);

    // Find project end date (latest due date)
    const dates = project.tasks.map(t => new Date(t.dueDate));
    let endDate = new Date();
    if (dates.length > 0) {
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        endDate = maxDate;
    }
    // If endDate is before startDate (weird data), standardise
    if (endDate < startDate) endDate = addDays(startDate, 14);

    const totalDays = differenceInDays(endDate, startDate) + 1;
    const burndownData = [];

    // Simple Burndown Logic:
    // Ideal: Decreases linearly from totalEstimate to 0
    // Actual: TotalEstimate - (sum of estimates of DONE tasks accumulating over time)
    // Note: Ideally we track historical data. For this MVP, we will simulate "Actual" based on "updatedAt" of done tasks.

    let currentEffort = totalEstimate;
    const dailyIdealDrop = totalEstimate / totalDays;

    // Sort done tasks by update time
    const doneTasks = project.tasks
        .filter(t => t.status === 'done')
        .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

    for (let i = 0; i <= totalDays; i++) {
        const currentDate = addDays(startDate, i);
        const dayStr = format(currentDate, 'MMM d');

        // Ideal
        const ideal = Math.max(0, totalEstimate - (dailyIdealDrop * i));

        // Actual
        // For passed days, calculate actual. For future, null (don't show line).
        let actual: number | null = null;
        if (currentDate <= new Date()) {
            // Calculate how much effort was burned by this date
            // A task is "burned" if it's done and updatedAt <= currentDate
            const burned = doneTasks
                .filter(t => new Date(t.updatedAt) <= currentDate)
                .reduce((sum, t) => sum + (t.timeEstimate || 0), 0); // Burning the estimate value
            actual = Math.max(0, totalEstimate - burned);
        }

        burndownData.push({
            date: dayStr,
            Ideal: parseFloat(ideal.toFixed(1)),
            Actual: actual
        });
    }

    // 3. Prepare Gantt Data (Sorted by start date)
    const ganttTasks = [...project.tasks].sort((a, b) => {
        const d1 = a.startDate ? new Date(a.startDate) : new Date(a.createdAt);
        const d2 = b.startDate ? new Date(b.startDate) : new Date(b.createdAt);
        return d1.getTime() - d2.getTime();
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/60">Total Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{totalTasks}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/60">Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-400">
                            {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/60">Estimated Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-400">{totalEstimate}h</div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-white/60">Time Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-400">{totalSpent}h</div>
                    </CardContent>
                </Card>
            </div>

            {/* Burndown Chart */}
            <Card className="bg-black/50 border-white/10">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Sprint Burndown</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={burndownData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis
                                dataKey="date"
                                stroke="rgba(255,255,255,0.4)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.4)"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                label={{ value: 'Hours Remaining', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.4)' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="Ideal"
                                stroke="#4ade80"
                                strokeWidth={2}
                                dot={false}
                                strokeDasharray="5 5"
                            />
                            <Line
                                type="monotone"
                                dataKey="Actual"
                                stroke="#8b5cf6"
                                strokeWidth={3}
                                dot={{ fill: '#8b5cf6' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Gantt Chart (Simplified CSS Grid Visualization) */}
            <Card className="bg-black/50 border-white/10 overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-white text-lg">Project Timeline (Gantt)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <div className="min-w-[800px] p-6 pt-0">
                            {/* Header Dates (Rough approximation - just showing months/weeks might be better but for MVP list tasks) */}
                            <div className="flex border-b border-white/10 pb-4 mb-4">
                                <div className="w-1/4 text-sm font-medium text-white/40">Task</div>
                                <div className="w-3/4 flex justify-between px-4 text-sm font-medium text-white/40">
                                    <span>{format(startDate, 'MMM d')}</span>
                                    <span>{format(endDate, 'MMM d')}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {ganttTasks.map(task => {
                                    const taskStart = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
                                    const taskEnd = new Date(task.dueDate);

                                    // Calculate percentages for position
                                    let startPercent = (differenceInDays(taskStart, startDate) / totalDays) * 100;
                                    let durationPercent = (differenceInDays(taskEnd, taskStart) / totalDays) * 100;

                                    // Bounds checks
                                    if (startPercent < 0) startPercent = 0;
                                    if (durationPercent < 1) durationPercent = 1; // Minimum width
                                    if ((startPercent + durationPercent) > 100) durationPercent = 100 - startPercent;

                                    return (
                                        <div key={task.id} className="flex items-center group">
                                            <div className="w-1/4 pr-4">
                                                <div className="text-sm font-medium text-white truncate">{task.title}</div>
                                                <div className="text-xs text-white/40">{task.assignedToName || "Unassigned"}</div>
                                            </div>
                                            <div className="w-3/4 h-8 bg-white/5 rounded-full relative overflow-hidden">
                                                {/* Bar */}
                                                <div
                                                    className={`absolute h-full rounded-full transition-all duration-300 opacity-80 group-hover:opacity-100 flex items-center px-2 text-[10px] text-white whitespace-nowrap overflow-hidden
                                                        ${task.status === 'done' ? 'bg-green-500/50' :
                                                            task.status === 'inprogress' ? 'bg-blue-500/50' :
                                                                task.status === 'review' ? 'bg-yellow-500/50' : 'bg-white/10'}
                                                    `}
                                                    style={{
                                                        left: `${startPercent}%`,
                                                        width: `${durationPercent}%`
                                                    }}
                                                >
                                                    {task.timeEstimate ? `${task.timeEstimate}h` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
