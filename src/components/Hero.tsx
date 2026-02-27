import { motion } from "framer-motion";
import { ArrowRight, Bot, Globe, ShoppingBag, Sparkles, Zap } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Robot3D } from "./Robot3D";
import { GlowCard } from "./GlowCard";

const WHATSAPP_NUMBER = "6281342890650";
const WHATSAPP_MESSAGE = encodeURIComponent("Hi Neurial! I'd like to start a project.");
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
});

const bentoDots = ["A", "B", "C"];

// Removed generic speech bubbles. Using premium SYSTEM ONLINE label instead.

function playRobotSound() {
  try {
    const ctx = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = ctx.currentTime;
    // Beep
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.start(now);
    osc1.stop(now + 0.12);
    // Boop
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(600, now + 0.12);
    osc2.frequency.exponentialRampToValueAtTime(400, now + 0.25);
    gain2.gain.setValueAtTime(0.06, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.25);
    setTimeout(() => ctx.close(), 400);
  } catch {
    // silently ignore
  }
}

export default function Hero() {
  const { playSound } = useSound();
  const [showSystemOnline, setShowSystemOnline] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleRobotClick = () => {
    playRobotSound();
    setIsBouncing(true);
    setShowSystemOnline(true);
    setTimeout(() => setShowSystemOnline(false), 2500);
    setTimeout(() => setIsBouncing(false), 500);
  };

  return (
    <section className="relative pt-32 pb-28 px-6 overflow-hidden">
      {/* Subtle architectural background details */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.03)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center mb-20 lg:mb-28">

          {/* Left — Text */}
          <div className="text-left w-full max-w-2xl lg:pr-10 xl:pr-16">
            <motion.div {...fadeUp(0.05)} className="mb-8">
              <span className="font-display text-[10px] md:text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground inline-flex items-center gap-3">
                <span className="w-6 h-[1px] bg-[#10b981]/50"></span>
                AI Development Studio — Indonesia
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="font-display text-[3.5rem] sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6rem] font-medium leading-[0.95] tracking-[-0.04em] mb-8 text-foreground"
            >
              Intelligence<br />
              <span
                className="italic font-light tracking-[-0.06em] transition-all duration-300 ease-out cursor-default text-muted-foreground/30 hover:text-[#10b981] hover:[text-shadow:0_0_30px_rgba(16,185,129,0.5),0_0_60px_rgba(16,185,129,0.25)]"
              >meets</span> Design.
            </motion.h1>

            <motion.p
              {...fadeUp(0.25)}
              className="font-body text-muted-foreground text-lg sm:text-xl max-w-[440px] mb-12 leading-[1.65] font-light"
            >
              We engineer premium digital products and data-driven systems crafted to accelerate your brand's growth.
            </motion.p>

            <motion.div {...fadeUp(0.4)}>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => playSound("hover")}
                onClick={() => playSound("click")}
                className="group flex w-fit items-center gap-5 font-display text-sm md:text-base font-semibold text-foreground tracking-wide uppercase transition-all duration-300"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-full border border-foreground/10 group-hover:border-[#10b981] group-hover:bg-[#10b981]/5 transition-all duration-300 ease-out">
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:text-[#10b981] transition-all duration-300 ease-out" />
                </div>
                <span className="relative overflow-hidden pb-1">
                  Start Your Project
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#10b981] transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100" />
                </span>
              </a>
            </motion.div>

          </div>

          {/* Right — Interactive Premium Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            role="button"
            tabIndex={0}
            aria-label="Interactive robot mascot — click to activate"
            className="relative w-full h-[400px] sm:h-[500px] lg:h-[580px] flex items-center justify-center cursor-pointer select-none rounded-3xl overflow-hidden group"
            onClick={handleRobotClick}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRobotClick(); } }}
          >
            {/* Clean soft radial gradient background in pale pastel */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(241,245,249,1)_0%,rgba(248,250,252,0)_70%)] z-0" />

            {/* Futuristic Glassmorphism System Label */}
            {showSystemOnline && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="absolute top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
              >
                <div className="bg-background/40 backdrop-blur-xl border border-[#10b981]/30 shadow-[0_0_20px_rgba(16,185,129,0.15)] px-5 py-2.5 rounded-full flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1.5 h-1.5 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                  />
                  <span className="font-display font-semibold text-xs tracking-[0.15em] text-foreground/90 uppercase">
                    System Online
                  </span>
                </div>
              </motion.div>
            )}

            <div className="absolute inset-0 z-10 pointer-events-none" />

            <Canvas camera={{ position: [0, 0, 6.5], fov: 50 }} className="w-full h-full z-20" style={{ background: 'transparent' }}>
              <ambientLight intensity={0.6} />
              <Robot3D isBouncing={isBouncing} />
            </Canvas>

            {/* Hint */}
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 font-body text-[10px] text-muted-foreground/40 tracking-wider uppercase pointer-events-none px-2 py-1 rounded z-20">
              Move mouse &amp; click me!
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <GlowCard
            glowColor="lavender"
            customSize
            onMouseEnter={() => playSound("hover")}
            className="bg-pastel-lavender p-5 flex flex-col justify-between min-h-[160px] cursor-default hover:scale-[1.02]"
          >
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center"><Bot className="w-4 h-4 text-foreground/70" /></div>
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center"><Globe className="w-4 h-4 text-foreground/70" /></div>
              <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center"><ShoppingBag className="w-4 h-4 text-foreground/70" /></div>
            </div>
            <div>
              <p className="font-display font-bold text-sm">Full-Stack</p>
              <p className="font-body text-xs text-muted-foreground">AI, Web &amp; E-Commerce</p>
            </div>
          </GlowCard>

          <GlowCard
            glowColor="mint"
            customSize
            onMouseEnter={() => playSound("hover")}
            className="bg-pastel-mint p-5 flex flex-col justify-between min-h-[160px] cursor-default hover:scale-[1.02]"
          >
            <Sparkles className="w-5 h-5 text-foreground/40" />
            <div>
              <p className="font-display text-3xl font-extrabold">98%</p>
              <p className="font-body text-xs text-muted-foreground">Client satisfaction rate</p>
            </div>
          </GlowCard>

          <GlowCard
            glowColor="blue"
            customSize
            onMouseEnter={() => playSound("hover")}
            className="bg-pastel-blue p-5 flex flex-col justify-between min-h-[160px] col-span-2 md:col-span-1 cursor-default hover:scale-[1.02]"
          >
            <Zap className="w-5 h-5 text-foreground/40" />
            <div>
              <p className="font-display font-bold text-sm mb-1">Automated Business Solutions</p>
              <p className="font-body text-xs text-muted-foreground leading-relaxed">Smart systems that work 24/7 so you can focus on growth.</p>
            </div>
          </GlowCard>

          <GlowCard
            glowColor="yellow"
            customSize
            onMouseEnter={() => playSound("hover")}
            className="bg-pastel-yellow p-5 flex flex-col justify-between min-h-[160px] cursor-default hover:scale-[1.02]"
          >
            <div className="flex -space-x-2">
              {bentoDots.map((l) => (
                <div key={l} className="w-7 h-7 rounded-full bg-foreground/10 border-2 border-white flex items-center justify-center text-[10px] font-bold text-foreground/50">{l}</div>
              ))}
            </div>
            <div>
              <p className="font-display text-3xl font-extrabold">50+</p>
              <p className="font-body text-xs text-muted-foreground">Projects delivered</p>
            </div>
          </GlowCard>
        </motion.div>
      </div>
    </section>
  );
}
