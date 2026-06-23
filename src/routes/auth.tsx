import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional().default("signup"),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  component: AuthPage,
});

function AuthPage() {
  const { mode: initialMode } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/today`,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        toast.success("Welcome! Check your email to confirm.");
        navigate({ to: "/onboarding" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/today" });
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/today",
    });
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/today" });
  }

  return (
    <div className="app-shell bg-dawn">
      <div className="px-7 pb-16 pt-14">
        <Link to="/" className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          ← The Virtuous Wife™
        </Link>
        <h1 className="mt-6 font-display text-4xl">
          {mode === "signup" ? "Begin your journey" : "Welcome back, friend"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {mode === "signup"
            ? "A daily rhythm of scripture, prayer, and growth — designed for you."
            : "He has been waiting to walk with you again today."}
        </p>

        <button
          onClick={handleGoogle}
          disabled={loading}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-border bg-card py-3.5 text-[15px] font-medium shadow-soft transition active:scale-[0.99] disabled:opacity-60"
        >
          <GoogleIcon /> Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or email <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "signup" && (
            <Field
              label="Your name"
              type="text"
              value={displayName}
              onChange={setDisplayName}
              placeholder="Sarah"
            />
          )}
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3.5 text-[15px] font-medium text-rose-foreground shadow-bloom transition active:scale-[0.99] disabled:opacity-70"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Create my account" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="font-medium text-rose underline-offset-4 hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Begin your journey"}
          </button>
        </p>
      </div>
    </div>
  );
}

function Field({
  label, type = "text", value, onChange, placeholder, required, minLength,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean; minLength?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-[15px] outline-none ring-rose/20 transition focus:border-rose focus:ring-4"
      />
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.12-.84 2.07-1.78 2.71v2.26h2.88c1.69-1.55 2.66-3.84 2.66-6.61z"/>
      <path fill="#34A853" d="M9 18c2.4 0 4.42-.8 5.89-2.16l-2.88-2.26c-.8.54-1.82.86-3.01.86-2.31 0-4.27-1.56-4.97-3.66H1.05v2.3A8.997 8.997 0 0 0 9 18z"/>
      <path fill="#FBBC05" d="M4.03 10.78A5.41 5.41 0 0 1 3.74 9c0-.62.11-1.22.29-1.78V4.92H1.05A8.997 8.997 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.07-2.26z"/>
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58C13.42.89 11.4 0 9 0A8.997 8.997 0 0 0 1.05 4.92l2.98 2.3C4.73 5.14 6.69 3.58 9 3.58z"/>
    </svg>
  );
}
