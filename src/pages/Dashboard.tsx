import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut,
  Globe,
  Target,
  DollarSign,
  Users,
  Pencil,
  Check,
  X,
  ExternalLink,
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

  useEffect(() => {
    fetchData();
  }, []);

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
      // Create empty profile if none exists
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-pastel-lavender opacity-30 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-pastel-mint opacity-25 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/70 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-bold font-display">N</span>
            </div>
            <span className="font-display font-bold text-base">Neurial</span>
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Welcome block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-1">Dashboard</p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Hey, {firstName} 👋
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            {user?.email && (
              <span className="text-sm text-muted-foreground font-body">{user.email}</span>
            )}
            {(profile?.website_url || user?.website_url) && (
              <a
                href={profile?.website_url ?? user?.website_url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
              >
                <Globe className="w-3.5 h-3.5" />
                {(profile?.website_url ?? user?.website_url ?? "").replace(/^https?:\/\//, "")}
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </motion.div>

        {/* Section label */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="font-body text-xs tracking-[0.18em] uppercase text-muted-foreground mb-5"
        >
          Your website at a glance
        </motion.p>

        {/* Metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <MetricCard
            index={0}
            icon={<Target className="w-5 h-5" />}
            label="Your Goal"
            sublabel="What are you working towards?"
            colorClass="bg-pastel-lavender"
            value={profile?.goal ?? ""}
            type="text"
            placeholder="e.g. 10k monthly revenue"
            onSave={(v) => handleSaveField("goal", v || null)}
          />
          <MetricCard
            index={1}
            icon={<DollarSign className="w-5 h-5" />}
            label="Monthly Income"
            sublabel="Current revenue per month"
            colorClass="bg-pastel-mint"
            value={profile?.monthly_income !== null && profile?.monthly_income !== undefined ? String(profile.monthly_income) : ""}
            type="number"
            placeholder="e.g. 2500"
            prefix="$"
            onSave={(v) => handleSaveField("monthly_income", v ? parseFloat(v) : null)}
          />
          <MetricCard
            index={2}
            icon={<Users className="w-5 h-5" />}
            label="Active Clients"
            sublabel="How many clients do you have?"
            colorClass="bg-pastel-blue"
            value={profile?.client_count !== null && profile?.client_count !== undefined ? String(profile.client_count) : ""}
            type="number"
            placeholder="e.g. 8"
            onSave={(v) => handleSaveField("client_count", v ? parseInt(v) : null)}
          />
        </div>

        {/* Website URL editor */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-pastel-peach flex items-center justify-center shrink-0">
              <Globe className="w-4 h-4 text-foreground/70" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm">Your Website</p>
              <p className="text-xs text-muted-foreground font-body">Update your website URL</p>
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
      </main>
    </div>
  );
}

/* ─── MetricCard ─── */

interface MetricCardProps {
  index: number;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  colorClass: string;
  value: string;
  type: "text" | "number";
  placeholder: string;
  prefix?: string;
  onSave: (value: string) => Promise<void>;
}

function MetricCard({ index, icon, label, sublabel, colorClass, value, type, placeholder, prefix, onSave }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="group rounded-2xl border border-border/60 bg-card/70 backdrop-blur-sm p-6 card-lift"
    >
      <div className={`w-10 h-10 rounded-xl ${colorClass} flex items-center justify-center mb-4`}>
        <span className="text-foreground/70">{icon}</span>
      </div>
      <p className="font-display font-semibold text-sm mb-0.5">{label}</p>
      <p className="text-xs text-muted-foreground font-body mb-4">{sublabel}</p>
      <InlineEdit
        value={value}
        type={type}
        placeholder={placeholder}
        prefix={prefix}
        onSave={onSave}
      />
    </motion.div>
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

  // Keep draft in sync if parent value changes
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
                : <Check className="w-3.5 h-3.5" />
              }
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
            <span className={`font-body ${large ? "text-sm" : "text-sm"} ${initialValue ? "text-foreground" : "text-muted-foreground/50"}`}>
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
