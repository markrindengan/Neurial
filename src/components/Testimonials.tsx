import React from "react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";

const testimonials = [
    {
        text: "Neurial transformed our online presence completely. Our e-commerce sales increased 3x within the first quarter.",
        image: "https://i.pravatar.cc/150?u=andi",
        name: "Andi Wijaya",
        role: "CEO, TokoBaru",
    },
    {
        text: "The AI automation handles customer inquiries 24/7. It's like having an extra team member that never sleeps.",
        image: "https://i.pravatar.cc/150?u=sarah",
        name: "Sarah Chen",
        role: "Founder, EduNesia",
    },
    {
        text: "Fast delivery, beautiful design, and the WhatsApp integration drives real conversations every day.",
        image: "https://i.pravatar.cc/150?u=budi",
        name: "Budi Santoso",
        role: "Marketing Director, PT Maju Bersama",
    },
    {
        text: "Working with the team was a breeze. They understood our needs perfectly and delivered ahead of schedule.",
        image: "https://i.pravatar.cc/150?u=lina",
        name: "Lina Putri",
        role: "Product Manager, TechIndo",
    },
    {
        text: "The results speak for themselves. Our conversion rates are up 40% since the redesign.",
        image: "https://i.pravatar.cc/150?u=danny",
        name: "Danny Lim",
        role: "Operation Head, GoMart",
    },
    {
        text: "Highly recommended for any business looking to modernize their tech stack and scale quickly.",
        image: "https://i.pravatar.cc/150?u=maya",
        name: "Maya Sari",
        role: "Founder, Maya Beauty",
    },
];

const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials;
    duration?: number;
    reverse?: boolean;
}) => {
    const { playSound } = useSound();

    return (
        <div className={`${props.className} overflow-hidden max-h-[600px] relative`}>
            <motion.div
                animate={{
                    translateY: props.reverse ? ["-50%", "0%"] : ["0%", "-50%"],
                }}
                transition={{
                    duration: props.duration || 15,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {[...new Array(2)].map((_, index) => (
                    <React.Fragment key={index}>
                        {props.testimonials.map(({ text, image, name, role }, i) => (
                            <motion.div
                                key={i}
                                aria-hidden={index === 1 ? true : undefined}
                                whileHover={{ scale: 1.02 }}
                                onMouseEnter={() => playSound('pop')}
                                className="p-8 rounded-[2rem] bg-card border border-border/50 shadow-sm shadow-black/5 hover:border-primary/20 transition-all duration-300 w-full"
                            >
                                <p className="font-body text-sm text-foreground/80 leading-relaxed mb-6 italic">
                                    "{text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={image}
                                        alt={name}
                                        loading="lazy"
                                        className="h-10 w-10 rounded-full border border-border/50 object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-display font-bold text-xs tracking-tight">
                                            {name}
                                        </span>
                                        <span className="font-body text-[11px] text-muted-foreground">
                                            {role}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
};

export default function Testimonials() {
    return (
        <section id="testimonials" className="py-24 px-6 overflow-hidden bg-secondary/30 relative">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-3">
                        Social Proof
                    </p>
                    <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Trusted by Indonesia's Fastest <br /> Growing Businesses
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 masked-list">
                    <TestimonialsColumn
                        testimonials={testimonials.slice(0, 2)}
                        duration={12}
                    />
                    <TestimonialsColumn
                        testimonials={testimonials.slice(2, 4)}
                        duration={18}
                        reverse
                        className="hidden md:block"
                    />
                    <TestimonialsColumn
                        testimonials={testimonials.slice(4, 6)}
                        duration={15}
                        className="hidden md:block"
                    />
                </div>
            </div>

        </section>
    );
}
