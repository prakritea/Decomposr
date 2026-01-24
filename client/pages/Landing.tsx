import { Link } from "react-router-dom";
import Aurora from "@/components/ui/Aurora";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
    Zap,
    Users,
    Calendar,
    GitBranch,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    BarChart3,
    Shield,
    Brain,
    Rocket,
    Star,
    Quote,
    ArrowLeft,
    ArrowRightIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const features = [
    {
        icon: Brain,
        title: "AI Task Decomposition",
        description:
            "Intelligently break down complex projects into actionable tasks using advanced LLM technology",
        size: "col-span-1 md:col-span-2",
        color: "from-[#60ff50] to-[#2000ff]",
    },
    {
        icon: Users,
        title: "Smart Role Assignment",
        description:
            "Automatically assign optimal roles based on task complexity",
        size: "col-span-1 md:col-span-1",
        color: "from-[#a64dff] to-[#60ff50]",
    },
    {
        icon: Calendar,
        title: "Sprint Planning",
        description:
            "Generate realistic timelines tailored to your scope",
        size: "col-span-1 md:col-span-1",
        color: "from-[#2000ff] to-[#a64dff]",
    },
    {
        icon: GitBranch,
        title: "Multi-Platform Export",
        description:
            "Export to Jira, GitHub Issues, JSON, CSV, and more in one click",
        size: "col-span-1 md:col-span-2",
        color: "from-[#60ff50] to-[#2000ff]",
    },
    {
        icon: CheckCircle2,
        title: "Drag-Drop Kanban",
        description:
            "Intuitive board to organize and track tasks",
        size: "col-span-1 md:col-span-1",
        color: "from-[#a64dff] to-[#60ff50]",
    },
    {
        icon: Shield,
        title: "Enterprise Security",
        description:
            "Enterprise-grade encryption for your data",
        size: "col-span-1 md:col-span-1",
        color: "from-[#2000ff] to-[#a64dff]",
    },
    {
        icon: BarChart3,
        title: "Advanced Analytics",
        description:
            "Track project velocity and team productivity in real-time",
        size: "col-span-1 md:col-span-2",
        color: "from-[#60ff50] to-[#2000ff]",
    },
    {
        icon: Users,
        title: "Real-time Collaboration",
        description:
            "Work together with your team in real-time. Share ideas, assign tasks, and track progress live.",
        size: "col-span-1 md:col-span-2",
        color: "from-[#a64dff] to-[#2000ff]",
    },
];

const testimonials = [
    {
        name: "Sarah Chen",
        title: "Product Manager at TechVenture",
        quote:
            "Decomposr cut our project planning time by 70%. What used to take weeks now takes hours.",
        avatar: "SC",
        company: "TechVenture",
    },
    {
        name: "Marcus Rodriguez",
        title: "Engineering Lead at InnovateCo",
        quote:
            "The AI-generated task breakdown is eerily accurate. Our team immediately understood the scope.",
        avatar: "MR",
        company: "InnovateCo",
    },
    {
        name: "Priya Patel",
        title: "CTO at DigitalFirst",
        quote:
            "Best investment we made for team productivity. The Kanban export to Jira is seamless.",
        avatar: "PP",
        company: "DigitalFirst",
    },
    {
        name: "James Wilson",
        title: "Startup Founder at BuildNow",
        quote:
            "As a solo founder, this tool helped me structure complex ideas into actionable plans instantly.",
        avatar: "JW",
        company: "BuildNow",
    },
];

const companies = [
    "Techstars",
    "Y Combinator",
    "500 Global",
    "Sequoia",
    "Andreessen Horowitz",
    "Accel Partners",
];

const FeatureIllustration = ({ type, isLarge, isTall }: { type: string; isLarge: boolean; isTall: boolean }) => {
    const containerClass = `relative w-full ${isTall ? 'h-48' : 'h-32'} mb-6 overflow-hidden rounded-xl bg-black/40 flex items-center justify-center border border-white/5`;

    switch (type) {
        case "AI Task Decomposition":
            return (
                <div className={`${containerClass} mt-6`}>
                    <svg width={isLarge ? (isTall ? "400" : "300") : "200"} height={isTall ? "120" : "100"} viewBox={`0 0 ${isLarge ? (isTall ? "400" : "300") : "200"} ${isTall ? "120" : "100"}`} className="opacity-60">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <motion.circle cx="40" cy="60" r="5" className="fill-primary" filter="url(#glow)" />
                        <motion.path
                            d={isLarge ? "M 45 60 L 120 30 M 45 60 L 120 90 M 120 30 L 200 15 M 120 30 L 200 45 M 120 90 L 200 75 M 120 90 L 200 105" : "M 45 60 L 100 40 M 45 60 L 100 80"}
                            stroke="currentColor" strokeWidth="1.5" fill="none" className="text-primary/40"
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        />
                        {[
                            { x: isLarge ? 120 : 100, y: isLarge ? 30 : 40 },
                            { x: isLarge ? 120 : 100, y: isLarge ? 90 : 80 },
                            ...(isLarge ? [
                                { x: 200, y: 15 }, { x: 200, y: 45 },
                                { x: 200, y: 75 }, { x: 200, y: 105 }
                            ] : [])
                        ].map((pos, i) => (
                            <motion.circle
                                key={i} cx={pos.x} cy={pos.y} r="3"
                                animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                                className="fill-accent" filter="url(#glow)"
                            />
                        ))}
                    </svg>
                </div>
            );
        case "Smart Role Assignment":
            return (
                <div className={containerClass}>
                    <div className="relative flex items-center justify-center gap-8">
                        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="w-16 h-16 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center relative">
                            <Users className="w-8 h-8 text-primary/80" />
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }} className="absolute -inset-2 border border-dashed border-primary/20 rounded-full" />
                        </motion.div>
                        <div className="flex flex-col gap-4">
                            {[0, 1].map((i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <motion.div initial={{ width: 0 }} animate={{ width: isLarge ? 60 : 40 }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }} className="h-px bg-gradient-to-r from-primary/50 to-accent/50" />
                                    <div className="w-8 h-8 rounded-lg border border-accent/20 bg-accent/5 flex items-center justify-center">
                                        <Zap className="w-4 h-4 text-accent/70" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        case "Sprint Planning":
            return (
                <div className={`${containerClass} p-8 flex flex-col justify-center gap-4`}>
                    {[0.8, 0.6, 0.9, 0.4].map((w, i) => (
                        <div key={i} className="h-3 bg-white/5 rounded-full w-full overflow-hidden border border-white/5">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "0%" }}
                                transition={{ repeat: Infinity, duration: 5, delay: i * 0.8, ease: "circOut" }}
                                className="h-full bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 rounded-full"
                                style={{ width: `${w * 100}%` }}
                            />
                        </div>
                    ))}
                </div>
            );
        case "Multi-Platform Export":
            return (
                <div className={containerClass}>
                    <div className="relative flex items-center justify-center">
                        <svg width={isLarge ? "300" : "150"} height="100" viewBox={`0 0 ${isLarge ? "300" : "150"} 100`}>
                            <motion.circle cx={isLarge ? "150" : "75"} cy="50" r="25" className="fill-primary/5 stroke-primary/20" />
                            <Rocket className="x text-primary" x={isLarge ? "138" : "63"} y="38" width="24" height="24" />
                            {[30, 150, 270, 330, 90, 210].map((angle, i) => (
                                <g key={i}>
                                    <motion.line
                                        x1={isLarge ? "150" : "75"} y1="50"
                                        x2={(isLarge ? 150 : 75) + Math.cos(angle * Math.PI / 180) * (isLarge ? 100 : 50)}
                                        y2={50 + Math.sin(angle * Math.PI / 180) * (isLarge ? 40 : 30)}
                                        stroke="currentColor" strokeWidth="0.5" className="text-white/10"
                                    />
                                    <motion.circle
                                        cx={(isLarge ? 150 : 75) + Math.cos(angle * Math.PI / 180) * (isLarge ? 100 : 50)}
                                        cy={50 + Math.sin(angle * Math.PI / 180) * (isLarge ? 40 : 30)}
                                        r="2" className="fill-accent/40"
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                                    />
                                </g>
                            ))}
                        </svg>
                    </div>
                </div>
            );
        case "Drag-Drop Kanban":
            return (
                <div className={`${containerClass} p-6 flex gap-4`}>
                    {[0, 1, 2].slice(0, isLarge ? 3 : 2).map((col) => (
                        <div key={col} className="flex-1 space-y-3">
                            <div className="h-1.5 w-10 bg-white/10 rounded-full" />
                            {[0, 1].map((card) => (
                                <motion.div
                                    key={card}
                                    whileHover={{ y: -5 }}
                                    className={`h-12 rounded-lg border border-white/10 bg-white/5 p-2 ${col === 1 && card === 0 ? 'border-primary/40 bg-primary/5' : ''}`}
                                >
                                    <div className="h-1 w-full bg-white/10 rounded mb-2" />
                                    <div className="h-1 w-2/3 bg-white/5 rounded" />
                                </motion.div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        case "Enterprise Security":
            return (
                <div className={containerClass}>
                    <div className="relative">
                        <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="w-32 h-32 rounded-full border border-dashed border-white/5 flex items-center justify-center">
                            <motion.div animate={{ rotate: [360, 180, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="w-24 h-24 rounded-full border border-primary/10 border-t-primary/40" />
                        </motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Shield className="w-12 h-12 text-primary/80 drop-shadow-[0_0_15px_rgba(96,255,80,0.3)]" />
                        </div>
                    </div>
                </div>
            );
        case "Advanced Analytics":
            return (
                <div className={`${containerClass} flex flex-col justify-end p-6`}>
                    <div className={`w-full ${isLarge ? 'h-32' : 'h-24'} flex items-end gap-2`}>
                        {[0.4, 0.7, 0.5, 0.9, 0.6, 0.8, 0.3, 0.5].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h * 100}%` }}
                                transition={{ repeat: Infinity, duration: 3, delay: i * 0.1, repeatType: "reverse" }}
                                className="flex-1 bg-gradient-to-t from-primary/10 via-primary/40 to-primary/60 rounded-t-lg group-hover:from-accent/20 group-hover:to-accent/60 transition-all"
                            />
                        ))}
                    </div>
                    {isLarge && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 h-12 w-full border-t border-dashed border-white/10 flex items-center justify-between px-2">
                            <div className="flex gap-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                <div className="w-1.5 h-1.5 rounded-full bg-accent/40" />
                            </div>
                            <div className="text-[10px] text-white/20 font-mono">Real-time stats</div>
                        </motion.div>
                    )}
                </div>
            );
        case "Real-time Collaboration":
            return (
                <div className={containerClass}>
                    <div className="relative">
                        <svg width={isLarge ? "300" : "150"} height="100" viewBox={`0 0 ${isLarge ? "300" : "150"} 100`}>
                            <motion.circle
                                cx={isLarge ? "150" : "75"} cy="50" r="30"
                                className="fill-accent/5 stroke-accent/20"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 4 }}
                            />
                            {[0, 72, 144, 216, 288].map((angle, i) => (
                                <motion.circle
                                    key={i}
                                    cx={(isLarge ? 150 : 75) + Math.cos(angle * Math.PI / 180) * 45}
                                    cy={50 + Math.sin(angle * Math.PI / 180) * 45}
                                    r="4"
                                    className="fill-primary"
                                    animate={{
                                        opacity: [0.3, 1, 0.3],
                                        scale: [1, 1.5, 1]
                                    }}
                                    transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                                />
                            ))}
                            <motion.path
                                d={isLarge ? "M 120 50 L 180 50 M 150 20 L 150 80" : "M 60 50 L 90 50 M 75 35 L 75 65"}
                                stroke="currentColor" strokeWidth="1" className="text-primary/20"
                                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                transition={{ repeat: Infinity, duration: 3 }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Users className="w-6 h-6 text-accent/80 animate-pulse" />
                        </div>
                    </div>
                </div>
            );
        default:
            return null;
    }
};

const ActionDemo = () => {
    const [step, setStep] = useState(0);

    const steps = [
        { text: "Building a food delivery app for pets with real-time tracking...", phase: "typing" },
        { phase: "analyzing" },
        { phase: "generating" },
        { phase: "complete" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((s) => (s + 1) % steps.length);
        }, step === 1 ? 2500 : 4000);
        return () => clearInterval(interval);
    }, [step]);

    return (
        <div className="relative h-full w-full p-6 flex flex-col font-sans">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/40 font-mono">
                    ai-engine-v2.0
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center">
                {step === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-4"
                    >
                        <div className="text-xs text-primary/80 font-mono mb-2 uppercase tracking-widest">Input Prompt</div>
                        <div className="text-xl md:text-2xl font-bold text-white bg-white/5 p-4 rounded-xl border border-white/10 min-h-[100px] shadow-2xl">
                            {steps[0].text.split("").map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="inline-block w-1.5 h-6 bg-primary ml-1 translate-y-1"
                            />
                        </div>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center space-y-6"
                    >
                        <div className="relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                            </div>
                        </div>
                        <div className="text-center">
                            <h4 className="text-xl font-bold text-white mb-2">Analyzing Requirements</h4>
                            <div className="flex gap-1 justify-center">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                        className="w-1.5 h-1.5 rounded-full bg-primary"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step >= 2 && (
                    <div className="space-y-4 h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-between mb-2"
                        >
                            <span className="text-sm font-bold text-white uppercase tracking-wider">Generated Board</span>
                            <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20">
                                {step === 3 ? "Complete" : "Generating..."}
                            </Badge>
                        </motion.div>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { title: "User Auth", status: "Done", color: "text-green-400" },
                                { title: "Real-time Maps", status: "In Progress", color: "text-blue-400" },
                                { title: "Pet Profiles", status: "Todo", color: "text-white/40" },
                                { title: "Payment Flow", status: "Todo", color: "text-white/40" }
                            ].map((card, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="bg-white/5 border border-white/10 p-3 rounded-xl hover:border-primary/30 transition-colors"
                                >
                                    <div className="h-1 w-8 bg-white/10 rounded mb-2" />
                                    <h5 className="text-[11px] font-bold text-white mb-1">{card.title}</h5>
                                    <p className={`text-[9px] font-medium ${card.color}`}>{card.status}</p>
                                </motion.div>
                            ))}
                        </div>
                        {step === 3 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <span className="text-xs text-white font-medium">Project Plan Ready</span>
                                </div>
                                <Button size="sm" className="h-7 text-[10px] bg-primary text-black font-bold">Export to Jira</Button>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Landing() {
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const nextTestimonial = () => {
        setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveTestimonial((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
    };

    return (
        <div className="min-h-screen bg-black relative">
            {/* Aurora Background */}
            <div className="absolute top-0 left-0 w-full h-[800px] z-0 opacity-50 pointer-events-none">
                <Aurora
                    colorStops={["#60ff50", "#a64dff", "#2000ff"]}
                    blend={0.5}
                    amplitude={1.0}
                    speed={1}
                />
            </div>

            {/* Existing background fallbacks/overlays can remain or be removed. 
                Let's keep the grid pattern for texture but remove the static orbs to avoid clash. 
            */}

            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage:
                            "linear-gradient(0deg, transparent 24%, rgba(230, 81%, 50%, .05) 25%, rgba(230, 81%, 50%, .05) 26%, transparent 27%, transparent 74%, rgba(230, 81%, 50%, .05) 75%, rgba(230, 81%, 50%, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(230, 81%, 50%, .05) 25%, rgba(230, 81%, 50%, .05) 26%, transparent 27%, transparent 74%, rgba(230, 81%, 50%, .05) 75%, rgba(230, 81%, 50%, .05) 76%, transparent 77%, transparent)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            {/* Hero Section */}
            <section className="relative px-4 py-20 md:py-32 overflow-hidden">
                <div className="container max-w-full max-w-5xl mx-auto">
                    <div className="text-center space-y-8">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 animate-fade-in hover:border-white/20 transition-colors cursor-pointer">
                            <Sparkles className="w-4 h-4 text-[#60ff50] animate-bounce" />
                            <span className="text-sm font-medium text-white/90">
                                Powered by Advanced AI
                            </span>
                        </div>

                        {/* Main title with split animation */}
                        <div className="space-y-4">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                                <span className="block text-white animate-slide-in-up">
                                    Turn Ideas Into
                                </span>
                                <span
                                    className="block bg-gradient-to-r from-[#60ff50] via-[#a64dff] to-[#60ff50] bg-clip-text text-transparent font-black animate-slide-in-up"
                                    style={{ animationDelay: "0.1s" }}
                                >
                                    Structured Plans
                                </span>
                                <span
                                    className="block text-white/80 text-4xl md:text-5xl font-semibold animate-slide-in-up"
                                    style={{ animationDelay: "0.2s" }}
                                >
                                    Instantly
                                </span>
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 leading-relaxed animate-fade-in" style={{ animationDelay: "0.3s" }}>
                            Transform your project vision into a comprehensive breakdown of tasks, timelines, and team roles.
                            Powered by advanced AI, designed for modern product teams.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-[#60ff50] to-[#a64dff] hover:opacity-90 text-black h-12 px-8 font-bold shadow-lg shadow-[#60ff50]/20 hover:shadow-[#60ff50]/40 transition-all"
                            >
                                <Link to="/dashboard" className="inline-flex items-center gap-2">
                                    <Rocket className="w-5 h-5" />
                                    Get Started Free
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                className="bg-white/5 border border-white/20 hover:bg-white/10 text-white h-12 px-8 font-semibold transition-all"
                            >
                                <a href="#features" className="inline-flex items-center gap-2">
                                    Explore Features
                                </a>
                            </Button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-12 animate-fade-in" style={{ animationDelay: "0.5s" }}>
                            {[
                                { num: "10K+", label: "Plans Created" },
                                { num: "500+", label: "Teams Using" },
                                { num: "98%", label: "Satisfaction" },
                            ].map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all hover:border-white/20 group cursor-pointer"
                                    style={{
                                        animation: "slide-in-up 0.6s ease-out",
                                        animationDelay: `${0.6 + idx * 0.1}s`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    <p className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                        {stat.num}
                                    </p>
                                    <p className="text-sm text-white/60 group-hover:text-white/80 transition">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Demo Section */}
            <section className="py-20 md:py-32 px-4 relative">
                <div className="container max-w-full max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fade-in">
                            See It In Action
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            Watch how Decomposr transforms your project idea into a complete plan
                        </p>
                    </div>

                    {/* Demo Preview Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left - Feature Highlights */}
                        <div
                            className="space-y-6"
                            style={{
                                transform: `translateY(${scrollY * 0.05}px)`,
                                transition: "transform 0.3s ease-out",
                            }}
                        >
                            {[
                                {
                                    icon: Brain,
                                    title: "1. Describe Your Project",
                                    desc: "Share your vision in plain language",
                                },
                                {
                                    icon: Sparkles,
                                    title: "2. AI Analyzes",
                                    desc: "Advanced AI processes your requirements",
                                },
                                {
                                    icon: CheckCircle2,
                                    title: "3. Get Structured Plan",
                                    desc: "Complete breakdown with tasks & timeline",
                                },
                                {
                                    icon: Rocket,
                                    title: "4. Start Building",
                                    desc: "Export to your favorite tools instantly",
                                },
                            ].map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={idx}
                                        className="p-6 rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-white/2 backdrop-blur-sm hover:border-primary/50 hover:bg-white/10 transition-all cursor-pointer group"
                                        style={{
                                            animation: "slide-in-up 0.6s ease-out",
                                            animationDelay: `${0.1 + idx * 0.1}s`,
                                            animationFillMode: "both",
                                            transform: `translateY(${scrollY * 0.02}px)`,
                                        }}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-3 rounded-lg bg-gradient-to-br from-primary to-accent text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white mb-1">
                                                    {item.title}
                                                </h3>
                                                <p className="text-white/60 text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Right - Dashboard Preview */}
                        <div
                            className="relative h-[430px] rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-white/5 to-accent/10 backdrop-blur-xl overflow-hidden group hover:border-primary/50 transition-all shadow-2xl shadow-primary/10 lg:mt-8"
                            style={{
                                transform: `translateY(${scrollY * 0.03}px)`,
                                transition: "transform 0.4s ease-out",
                            }}
                        >
                            <ActionDemo />

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bento Grid Section */}
            <section id="features" className="py-20 md:py-32 px-4 relative">
                <div className="container max-w-full max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fade-in">
                            Everything You Need
                        </h2>
                        <p className="text-lg text-white/60 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            A complete suite of tools designed for modern product teams
                        </p>
                    </div>

                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
                        {features.map((feature, idx) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={idx}
                                    className={`${feature.size} group relative rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm p-8 hover:border-white/30 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-primary/20 cursor-pointer`}
                                    style={{
                                        animation: "slide-in-up 0.6s ease-out",
                                        animationDelay: `${0.2 + idx * 0.08}s`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                    <div className="absolute -top-1 -right-1 w-24 h-24 bg-gradient-to-br from-primary/30 to-transparent rounded-full filter blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10">
                                        {feature.title !== "AI Task Decomposition" && (
                                            <FeatureIllustration
                                                type={feature.title}
                                                isLarge={feature.size.includes('col-span-2')}
                                                isTall={feature.size.includes('row-span-2')}
                                            />
                                        )}

                                        <div className={`mb-6 inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text transition-all">
                                            {feature.title}
                                        </h3>

                                        <p className="text-white/60 group-hover:text-white/80 transition-colors leading-relaxed text-sm">
                                            {feature.description}
                                        </p>

                                        <div className="mt-4 inline-flex p-2 rounded-lg bg-white/5 group-hover:bg-gradient-to-r group-hover:from-primary/20 group-hover:to-accent/20 transition-all opacity-0 group-hover:opacity-100">
                                            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                                        </div>

                                        {feature.title === "AI Task Decomposition" && (
                                            <FeatureIllustration
                                                type={feature.title}
                                                isLarge={feature.size.includes('col-span-2')}
                                                isTall={feature.size.includes('row-span-2')}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Social Proof Section */}
            <section className="py-20 md:py-32 px-4 relative">
                <div className="container max-w-full max-w-6xl mx-auto">
                    {/* Trusted By Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fade-in">
                            Trusted by Industry Leaders
                        </h2>
                        <p className="text-lg text-white/60 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            Thousands of teams use Decomposr to ship faster
                        </p>
                    </div>

                    {/* Company Logos */}
                    <div className="mb-16 overflow-hidden">
                        <div className="flex items-center justify-center gap-8 flex-wrap mb-8">
                            {companies.map((company, idx) => (
                                <div
                                    key={idx}
                                    className="px-6 py-3 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                                    style={{
                                        animation: "slide-in-up 0.6s ease-out",
                                        animationDelay: `${0.1 + idx * 0.05}s`,
                                        animationFillMode: "both",
                                    }}
                                >
                                    <p className="font-semibold text-white/80 text-sm">{company}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Testimonials Carousel */}
                    <div className="relative">
                        <div className="max-w-3xl mx-auto">
                            {/* Active Testimonial Card */}
                            <div
                                className="p-8 md:p-12 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-white/5 to-accent/10 backdrop-blur-sm relative overflow-hidden transition-all duration-500"
                                key={activeTestimonial}
                                style={{
                                    animation: "slide-in-up 0.6s ease-out",
                                }}
                            >
                                {/* Decorative Quote Icon */}
                                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/20 opacity-50" />

                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-5 h-5 fill-accent text-accent"
                                        />
                                    ))}
                                </div>

                                {/* Quote Text */}
                                <p className="text-xl md:text-2xl font-semibold text-white mb-6 leading-relaxed">
                                    "{testimonials[activeTestimonial].quote}"
                                </p>

                                {/* Author Info */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-white">
                                            {testimonials[activeTestimonial].name}
                                        </p>
                                        <p className="text-white/60 text-sm">
                                            {testimonials[activeTestimonial].title}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                                        {testimonials[activeTestimonial].avatar}
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-center gap-4 mt-8">
                                <button
                                    onClick={prevTestimonial}
                                    className="p-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white transition-all"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex gap-2 items-center px-4">
                                    {testimonials.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveTestimonial(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${idx === activeTestimonial
                                                ? "bg-primary w-6"
                                                : "bg-white/30 hover:bg-white/50"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={nextTestimonial}
                                    className="p-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white transition-all"
                                >
                                    <ArrowRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Workflow Section */}
            <section className="py-20 md:py-32 px-4 relative">
                <div className="container max-w-full max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-fade-in">
                            Simple Workflow
                        </h2>
                        <p className="text-lg text-white/60 animate-fade-in" style={{ animationDelay: "0.1s" }}>
                            From idea to structured plan in minutes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { num: 1, title: "Describe", desc: "Share your project idea", icon: "✍️" },
                            { num: 2, title: "Generate", desc: "AI creates your plan", icon: "🤖" },
                            { num: 3, title: "Organize", desc: "Review with your team", icon: "👥" },
                            { num: 4, title: "Execute", desc: "Start building today", icon: "🚀" },
                        ].map((step, idx) => (
                            <div
                                key={idx}
                                className="relative group"
                                style={{
                                    animation: "slide-in-up 0.6s ease-out",
                                    animationDelay: `${0.3 + idx * 0.1}s`,
                                    animationFillMode: "both",
                                }}
                            >
                                {idx < 3 && (
                                    <div className="absolute top-6 left-[60%] w-[calc(100%+1rem)] h-0.5 bg-gradient-to-r from-primary to-transparent opacity-30 hidden md:block" />
                                )}

                                <div className="flex flex-col items-center p-6 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm hover:border-primary/50 hover:bg-white/10 transition-all group-hover:shadow-lg group-hover:shadow-primary/20">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform mb-4">
                                        {step.num}
                                    </div>

                                    <h3 className="font-bold text-white mb-1 text-lg">{step.title}</h3>
                                    <p className="text-sm text-white/60 text-center">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-32 px-4 relative">
                <div className="container max-w-full max-w-4xl mx-auto">
                    <div className="relative rounded-2xl border border-primary/50 bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 backdrop-blur-sm p-8 md:p-16 overflow-hidden group hover:border-primary/80 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-accent opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />

                        <div className="relative z-10 text-center space-y-6">
                            <h2 className="text-4xl md:text-5xl font-black text-white">
                                Ready to Transform Your Project Planning?
                            </h2>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto">
                                Join thousands of product teams who are already using Decomposr to decompose complex projects and ship faster.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-primary to-accent hover:from-primary-700 hover:to-accent text-white h-12 px-8 font-semibold shadow-lg shadow-primary/40"
                                >
                                    <Link to="/dashboard" className="inline-flex items-center gap-2">
                                        <Rocket className="w-5 h-5" />
                                        Start Free Today
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-white/10 border border-white/30 hover:bg-white/20 text-white h-12 px-8 font-semibold"
                                >
                                    <a href="#" className="inline-flex items-center gap-2">
                                        View Docs
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Floating elements for visual interest */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-20 h-20 rounded-full border border-primary/20 animate-bounce" style={{ animationDuration: "4s" }} />
                <div
                    className="absolute bottom-20 right-10 w-32 h-32 rounded-full border border-accent/20 animate-bounce"
                    style={{ animationDuration: "5s", animationDelay: "1s" }}
                />
            </div>
        </div >
    );
}
