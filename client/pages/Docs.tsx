import { useState } from "react";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Docs() {
    const [activeSection, setActiveSection] = useState("getting-started");
    const [searchQuery, setSearchQuery] = useState("");

    const renderContent = () => {
        switch (activeSection) {
            case "getting-started":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-4">Getting Started with Decomposr</h2>
                            <p className="text-white/80 text-lg leading-relaxed">
                                Decomposr is an AI-powered project management tool that helps you break down complex ideas into actionable plans.
                                Whether you are building a SaaS product, a mobile app, or an enterprise solution, Decomposr automates the initial planning phase.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">How it Works</CardTitle>
                                </CardHeader>
                                <CardContent className="text-white/70 space-y-2">
                                    <p>1. <strong>Describe:</strong> Enter your project idea in natural language.</p>
                                    <p>2. <strong>Analyze:</strong> Our OpenRouter-powered AI agents decompose the idea into Epics and Tasks.</p>
                                    <p>3. <strong>Plan:</strong> Review generated roles, timelines, and kanban boards.</p>
                                </CardContent>
                            </Card>
                            <Card className="bg-white/5 border-white/10">
                                <CardHeader>
                                    <CardTitle className="text-white">Quick Start</CardTitle>
                                </CardHeader>
                                <CardContent className="text-white/70 space-y-2">
                                    <p>Go to the <strong>Dashboard</strong>, select your tech stack, and hit "Generate". It's that simple.</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            case "how-to-use":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4">How to Use Decomposr</h2>
                        <div className="space-y-6 text-white/80">
                            <section>
                                <h3 className="text-2xl font-semibold text-primary mb-2">Creating a New Project</h3>
                                <p>Navigate to the Dashboard. You will see a configuration panel on the left.</p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li><strong>Project Description:</strong> Be as detailed as possible.</li>
                                    <li><strong>Target Platform:</strong> Web, Mobile, etc.</li>
                                    <li><strong>Tech Stack:</strong> Choose your preferred technologies.</li>
                                    <li><strong>Team Size & Timeline:</strong> Helps estimation algorithms.</li>
                                </ul>
                            </section>
                            <section>
                                <h3 className="text-2xl font-semibold text-primary mb-2">Understanding the Output</h3>
                                <p>The AI generates a complete project structure:</p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li><strong>Epics:</strong> High-level milestones (e.g., "User Authentication").</li>
                                    <li><strong>Tasks:</strong> Granular work items belonging to an Epic.</li>
                                    <li><strong>Roles:</strong> Required team members (e.g., "Frontend Dev").</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                );
            case "prompting-guide":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4">Prompting Guide</h2>
                        <p className="text-white/80">The quality of your project plan depends on the quality of your input.</p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <Card className="bg-red-500/10 border-red-500/20">
                                <CardHeader>
                                    <CardTitle className="text-red-400">Bad Prompt</CardTitle>
                                </CardHeader>
                                <CardContent className="text-white/70">
                                    "Build me a website like Uber."
                                </CardContent>
                            </Card>
                            <Card className="bg-green-500/10 border-green-500/20">
                                <CardHeader>
                                    <CardTitle className="text-green-400">Good Prompt</CardTitle>
                                </CardHeader>
                                <CardContent className="text-white/70">
                                    "Create a ride-sharing web application for a niche market of pet owners. Key features include real-time tracking, pet-friendly driver matching, and in-app payments. Tech stack should be React and Node.js."
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );
            case "feature-reference":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4">Feature Reference</h2>
                        <div className="grid gap-4">
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white">Kanban Board</h3>
                                <p className="text-white/60">Drag and drop tasks, assign members, and accept tasks to track progress.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white">Real-time Notifications</h3>
                                <p className="text-white/60">Stay updated when tasks are completed, ready for review, or when new members join.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white">Profile & Settings</h3>
                                <p className="text-white/60">Manage your account, view activity stats, and customize your experience.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white">Export Tools</h3>
                                <p className="text-white/60">Export your plan to JSON, CSV, Jira compatible format, or GitHub markdown.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                                <h3 className="text-xl font-bold text-white">Role Management</h3>
                                <p className="text-white/60">See exactly who you need to hire or assign for each task.</p>
                            </div>
                        </div>
                    </div>
                );
            case "examples-library":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4">Examples Library</h2>
                        <p className="text-white/80">Explore sample project breakdown structures.</p>
                        <div className="grid md:grid-cols-3 gap-4">
                            {['E-Commerce Platform', 'Social Media App', 'CRM System'].map((ex, i) => (
                                <Card key={i} className="bg-white/5 border-white/10 hover:border-primary/50 transition-colors cursor-pointer">
                                    <CardHeader>
                                        <CardTitle className="text-white text-lg">{ex}</CardTitle>
                                        <CardDescription>Click to view structure</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                );
            case "api-reference":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4">API Reference</h2>
                        <div className="bg-black/80 rounded-lg p-6 font-mono text-sm border border-white/10">
                            <div className="text-purple-400 mb-2">// POST /api/generate</div>
                            <div className="text-white/80">
                                {`{
  "description": "string",
  "techStack": "string",
  "platform": "string"
}`}
                            </div>
                        </div>
                        <p className="text-white/60">Note: This API is currently for internal dashboard use only.</p>
                    </div>
                );
            case "faq":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {[
                                { q: "Can AI replace a Product Manager?", a: "No. Decomposr is a tool to augment PMs, automating the tedious initial breakdown so you can focus on strategy." },
                                { q: "How accurate are the estimates?", a: "Estimates are based on standard industry complexity benchmarks but vary by team velocity." },
                                { q: "Is my data private?", a: "Yes, we use enterprise-grade encryption and do not train models on your specific project data." }
                            ].map((faq, i) => (
                                <div key={i} className="p-4 rounded-lg bg-white/5 border border-white/10">
                                    <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                                    <p className="text-white/70">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "troubleshooting":
                return (
                    <div className="space-y-8 animate-fade-in">
                        <h2 className="text-3xl font-bold text-white mb-4">Troubleshooting</h2>
                        <div className="space-y-4">
                            <div className="p-4 border-l-4 border-yellow-500 bg-white/5">
                                <h3 className="text-white font-bold">Generation Stuck?</h3>
                                <p className="text-white/60">If generation takes longer than 30 seconds, please refresh the page and try a shorter description.</p>
                            </div>
                            <div className="p-4 border-l-4 border-red-500 bg-white/5">
                                <h3 className="text-white font-bold">Export Failed?</h3>
                                <p className="text-white/60">Ensure you have allowed pop-ups for downloading files.</p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return <div>Select a section</div>;
        }
    };

    return (
        <DocsLayout
            activeSection={activeSection}
            onSelectSection={setActiveSection}
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
        >
            {renderContent()}
        </DocsLayout>
    );
}
