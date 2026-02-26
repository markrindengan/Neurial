import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Mail, User, Globe, Lock, ArrowRight, Eye, EyeOff,
  ArrowLeft, Check, TrendingUp,
} from "lucide-react";

type Mode = "login" | "signup" | "forgot";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [website, setWebsite] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, website_url: website },
            emailRedirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.", { duration: 6000 });
      }
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Reset link sent — check your inbox!");
      setMode("login");
    } catch (err: unknown) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden">

      {/* ── Left Branding Panel ── */}
      <div
        className="hidden lg:flex w-[42%] flex-col relative overflow-hidden"
        style={{ background: "hsl(0, 0%, 8%)" }}
      >
        {/* Ambient glows */}
        <div
          className="absolute top-[-10%] right-[-10%] w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "rgba(16,185,129,0.08)", filter: "blur(90px)" }}
        />
        <div
          className="absolute bottom-[5%] left-[-8%] w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "rgba(167,139,250,0.07)", filter: "blur(80px)" }}
        />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/neurial-logo.svg" alt="Neurial" className="w-9 h-9" />
            <span className="font-display font-bold text-xl" style={{ color: "hsl(45, 10%, 93%)" }}>
              Neurial
            </span>
          </Link>

          {/* Main content */}
          <div className="flex-1 flex flex-col justify-center max-w-[280px]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2
                className="font-display font-bold leading-[1.15] mb-4"
                style={{ fontSize: "2.2rem", color: "hsl(45, 10%, 93%)" }}
              >
                Build smarter.<br />
                <span style={{ color: "#10b981" }}>Grow faster.</span>
              </h2>
              <p
                className="font-body text-sm mb-8 leading-relaxed"
                style={{ color: "rgba(240,235,225,0.5)" }}
              >
                Indonesia's premier AI-powered web studio. Track your project,
                manage growth, and launch with confidence.
              </p>

              {/* Feature list */}
              <div className="space-y-3">
                {[
                  "AI-powered web development",
                  "Dedicated client dashboard",
                  "Real-time project tracking",
                ].map((feat, i) => (
                  <motion.div
                    key={feat}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.25)",
                      }}
                    >
                      <Check className="w-3 h-3" style={{ color: "#10b981" }} />
                    </div>
                    <span className="font-body text-sm" style={{ color: "rgba(240,235,225,0.65)" }}>
                      {feat}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom stat card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)" }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: "#10b981" }} />
              </div>
              <div>
                <p className="font-display font-semibold text-sm" style={{ color: "hsl(45, 10%, 90%)" }}>
                  Projects Delivered
                </p>
                <p className="font-body text-xs" style={{ color: "rgba(240,235,225,0.35)" }}>
                  Across Indonesia
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between mb-3">
              <p className="font-display font-bold text-3xl" style={{ color: "hsl(45, 10%, 93%)" }}>
                200+
              </p>
              <div
                className="flex items-center gap-1 text-xs font-body"
                style={{ color: "#10b981" }}
              >
                <TrendingUp className="w-3 h-3" />
                +24% this year
              </div>
            </div>

            {/* Mini bar */}
            <div className="flex items-end gap-1 h-8">
              {[0.35, 0.5, 0.42, 0.62, 0.48, 0.68, 0.8, 1].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{
                    height: `${h * 100}%`,
                    background: i === 7 ? "#10b981" : "rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Right Form Panel ── */}
      <div className="flex-1 relative flex flex-col bg-background overflow-auto">

        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] max-w-[420px] max-h-[420px] rounded-full bg-pastel-lavender opacity-40 blur-[90px]"
          />
          <motion.div
            animate={{ x: [0, -15, 0], y: [0, 20, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute bottom-[-10%] left-[-5%] w-[45vw] h-[45vw] max-w-[380px] max-h-[380px] rounded-full bg-pastel-mint opacity-30 blur-[80px]"
          />
        </div>

        {/* Back to home */}
        <div className="relative z-10 p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex-1 relative z-10 flex items-center justify-center px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            {/* Card */}
            <div className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
              {/* Top gradient accent */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#10b981]/40 to-transparent" />

              <div className="p-8 sm:p-10">
                {/* Brand mark */}
                <div className="flex items-center gap-3 mb-8">
                  <img src="/neurial-logo.svg" alt="Neurial" className="w-8 h-8" />
                  <span className="font-display font-bold text-lg">Neurial</span>
                </div>

                <AnimatePresence mode="wait">

                  {/* FORGOT PASSWORD */}
                  {mode === "forgot" && (
                    <motion.div
                      key="forgot"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h1 className="font-display text-2xl font-bold mb-1">Reset password</h1>
                      <p className="text-sm text-muted-foreground mb-7 font-body">
                        Enter your email and we'll send a reset link.
                      </p>
                      <form onSubmit={handleForgot} className="space-y-4">
                        <FloatingInput
                          type="email" label="Email address" value={email}
                          onChange={setEmail} icon={<Mail className="w-4 h-4" />} required
                        />
                        <SubmitButton loading={loading} label="Send reset link" />
                      </form>
                      <button
                        type="button" onClick={() => setMode("login")}
                        className="mt-5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
                      </button>
                    </motion.div>
                  )}

                  {/* LOGIN */}
                  {mode === "login" && (
                    <motion.div
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
                      <p className="text-sm text-muted-foreground mb-7 font-body">
                        Sign in to your Neurial account.
                      </p>
                      <form onSubmit={handleAuth} className="space-y-4">
                        <FloatingInput
                          type="email" label="Email address" value={email}
                          onChange={setEmail} icon={<Mail className="w-4 h-4" />} required
                        />
                        <FloatingInput
                          type={showPassword ? "text" : "password"} label="Password"
                          value={password} onChange={setPassword}
                          icon={<Lock className="w-4 h-4" />} required minLength={6}
                          rightAction={
                            <button
                              type="button" onClick={() => setShowPassword(!showPassword)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                        <div className="flex justify-end">
                          <button
                            type="button" onClick={() => setMode("forgot")}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <SubmitButton loading={loading} label="Sign in" />
                      </form>
                      <p className="mt-6 text-center text-sm text-muted-foreground font-body">
                        Don't have an account?{" "}
                        <button
                          type="button" onClick={() => setMode("signup")}
                          className="text-foreground font-semibold hover:underline"
                        >
                          Sign up
                        </button>
                      </p>
                    </motion.div>
                  )}

                  {/* SIGNUP */}
                  {mode === "signup" && (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
                      <p className="text-sm text-muted-foreground mb-7 font-body">
                        Let's get you set up in a few seconds.
                      </p>
                      <form onSubmit={handleAuth} className="space-y-4">
                        <FloatingInput
                          type="text" label="Full name" value={fullName}
                          onChange={setFullName} icon={<User className="w-4 h-4" />} required
                        />
                        <FloatingInput
                          type="email" label="Email address" value={email}
                          onChange={setEmail} icon={<Mail className="w-4 h-4" />} required
                        />
                        <FloatingInput
                          type="url" label="Your website (optional)" value={website}
                          onChange={setWebsite} icon={<Globe className="w-4 h-4" />}
                        />
                        <FloatingInput
                          type={showPassword ? "text" : "password"} label="Password"
                          value={password} onChange={setPassword}
                          icon={<Lock className="w-4 h-4" />} required minLength={6}
                          rightAction={
                            <button
                              type="button" onClick={() => setShowPassword(!showPassword)}
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          }
                        />
                        <SubmitButton loading={loading} label="Create account" />
                      </form>
                      <p className="mt-6 text-center text-sm text-muted-foreground font-body">
                        Already have an account?{" "}
                        <button
                          type="button" onClick={() => setMode("login")}
                          className="text-foreground font-semibold hover:underline"
                        >
                          Sign in
                        </button>
                      </p>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

            {/* Bottom reflection */}
            <div className="absolute -bottom-px inset-x-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

interface FloatingInputProps {
  type: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  required?: boolean;
  minLength?: number;
  rightAction?: React.ReactNode;
}

function FloatingInput({ type, label, value, onChange, icon, required, minLength, rightAction }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative group">
      <div
        className={`
          relative flex items-center rounded-2xl border bg-background/60 transition-all duration-200
          ${focused
            ? "border-foreground/40 shadow-[0_0_0_3px_hsl(var(--foreground)/0.06)]"
            : "border-border hover:border-foreground/20"
          }
        `}
      >
        {icon && (
          <span className={`pl-4 shrink-0 transition-colors duration-200 ${focused ? "text-foreground/60" : "text-muted-foreground/50"}`}>
            {icon}
          </span>
        )}
        <div className="relative flex-1 h-14">
          <label
            className={`
              absolute left-3 pointer-events-none select-none transition-all duration-200 font-body
              ${lifted
                ? "top-2 text-[10px] text-muted-foreground"
                : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground/70"
              }
            `}
          >
            {label}
          </label>
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            required={required}
            minLength={minLength}
            className="absolute inset-0 w-full bg-transparent pt-5 pb-1 pl-3 pr-3 text-sm font-body text-foreground outline-none"
          />
        </div>
        {rightAction && (
          <span className="pr-4 shrink-0">{rightAction}</span>
        )}
      </div>
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className={`
        w-full h-12 rounded-2xl font-display font-semibold text-sm
        flex items-center justify-center gap-2
        bg-foreground text-background
        transition-opacity duration-200
        ${loading ? "opacity-60 cursor-not-allowed" : "hover:opacity-90"}
      `}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
          {label}…
        </span>
      ) : (
        <>
          {label}
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </motion.button>
  );
}
