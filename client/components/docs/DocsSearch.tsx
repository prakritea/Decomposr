import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocsSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export function DocsSearch({ value, onChange }: DocsSearchProps) {
    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search documentation..."
                className="pl-8 bg-white/5 border-white/10 text-white focus:ring-primary/50"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
