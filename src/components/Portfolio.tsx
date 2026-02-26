import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { GlowCard } from "./GlowCard";

const projects = [
    {
        title: "TokoBaru Commerce",
        category: "E-Commerce",
        description:
            "Hyper-local online marketplace for artisan goods with real-time delivery tracking.",
        bg: "bg-pastel-peach",
        glow: "orange" as const,
    },
    {
        title: "AutoFlow CRM",
        category: "AI Automation",
        description:
            "AI-powered CRM with automated follow-ups, lead scoring, and WhatsApp integration.",
        bg: "bg-pastel-lavender",
        glow: "purple" as const,
    },
    {
        title: "EduNesia Platform",
        category: "Web Application",
        description:
            "Interactive learning platform connecting students with tutors across Indonesia.",
        bg: "bg-pastel-mint",
        glow: "green" as const,
    },
];

export default function Portfolio() {
    const { playSound } = useSound();

    return (
        <section id="portfolio" className="py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
                        Our Work
                    </p>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold">
                        Featured Projects
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projects.map((project, i) => (
                        <motion.div
                            key={project.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                        >
                            <GlowCard
                                glowColor={project.glow}
                                customSize
                                onMouseEnter={() => playSound('pop')}
                                className="group bg-card overflow-hidden card-lift cursor-default transition-all duration-300"
                            >
                                {/* Color preview area */}
                                <div className={`${project.bg} h-40 relative`}>
                                    <span className="absolute top-3 left-3 text-[11px] font-body font-medium px-2.5 py-1 rounded-full bg-white/60 text-foreground/70">
                                        {project.category}
                                    </span>
                                    <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <ArrowUpRight className="w-3.5 h-3.5 text-foreground/60" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="font-display text-base font-bold mb-1.5">
                                        {project.title}
                                    </h3>
                                    <p className="font-body text-sm text-muted-foreground leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                            </GlowCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
