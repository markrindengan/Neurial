import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useCard3D } from "@/hooks/useCard3D";
import {
  LogOut, Globe, Target, DollarSign, Users, Pencil, Check, X,
  ExternalLink, TrendingUp, ArrowUpRight, Rocket,
} from "lucide-react";

type WebsiteProfile = {
  user_id: string;
  website_url: string | null;
  goal: string | null;
  monthly_income: number | null;
  client_count: number | null;
};

type UserMeta = {
  full_name: string | null;
  email: string | null;
  website_url: string | null;
};

export default function Dashboard() {
  const [user, setUser] = useState<UserMeta | null>(null);
  const [profile, setProfile] = useState<WebsiteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) { navigate("/auth"); return; }

    setUser({
      full_name: authUser.user_metadata?.full_name ?? null,
      email: authUser.email ?? null,
      website_url: authUser.user_metadata?.website_url ?? null,
    });

    const { data, error } = await supabase
      .from("website_profiles")
      .select("*")
      .eq("user_id", authUser.id)
      .maybeSingle();

    if (error) {
      toast.error("Failed to load profile data.");
    } else if (data) {
      setProfile(data);
    } else {
      const { data: created } = await supabase
        .from("website_profiles")
        .insert({ user_id: authUser.id, website_url: authUser.user_metadata?.website_url ?? null })
        .select()
        .single();
      if (created) setProfile(created);
    }
    setLoading(false);
  };

  const handleSaveField = useCallback(async (field: keyof WebsiteProfile, value: string | number | null) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return;
    const { error } = await supabase
      .from("website_profiles")
      .update({ [field]: value })
      .eq("user_id", authUser.id);
    if (error) {
      toast.error("Failed to save. Please try again.");
    } else {
      setProfile((prev) => prev ? { ...prev, [field]: value } : prev);
      toast.success("Saved!");
    }
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const card3D = useCard3D(8);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-body">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  const firstName = user?.full_name?.split(" ")[0] ?? "there";
  const income = profile?.monthly_income ?? 0;
  const clients = profile?.client_count ?? 0;
  const websiteDisplay = (profile?.website_url ?? user?.website_url ?? "").replace(/^https?:\/\//, "");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-pastel-lavender opacity-25 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-pastel-mint opacity-20 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/70 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/neurial-logo.svg" alt="Neurial" className="w-8 h-8" />
            <span className="font-display font-bold text-base">Neurial</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Dashboard</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">Hey, {firstName}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground font-body">
            {user?.email && <span>{user.email}</span>}
            {websiteDisplay && (
              <>
                <span className="text-border">·</span>
                <a
                  href={profile?.website_url ?? user?.website_url ?? "#"}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors duration-200"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {websiteDisplay}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>
        </motion.div>

        {/* ── Main card grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Card 1 — Dark Studio Stats (row-span-2 on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:row-span-2"
          >
          <div
            {...card3D}
            className="h-full rounded-2xl p-6 flex flex-col relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(18,18,18,0.96) 0%, rgba(10,10,10,0.92) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div className="card-glare" />
            {/* Card header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="font-body text-xs mb-0.5" style={{ color: "rgba(240,235,225,0.4)" }}>
                  Updated just now
                </p>
                <h3 className="font-display font-bold text-base" style={{ color: "hsl(45, 10%, 92%)" }}>
                  Studio Stats
                </h3>
              </div>
              <span
                className="text-xs font-body rounded-full px-2.5 py-1"
                style={{
                  color: "rgba(240,235,225,0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                Monthly
              </span>
            </div>

            {/* Bar chart */}
            <div className="mb-2">
              <p className="text-[11px] font-body mb-3" style={{ color: "rgba(240,235,225,0.35)" }}>
                Revenue trend
              </p>
              <MiniBarChart income={income} />
              <div className="flex justify-between mt-1.5">
                {["Aug", "Sep", "Oct", "Nov", "Dec", "Now"].map((m) => (
                  <span key={m} className="text-[10px] font-body" style={{ color: "rgba(255,255,255,0.2)" }}>
                    {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

            {/* Main stat */}
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-body text-xs" style={{ color: "rgba(240,235,225,0.4)" }}>
                  Active Clients
                </span>
                <span
                  className="flex items-center gap-0.5 font-body text-xs"
                  style={{ color: "#10b981" }}
                >
                  <ArrowUpRight className="w-3 h-3" />
                  Growing
                </span>
              </div>
              <p className="font-display font-bold text-5xl" style={{ color: "hsl(45, 10%, 92%)" }}>
                {clients > 0 ? clients : "—"}
              </p>
            </div>

            {/* Income row */}
            <div
              className="mt-4 rounded-xl px-4 py-3 flex items-center justify-between"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <div>
                <p className="font-body text-[11px]" style={{ color: "rgba(240,235,225,0.35)" }}>
                  Monthly income
                </p>
                <p className="font-display font-bold text-lg" style={{ color: "hsl(45, 10%, 90%)" }}>
                  {income > 0 ? `$${income.toLocaleString()}` : "—"}
                </p>
              </div>
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.15)" }}
              >
                <TrendingUp className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
              </div>
            </div>
          </div>
          </motion.div>

          {/* Card 2 — Recent Activity (col-span-2 on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2"
          >
          <div
            {...card3D}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.64) 100%)",
              border: "1px solid rgba(255,255,255,0.50)",
            }}
          >
            <div className="card-glare" />
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-foreground flex items-center justify-center">
                  <Globe className="w-4 h-4 text-background" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-sm">Latest Project</h3>
                  <p className="text-xs text-muted-foreground font-body">Your active website</p>
                </div>
              </div>
              {/* Avatar stack */}
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-pastel-lavender border-2 border-card flex items-center justify-center">
                  <span className="text-[10px] font-bold text-foreground/70">{firstName[0]?.toUpperCase()}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-pastel-mint border-2 border-card flex items-center justify-center">
                  <span className="text-[10px] font-bold text-foreground/70">N</span>
                </div>
              </div>
            </div>

            {/* Website row */}
            <div className="rounded-xl bg-secondary/60 border border-border/40 px-4 py-3 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <span className="text-sm font-body text-foreground/80 truncate">
                  {websiteDisplay || "No website set yet"}
                </span>
              </div>
              {websiteDisplay && (
                <a
                  href={profile?.website_url ?? user?.website_url ?? "#"}
                  target="_blank" rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors duration-200 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Goal preview */}
            <div className="rounded-xl bg-pastel-lavender/30 border border-border/30 px-4 py-3 flex items-center gap-3">
              <Target className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-sm font-body text-foreground/70 truncate">
                {profile?.goal || "Set your goal below"}
              </span>
            </div>
          </div>
          </motion.div>

          {/* Card 3 — Monthly Revenue Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
          <div
            {...card3D}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.64) 100%)",
              border: "1px solid rgba(255,255,255,0.50)",
            }}
          >
            <div className="card-glare" />
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display font-semibold text-sm">Monthly Revenue</h3>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors duration-200">
                  <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                <button className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors duration-200">
                  <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 18l6-6-6-6" /></svg>
                </button>
              </div>
            </div>

            {/* Gauge */}
            <div className="relative py-3">
              <RevenueGauge income={income} />
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs font-body text-muted-foreground mt-1">
              <div className="flex items-center gap-1.5 text-[#10b981]">
                <TrendingUp className="w-3.5 h-3.5" />
                <span className="font-semibold">
                  {income > 0 ? `$${income.toLocaleString()}` : "Set income"}
                </span>
              </div>
              <span>
                {income > 0
                  ? `${Math.round(Math.min((income / 10000) * 100, 100))}% of goal`
                  : "Edit below"}
              </span>
            </div>
          </div>
          </motion.div>

          {/* Card 4 — Growth Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.23, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
          <div
            {...card3D}
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              background: "linear-gradient(135deg, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.64) 100%)",
              border: "1px solid rgba(255,255,255,0.50)",
            }}
          >
            <div className="card-glare" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-pastel-mint flex items-center justify-center">
                <Rocket className="w-4 h-4 text-foreground/70" />
              </div>
              <h3 className="font-display font-semibold text-sm">Growth Roadmap</h3>
            </div>

            {/* Timeline */}
            <div className="relative pl-5 space-y-3 mb-5">
              <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-border" />
              {[
                { label: "Discovery", desc: "Define your AI strategy", done: true },
                { label: "Design", desc: "UX/UI & brand identity", done: true },
                { label: "Development", desc: "AI-powered web build", done: false },
                { label: "Launch", desc: "Deploy & go live", done: false },
              ].map((step, i) => (
                <div key={i} className="relative flex items-start gap-3">
                  <div
                    className={`absolute left-[-14px] top-[3px] w-[10px] h-[10px] rounded-full border-2 ${
                      step.done ? "bg-foreground border-foreground" : "bg-background border-border"
                    }`}
                  />
                  <div>
                    <p className={`font-display font-semibold text-xs ${step.done ? "text-foreground" : "text-muted-foreground"}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-body">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-metric cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-pastel-mint p-3">
                <p className="text-xs text-muted-foreground font-body mb-1">Monthly</p>
                <p className="font-display font-bold text-lg">
                  {income > 0 ? `$${income.toLocaleString()}` : "—"}
                </p>
                <div className="flex items-center gap-0.5 text-[#10b981] text-[11px] font-body mt-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  Revenue
                </div>
              </div>
              <div className="rounded-xl bg-pastel-lavender p-3">
                <p className="text-xs text-muted-foreground font-body mb-1">Clients</p>
                <p className="font-display font-bold text-lg">
                  {clients > 0 ? clients : "—"}
                </p>
                <div className="mt-1 w-full">
                  <svg viewBox="0 0 80 24" className="w-full h-5">
                    <polyline
                      points="0,20 15,14 30,16 45,8 60,12 80,4"
                      fill="none"
                      stroke="hsl(var(--foreground)/0.25)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="80" cy="4" r="2.5" fill="#a78bfa" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          </motion.div>

        </div>

        {/* ── Editor row ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

          {/* Goal editor */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-pastel-yellow flex items-center justify-center shrink-0">
                <Target className="w-3.5 h-3.5 text-foreground/70" />
              </div>
              <div>
                <p className="font-display font-semibold text-xs">Your Goal</p>
                <p className="text-[11px] text-muted-foreground font-body">What are you working towards?</p>
              </div>
            </div>
            <InlineEdit
              value={profile?.goal ?? ""}
              type="text"
              placeholder="e.g. 10k monthly revenue"
              onSave={(v) => handleSaveField("goal", v || null)}
            />
          </motion.div>

          {/* Metrics editors */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.37, duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pastel-mint flex items-center justify-center shrink-0">
                <DollarSign className="w-3.5 h-3.5 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-xs mb-1.5">Monthly Income</p>
                <InlineEdit
                  value={profile?.monthly_income != null ? String(profile.monthly_income) : ""}
                  type="number"
                  placeholder="e.g. 2500"
                  prefix="$"
                  onSave={(v) => handleSaveField("monthly_income", v ? parseFloat(v) : null)}
                />
              </div>
            </div>
            <div className="border-t border-border/40" />
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-pastel-blue flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5 text-foreground/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-xs mb-1.5">Active Clients</p>
                <InlineEdit
                  value={profile?.client_count != null ? String(profile.client_count) : ""}
                  type="number"
                  placeholder="e.g. 8"
                  onSave={(v) => handleSaveField("client_count", v ? parseInt(v) : null)}
                />
              </div>
            </div>
          </motion.div>

          {/* Website URL editor */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.4 }}
            className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-pastel-peach flex items-center justify-center shrink-0">
                <Globe className="w-3.5 h-3.5 text-foreground/70" />
              </div>
              <div>
                <p className="font-display font-semibold text-xs">Your Website</p>
                <p className="text-[11px] text-muted-foreground font-body">Update your website URL</p>
              </div>
            </div>
            <InlineEdit
              value={profile?.website_url ?? ""}
              type="url"
              placeholder="https://yourwebsite.com"
              onSave={(v) => handleSaveField("website_url", v || null)}
              large
            />
          </motion.div>

        </div>
      </main>
    </div>
  );
}

/* ─── MiniBarChart ─── */

function MiniBarChart({ income }: { income: number }) {
  const maxRef = Math.max(income, 4000);
  const currentH = income > 0 ? Math.min(income / maxRef, 1) : 0.65;

  const bars: { top: number; bot: number }[] = [
    { top: 0.50, bot: 0.30 },
    { top: 0.35, bot: 0.40 },
    { top: 0.65, bot: 0.25 },
    { top: 0.45, bot: 0.35 },
    { top: 0.55, bot: 0.28 },
    { top: currentH * 0.62, bot: currentH * 0.32 },
  ];

  return (
    <div className="flex items-end gap-1.5" style={{ height: "80px" }}>
      {bars.map((bar, i) => {
        const isActive = i === bars.length - 1;
        return (
          <div key={i} className="flex-1 flex flex-col justify-end gap-[2px]" style={{ height: "80px" }}>
            <div
              className="rounded-t-sm w-full"
              style={{
                height: `${bar.top * 80}px`,
                background: isActive ? "#10b981" : "rgba(255,255,255,0.18)",
              }}
            />
            <div
              className="rounded-b-sm w-full"
              style={{
                height: `${bar.bot * 80}px`,
                background: isActive ? "rgba(16,185,129,0.38)" : "rgba(167,139,250,0.28)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

/* ─── RevenueGauge ─── */

function RevenueGauge({ income }: { income: number }) {
  const pct = income > 0 ? Math.min(income / 10000, 1) : 0;
  const arcLen = 188.5; // π * 60 ≈ circumference of half-circle r=60
  const dashFill = pct * arcLen;

  // Needle position: angle goes from 180° (left, 0%) to 0° (right, 100%)
  const angleRad = (180 - pct * 180) * (Math.PI / 180);
  const nx = 80 + 52 * Math.cos(angleRad);
  const ny = 80 - 52 * Math.sin(angleRad);

  return (
    <div className="relative max-w-[180px] mx-auto">
      <svg viewBox="0 0 160 95" className="w-full">
        {/* Track (hatched effect) */}
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray="4 5"
          opacity="0.5"
        />
        {/* Filled arc */}
        <path
          d="M 20 80 A 60 60 0 0 1 140 80"
          fill="none"
          stroke="#10b981"
          strokeWidth="11"
          strokeLinecap="round"
          strokeDasharray={`${dashFill} ${arcLen}`}
        />
        {/* Needle dot */}
        <circle cx={nx} cy={ny} r="5.5" fill="#a78bfa" stroke="hsl(var(--card))" strokeWidth="2" />
      </svg>
      <div className="absolute bottom-1 inset-x-0 text-center">
        <p className="font-display font-bold text-2xl">
          {income > 0 ? `$${income.toLocaleString()}` : "—"}
        </p>
      </div>
    </div>
  );
}

/* ─── InlineEdit ─── */

interface InlineEditProps {
  value: string;
  type: "text" | "number" | "url";
  placeholder: string;
  prefix?: string;
  onSave: (value: string) => Promise<void>;
  large?: boolean;
}

function InlineEdit({ value: initialValue, type, placeholder, prefix, onSave, large }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(initialValue);
  }, [initialValue, editing]);

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(initialValue);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && type !== "text") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {editing ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1 flex items-center rounded-xl border border-foreground/30 bg-background/60 focus-within:border-foreground/50 focus-within:shadow-[0_0_0_3px_hsl(var(--foreground)/0.06)] transition-all duration-200">
              {prefix && (
                <span className="pl-3 text-sm text-muted-foreground font-body shrink-0">{prefix}</span>
              )}
              <input
                autoFocus
                type={type}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`flex-1 bg-transparent outline-none font-body text-foreground placeholder:text-muted-foreground/50 ${large ? "text-sm py-2.5 px-3" : "text-sm py-2 px-3"} ${prefix ? "pl-1" : ""}`}
              />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-8 h-8 rounded-xl bg-foreground text-background flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
            >
              {saving
                ? <span className="w-3 h-3 border border-background/40 border-t-background rounded-full animate-spin" />
                : <Check className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => { setDraft(initialValue); setEditing(true); }}
            className={`w-full flex items-center justify-between gap-2 group/btn rounded-xl px-3 ${large ? "py-2.5" : "py-2"} border border-transparent hover:border-border hover:bg-secondary/50 transition-all duration-200 text-left`}
          >
            <span className={`font-body text-sm ${initialValue ? "text-foreground" : "text-muted-foreground/50"}`}>
              {initialValue
                ? (prefix ? `${prefix}${initialValue}` : initialValue)
                : placeholder}
            </span>
            <Pencil className="w-3.5 h-3.5 text-muted-foreground/40 group-hover/btn:text-muted-foreground transition-colors shrink-0" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
