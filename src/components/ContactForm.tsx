import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useSound } from "@/hooks/useSound";
import { Send, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Tell us a bit more about your project"),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { playSound } = useSound();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const { error } = await supabase.from("contact_submissions").insert([
        {
          name: data.name,
          email: data.email,
          message: data.message,
        },
      ]);
      if (error) throw error;

      setSubmitted(true);
      reset();
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or reach us via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <section id="contact" className="py-20 px-6">
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-12 h-12 rounded-full bg-pastel-mint flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-foreground/60" />
            </div>
            <h3 className="font-display text-xl font-bold mb-2">Message Sent!</h3>
            <p className="font-body text-sm text-muted-foreground mb-4">
              We'll get back to you within 24 hours.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="font-body text-xs text-foreground/50 hover:text-foreground underline transition-colors"
            >
              Send another message
            </button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 px-6 bg-secondary/50">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left — Info */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mb-2">
              Contact
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              Let's build something great together
            </h2>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Tell us about your project and we'll get back to you within 24
              hours. Or reach us directly on WhatsApp for a faster response.
            </p>
            <a
              href="https://wa.me/6281234567890?text=Hi%20Neurial!%20I'd%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-sm text-foreground/60 hover:text-foreground transition-colors"
            >
              <span>💬</span>
              <span className="underline">Chat on WhatsApp</span>
            </a>
          </motion.div>

          {/* Right — Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <Input
                {...register("name")}
                placeholder="Your name"
                className="font-body text-sm rounded-xl border-border bg-card h-11"
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <Input
                {...register("email")}
                type="email"
                placeholder="Email address"
                className="font-body text-sm rounded-xl border-border bg-card h-11"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Textarea
                {...register("message")}
                placeholder="Tell us about your project..."
                rows={4}
                className="font-body text-sm rounded-xl border-border bg-card resize-none"
              />
              {errors.message && (
                <p className="text-xs text-destructive mt-1">{errors.message.message}</p>
              )}
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="btn-press rounded-full font-body font-semibold text-sm px-6 py-5 gap-2 w-full sm:w-auto"
            >
              {isSubmitting ? "Sending…" : "Send Message"}
              <Send className="w-3.5 h-3.5" />
            </Button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
