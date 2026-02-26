import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, User, Globe, Lock, ArrowRight, Eye, EyeOff, ArrowLeft } from "lucide-react";

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
            data: {
              full_name: fullName,
              website_url: website,
            },
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
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-background px-4">
      {/* Ambient background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-pastel-lavender opacity-50 blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[55vw] h-[55vw] max-w-[650px] max-h-[650px] rounded-full bg-pastel-mint opacity-40 blur-[80px]"
        />
        <motion.div
          animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] max-w-[350px] max-h-[350px] rounded-full bg-pastel-blue opacity-30 blur-[70px]"
        />
      </div>

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Glass card */}
        <div className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl shadow-black/5 overflow-hidden">
          {/* Top gradient stripe */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

          <div className="p-8 sm:p-10">
            {/* Brand mark */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-xl bg-foreground flex items-center justify-center">
                <span className="text-background text-xs font-bold font-display">N</span>
              </div>
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
                      type="email"
                      label="Email address"
                      value={email}
                      onChange={setEmail}
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />
                    <SubmitButton loading={loading} label="Send reset link" />
                  </form>
                  <button
                    type="button"
                    onClick={() => setMode("login")}
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
                      type="email"
                      label="Email address"
                      value={email}
                      onChange={setEmail}
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />
                    <FloatingInput
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      value={password}
                      onChange={setPassword}
                      icon={<Lock className="w-4 h-4" />}
                      required
                      minLength={6}
                      rightAction={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      }
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setMode("forgot")}
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
                      type="button"
                      onClick={() => setMode("signup")}
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
                      type="text"
                      label="Full name"
                      value={fullName}
                      onChange={setFullName}
                      icon={<User className="w-4 h-4" />}
                      required
                    />
                    <FloatingInput
                      type="email"
                      label="Email address"
                      value={email}
                      onChange={setEmail}
                      icon={<Mail className="w-4 h-4" />}
                      required
                    />
                    <FloatingInput
                      type="url"
                      label="Your website (e.g. https://example.com)"
                      value={website}
                      onChange={setWebsite}
                      icon={<Globe className="w-4 h-4" />}
                    />
                    <FloatingInput
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      value={password}
                      onChange={setPassword}
                      icon={<Lock className="w-4 h-4" />}
                      required
                      minLength={6}
                      rightAction={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
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
                      type="button"
                      onClick={() => setMode("login")}
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

        {/* Subtle bottom reflection */}
        <div className="absolute -bottom-px inset-x-8 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </motion.div>
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
        {/* Left icon */}
        {icon && (
          <span className={`pl-4 shrink-0 transition-colors duration-200 ${focused ? "text-foreground/60" : "text-muted-foreground/50"}`}>
            {icon}
          </span>
        )}

        {/* Input + floating label container */}
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

        {/* Right action */}
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
