import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { GlowCard } from "./GlowCard";

const stats = [
  {
    value: "3x",
    label: "Average revenue increase",
    bg: "bg-pastel-mint",
    glow: "mint" as const,
  },
  {
    value: "24/7",
    label: "Support availability",
    bg: "bg-pastel-blue",
    glow: "blue" as const,
  },
  {
    value: "50+",
    label: "Projects delivered",
    bg: "bg-pastel-lavender",
    glow: "lavender" as const,
  },
  {
    value: "98%",
    label: "Client satisfaction",
    bg: "bg-pastel-yellow",
    glow: "yellow" as const,
  },
];

export default function About() {
  const { playSound } = useSound();

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Why Choose Us
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-5 leading-tight">
              Unleash the power of AI to turn your ideas into solutions
            </h2>
            <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">
              We combine cutting-edge technology with deep understanding of the
              Indonesian market. Every project is built for speed, simplicity,
              and real business results.
            </p>
            <ul className="space-y-3 font-body text-sm">
              {[
                "Free initial consultation and project scoping",
                "Transparent pricing — no hidden fees",
                "Dedicated support team via WhatsApp",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                  <span className="text-foreground/70">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right — Stat cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {stats.map((stat) => (
              <GlowCard
                key={stat.label}
                glowColor={stat.glow}
                customSize
                onMouseEnter={() => playSound('hover')}
                className={`${stat.bg} p-5 flex flex-col justify-between min-h-[120px] transition-all duration-300 hover:scale-105`}
              >
                <p className="font-display text-2xl sm:text-3xl font-extrabold">
                  {stat.value}
                </p>
                <p className="font-body text-xs text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </GlowCard>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
