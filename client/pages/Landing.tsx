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

const features = [
    {
        icon: Brain,
        title: "AI Task Decomposition",
        description:
            "Intelligently break down complex projects into actionable tasks using advanced LLM technology",
        size: "col-span-1 md:col-span-2 md:row-span-2",
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
];

const testimonials = [
    {
        name: "Sarah Chen",
        title: "Product Manager at TechVenture",
        quote:
            "ArchitectAI cut our project planning time by 70%. What used to take weeks now takes hours.",
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
                            Watch how ArchitectAI transforms your project idea into a complete plan
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
                            className="relative h-96 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-white/5 to-accent/10 backdrop-blur-sm overflow-hidden group hover:border-primary/50 transition-all"
                            style={{
                                transform: `translateY(${-scrollY * 0.05}px)`,
                                transition: "transform 0.3s ease-out",
                            }}
                        >
                            {/* Animated Dashboard Content */}
                            <div className="absolute inset-0 p-6 flex flex-col">
                                {/* Header */}
                                <div className="mb-4">
                                    <div className="h-8 w-32 bg-primary/30 rounded animate-pulse" />
                                </div>

                                {/* Content Grid */}
                                <div className="grid grid-cols-2 gap-3 flex-1">
                                    {[...Array(4)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="rounded-lg bg-white/5 border border-white/10 p-3 animate-pulse"
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        >
                                            <div className="h-3 w-16 bg-accent/30 rounded mb-2" />
                                            <div className="h-2 w-20 bg-primary/20 rounded" />
                                        </div>
                                    ))}
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-accent/20 animate-bounce" />
                                <div className="absolute bottom-4 left-4 w-6 h-6 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: "0.5s" }} />
                            </div>

                            {/* Glow Effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/0 via-transparent to-accent/0 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
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
                            Thousands of teams use ArchitectAI to ship faster
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
                                Join thousands of product teams who are already using ArchitectAI to decompose complex projects and ship faster.
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
