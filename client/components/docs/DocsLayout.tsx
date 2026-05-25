import { ReactNode } from "react";
import { DocsSidebar } from "./DocsSidebar";
import { DocsSearch } from "./DocsSearch";
import Aurora from "@/components/ui/Aurora";

interface DocsLayoutProps {
    children: ReactNode;
    activeSection: string;
    onSelectSection: (section: string) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
}

export function DocsLayout({
    children,
    activeSection,
    onSelectSection,
    searchValue,
    onSearchChange,
}: DocsLayoutProps) {
    return (
        <div className="min-h-screen bg-black relative pt-20">
            {/* Background */}
            <div className="absolute top-0 left-0 w-full h-[500px] z-0 opacity-30 pointer-events-none">
                <Aurora
                    colorStops={["#60ff50", "#a64dff", "#2000ff"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={0.5}
                />
            </div>

            <div className="relative z-10 flex max-w-[1400px] mx-auto">
                <DocsSidebar activeSection={activeSection} onSelectSection={onSelectSection} />

                <div className="flex-1 py-8 px-4 md:px-8 min-w-0">
                    <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">Docs</h1>
                            <p className="text-white/60">Documentation & Knowledge Base</p>
                        </div>
                        <DocsSearch value={searchValue} onChange={onSearchChange} />
                    </div>

                    <div className="prose prose-invert max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
