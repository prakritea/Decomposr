import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Book,
    Code,
    Compass,
    FileText,
    HelpCircle,
    Layout,
    Lightbulb,
    Zap,
} from "lucide-react";

interface DocsSidebarProps {
    activeSection: string;
    onSelectSection: (section: string) => void;
    className?: string;
}

export const sidebarItems = [
    {
        id: "getting-started",
        title: "Getting Started",
        icon: Zap,
    },
    {
        id: "how-to-use",
        title: "How to Use",
        icon: Compass,
    },
    {
        id: "prompting-guide",
        title: "Prompting Guide",
        icon: Lightbulb,
    },
    {
        id: "feature-reference",
        title: "Feature Reference",
        icon: Layout,
    },
    {
        id: "examples-library",
        title: "Examples Library",
        icon: Book,
    },
    {
        id: "api-reference",
        title: "API Reference",
        icon: Code,
    },
    {
        id: "faq",
        title: "FAQ",
        icon: HelpCircle,
    },
    {
        id: "troubleshooting",
        title: "Troubleshooting",
        icon: FileText,
    },
];

export function DocsSidebar({ activeSection, onSelectSection, className }: DocsSidebarProps) {
    return (
        <div className={cn("pb-12 w-64 border-r border-white/10 bg-black/50 backdrop-blur-xl sticky top-20 self-start hidden md:block", className)}>
            <div className="space-y-4 py-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-white">
                        Documentation
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeSection === item.id ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start",
                                    activeSection === item.id
                                        ? "bg-white/10 text-white"
                                        : "text-white/60 hover:text-white hover:bg-white/5"
                                )}
                                onClick={() => onSelectSection(item.id)}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
