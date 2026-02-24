import { motion } from "framer-motion";
import { Bot, Globe, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { GlowCard } from "./GlowCard";

const services = [
  {
    icon: Bot,
    title: "AI Automation",
    description:
      "Intelligent chatbots, automated workflows, and AI systems that save time and reduce costs for your business.",
    features: ["Smart Chatbots", "Process Automation", "Data Analytics"],
    bg: "bg-pastel-lavender",
    glow: "lavender" as const,
  },
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Fast, beautiful, mobile-first websites built with modern technology. From landing pages to full web apps.",
    features: ["Responsive Design", "SEO Optimized", "Lightning Fast"],
    bg: "bg-pastel-mint",
    glow: "mint" as const,
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce",
    description:
      "Online stores that convert. Payment integration, inventory management, and beautiful customer experiences.",
    features: ["Payment Gateway", "Inventory System", "Order Tracking"],
    bg: "bg-pastel-blue",
    glow: "blue" as const,
  },
];

export default function Services() {
  const { playSound } = useSound();

  return (
    <section id="services" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
            What We Do
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold">
            Drive Transformative Impact
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <GlowCard
                glowColor={service.glow}
                customSize
                onMouseEnter={() => playSound('pop')}
                className={`group ${service.bg} p-6 card-lift cursor-default transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/50 flex items-center justify-center">
                    <service.icon className="w-5 h-5 text-foreground/70" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-foreground/20 group-hover:text-foreground/50 transition-colors" />
                </div>

                <h3 className="font-display text-lg font-bold mb-2">{service.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {service.features.map((f) => (
                    <span
                      key={f}
                      className="text-[11px] font-body px-2.5 py-1 rounded-full bg-white/50 text-foreground/60"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
