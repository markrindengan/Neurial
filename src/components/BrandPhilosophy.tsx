import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { MagnetizeButton } from "./ui/magnetize-button";

const WHATSAPP_NUMBER = "6281234567890";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Neurial! I'd like to discuss a project.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function BrandPhilosophy() {
    const { playSound } = useSound();
    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    {/* Logo Mark Display */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="md:col-span-5 flex justify-center md:justify-end"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-[2rem] blur-2xl group-hover:bg-emerald-500/30 transition-colors duration-500" />
                            <img
                                src="/neurial-mark.png"
                                alt="Neurial Logo Mark"
                                className="w-48 h-48 md:w-64 md:h-64 object-contain relative z-10 drop-shadow-2xl"
                            />
                        </div>
                    </motion.div>

                    {/* Philosophy Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="md:col-span-7 flex flex-col items-start"
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Brand Philosophy
                        </div>

                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 leading-tight !bg-clip-text !text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
                            The Soul of Neurial
                        </h2>

                        <div className="space-y-4 text-muted-foreground font-body leading-relaxed text-sm md:text-base max-w-2xl">
                            <p>
                                The Neurial logo is designed to represent <span className="text-emerald-400 font-medium">intelligence, connection, and simplicity</span>.
                                The soft triangular shape with rounded edges symbolizes a <span className="text-foreground">neural network or a flowing system</span>,
                                reflecting how we build smart, connected digital solutions.
                            </p>

                            <p>
                                The smooth gradient from <span className="text-emerald-300">mint to blue</span> represents growth, innovation, and modern technology,
                                while the <span className="text-emerald-400 font-medium italic">small glowing dot</span> suggests a spark of intelligence or an idea coming to life.
                            </p>

                            <p>
                                The clean, minimal typography keeps the brand feeling <span className="text-foreground font-semibold">professional and confident</span>,
                                showing that Neurial is advanced but approachable. Overall, the logo balances technology and humanity—smart, modern, and easy to trust.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-8 relative z-50"
                        >
                            <MagnetizeButton
                                idleLabel="Let's Connect"
                                activeLabel="Let's Go!"
                                particleCount={16}
                                onClick={() => {
                                    playSound("click");
                                    window.open(WHATSAPP_LINK, "_blank", "noopener,noreferrer");
                                }}
                                className="h-11 px-8 rounded-xl text-sm font-display font-semibold tracking-wide"
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
