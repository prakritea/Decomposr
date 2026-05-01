import { useState } from "react";
import Aurora from "@/components/ui/Aurora";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/dashboard/LoadingSpinner";
import { EpicCard, Epic } from "@/components/dashboard/EpicCard";
import { KanbanBoard, BoardStatus } from "@/components/dashboard/KanbanBoard";
import { Task } from "@/components/dashboard/TaskCard";
import { Download, FileJson, FileText, Share2 } from "lucide-react";
import { mockGenerateProjectPlan } from "@/lib/mockData";

interface ProjectPlan {
  title: string;
  summary: string;
  architecture: string;
  estimatedTimeline: string;
  epics: Epic[];
  roles: string[];
  timeline: string[];
}

type TabValue = "epics" | "tasks" | "roles" | "timeline" | "kanban";

export default function Dashboard() {
  const [projectDescription, setProjectDescription] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("web");
  const [techStack, setTechStack] = useState("react");
  const [teamSize, setTeamSize] = useState("medium");
  const [timeline, setTimeline] = useState("3-6 months");
  const [isLoading, setIsLoading] = useState(false);
  const [projectPlan, setProjectPlan] = useState<ProjectPlan | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("epics");
  const [kanbanTasks, setKanbanTasks] = useState<Record<BoardStatus, Task[]>>({
    backlog: [],
    todo: [],
    inprogress: [],
    done: [],
  });

  const handleGeneratePlan = async () => {
    if (!projectDescription.trim()) {
      alert("Please describe your project");
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const plan = mockGenerateProjectPlan(
        projectDescription,
        targetPlatform,
        techStack,
        teamSize,
        timeline
      );
      setProjectPlan(plan);

      // Initialize Kanban with backlog items
      const allTasks = plan.epics.flatMap((e) => e.tasks);
      setKanbanTasks({
        backlog: allTasks,
        todo: [],
        inprogress: [],
        done: [],
      });

      setIsLoading(false);
    }, 2000);
  };

  const handleMoveTask = (taskId: string, from: BoardStatus, to: BoardStatus) => {
    setKanbanTasks((prev) => {
      const task = prev[from].find((t) => t.id === taskId);
      if (!task) return prev;

      return {
        ...prev,
        [from]: prev[from].filter((t) => t.id !== taskId),
        [to]: [...prev[to], task],
      };
    });
  };

  const handleExport = (format: "json" | "csv" | "jira" | "github") => {
    if (!projectPlan) return;

    let content = "";
    let filename = "project-plan";

    switch (format) {
      case "json":
        content = JSON.stringify(projectPlan, null, 2);
        filename += ".json";
        break;
      case "csv":
        // CSV export of all tasks
        const headers = ["Epic", "Task", "Role", "Priority", "Effort", "Category"];
        const rows = projectPlan.epics.flatMap((epic) =>
          epic.tasks.map((task) => [
            epic.title,
            task.title,
            task.role,
            task.priority,
            task.effort,
            task.category || "",
          ])
        );
        content = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
        filename += ".csv";
        break;
      case "jira":
        content = generateJiraFormat(projectPlan);
        filename += ".txt";
        break;
      case "github":
        content = generateGithubFormat(projectPlan);
        filename += ".md";
        break;
    }

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateJiraFormat = (plan: ProjectPlan) => {
    let content = `Project: ${plan.title}\n\n`;
    plan.epics.forEach((epic) => {
      content += `Epic: ${epic.title}\n`;
      content += `Description: ${epic.description}\n`;
      epic.tasks.forEach((task) => {
        content += `  - Task: ${task.title}\n`;
        content += `    Role: ${task.role}\n`;
        content += `    Priority: ${task.priority}\n`;
      });
      content += "\n";
    });
    return content;
  };

  const generateGithubFormat = (plan: ProjectPlan) => {
    let content = `# ${plan.title}\n\n`;
    content += `## Overview\n${plan.summary}\n\n`;
    content += `## Epics\n\n`;
    plan.epics.forEach((epic) => {
      content += `### ${epic.title}\n${epic.description}\n\n`;
      content += `#### Tasks\n`;
      epic.tasks.forEach((task) => {
        content += `- [ ] ${task.title}\n`;
        content += `  - Role: ${task.role}\n`;
        content += `  - Priority: ${task.priority}\n\n`;
      });
    });
    return content;
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Aurora Background */}
      <div className="absolute top-0 left-0 w-full h-[800px] z-0 opacity-50 pointer-events-none">
        <Aurora
          colorStops={["#60ff50", "#a64dff", "#2000ff"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-8 relative z-10">
        {!projectPlan ? (
          // Input Area - Left Panel
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Create Your Project Plan
              </h1>
              <p className="text-white/60">
                Describe your project and let AI break it down into structured tasks, roles, and timelines.
              </p>
            </div>

            <div className="space-y-6">
              {/* Project Description */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Describe Your Project
                </label>
                <Textarea
                  placeholder="E.g., Build a real-time collaboration platform for remote teams with video conferencing, chat, screen sharing, and document editing capabilities. The platform should support up to 100 concurrent users and integrate with popular tools like Slack, Google Drive, and Jira..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="min-h-40 resize-none bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-white/40"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Target Platform */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Target Platform
                  </label>
                  <Select value={targetPlatform} onValueChange={setTargetPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="fullstack">Full Stack</SelectItem>
                      <SelectItem value="aiml">AI/ML</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tech Stack */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Tech Stack Preference
                  </label>
                  <Select value={techStack} onValueChange={setTechStack}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React + Node.js</SelectItem>
                      <SelectItem value="vue">Vue + Python</SelectItem>
                      <SelectItem value="angular">Angular + Java</SelectItem>
                      <SelectItem value="nextjs">Next.js + Firebase</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Team Size */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Team Size
                  </label>
                  <Select value={teamSize} onValueChange={setTeamSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solo">Solo Developer</SelectItem>
                      <SelectItem value="small">Small (2-5)</SelectItem>
                      <SelectItem value="medium">Medium (6-15)</SelectItem>
                      <SelectItem value="large">Large (15+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Project Timeline */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">
                    Project Timeline
                  </label>
                  <Select value={timeline} onValueChange={setTimeline}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-3 months">1-3 months</SelectItem>
                      <SelectItem value="3-6 months">3-6 months</SelectItem>
                      <SelectItem value="6-12 months">6-12 months</SelectItem>
                      <SelectItem value="12+ months">12+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGeneratePlan}
                disabled={isLoading}
                size="lg"
                className="w-full bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black font-bold h-12 shadow-lg shadow-[#60ff50]/20"
              >
                {isLoading ? "Generating..." : "Generate Project Plan"}
              </Button>

              {isLoading && (
                <div className="text-center py-12">
                  <LoadingSpinner />
                  <p className="mt-4 text-white/60">
                    AI is analyzing your project and creating a comprehensive plan...
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Results Area - Right Panel
          <div className="space-y-8">
            {/* Project Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white/60 mb-2">
                  Project Title
                </h3>
                <p className="text-lg font-bold text-white">
                  {projectPlan.title}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white/60 mb-2">
                  Total Epics
                </h3>
                <p className="text-lg font-bold text-primary">
                  {projectPlan.epics.length}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white/60 mb-2">
                  Total Tasks
                </h3>
                <p className="text-lg font-bold text-accent">
                  {projectPlan.epics.reduce((sum, e) => sum + e.tasks.length, 0)}
                </p>
              </div>
              <div className="p-6 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                <h3 className="text-sm font-semibold text-white/60 mb-2">
                  Timeline
                </h3>
                <p className="text-lg font-bold text-white">
                  {projectPlan.estimatedTimeline}
                </p>
              </div>
            </div>

            {/* Export Options */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/30 backdrop-blur-sm">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-2">
                  Export Your Plan
                </h3>
                <p className="text-sm text-white/60 mb-3">
                  Download your project breakdown in multiple formats
                </p>
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-col lg:flex-row">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport("json")}
                  className="gap-2"
                >
                  <FileJson className="w-4 h-4" />
                  JSON
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport("csv")}
                  className="gap-2"
                >
                  <FileText className="w-4 h-4" />
                  CSV
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport("jira")}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Jira
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleExport("github")}
                  className="gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  GitHub
                </Button>
              </div>
            </div>

            {/* Tabbed Interface */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabValue)}>
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="epics">Epics</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="kanban">Kanban</TabsTrigger>
                <TabsTrigger value="roles">Roles</TabsTrigger>
              </TabsList>

              {/* Epics Tab */}
              <TabsContent value="epics" className="space-y-4 mt-6">
                <div className="space-y-4">
                  {projectPlan.epics.map((epic) => (
                    <EpicCard key={epic.id} epic={epic} />
                  ))}
                </div>
              </TabsContent>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-4 mt-6">
                <div className="grid gap-4">
                  {projectPlan.epics.map((epic) => (
                    <div key={epic.id}>
                      <h3 className="font-semibold text-white mb-3">
                        {epic.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {epic.tasks.map((task) => (
                          <div key={task.id} className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                            <h4 className="font-semibold text-white mb-2">
                              {task.title}
                            </h4>
                            <p className="text-sm text-white/60 mb-3">
                              {task.description}
                            </p>
                            <div className="flex gap-2 flex-wrap text-xs">
                              <span className="px-2 py-1 rounded bg-primary/20 text-primary-300">
                                {task.role}
                              </span>
                              <span className="px-2 py-1 rounded bg-accent/20 text-accent">
                                {task.priority}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Kanban Tab */}
              <TabsContent value="kanban" className="mt-6">
                <KanbanBoard
                  tasks={kanbanTasks}
                  onMoveTask={handleMoveTask}
                />
              </TabsContent>

              {/* Roles Tab */}
              <TabsContent value="roles" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectPlan.roles.map((role, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 hover:shadow-lg hover:shadow-primary/20 transition-all"
                    >
                      <h3 className="font-semibold text-white mb-2">
                        {role}
                      </h3>
                      <p className="text-sm text-white/60">
                        Essential role for project success and delivery
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Back Button */}
            <Button
              onClick={() => setProjectPlan(null)}
              className="mt-8 bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/40"
            >
              Create New Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
