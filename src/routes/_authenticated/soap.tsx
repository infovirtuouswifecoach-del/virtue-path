import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { getDailyVerse } from "@/lib/daily-content";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Save, BookOpen } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/soap")({
  component: SoapPage,
});

function SoapPage() {
  const verse = getDailyVerse();
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    scripture_ref: verse.reference,
    scripture_text: verse.text,
    observation: "",
    application: "",
    prayer: "",
  });
  const [saving, setSaving] = useState(false);
  const [loadedId, setLoadedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("soap_entries")
        .select("id, scripture_ref, scripture_text, observation, application, prayer")
        .eq("user_id", u.user.id).eq("day", today).maybeSingle();
      if (data) {
        setLoadedId(data.id);
        setForm({
          scripture_ref: data.scripture_ref ?? verse.reference,
          scripture_text: data.scripture_text ?? verse.text,
          observation: data.observation ?? "",
          application: data.application ?? "",
          prayer: data.prayer ?? "",
        });
      }
    })();
  }, [today, verse.reference, verse.text]);

  async function save() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setSaving(false); return; }
    const payload = { user_id: u.user.id, day: today, ...form };
    const { error } = loadedId
      ? await supabase.from("soap_entries").update(payload).eq("id", loadedId)
      : await supabase.from("soap_entries").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);

    // mark today's SOAP complete
    const { data: d } = await supabase
      .from("daily_completions").select("items").eq("user_id", u.user.id).eq("day", today).maybeSingle();
    const items = { ...((d?.items ?? {}) as Record<string, boolean>), soap: true };
    await supabase.from("daily_completions").upsert(
      { user_id: u.user.id, day: today, items }, { onConflict: "user_id,day" },
    );
    toast.success("SOAP saved 💛");
  }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/today" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Today
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">SOAP Journal</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Scripture · Observation · Application · Prayer
        </p>
      </header>

      <main className="space-y-4 px-6 pt-6 pb-8">
        <Field
          label="S — Scripture"
          help="Write the verse out by hand on paper, then type the reference here."
        >
          <input
            value={form.scripture_ref}
            onChange={(e) => setForm({ ...form, scripture_ref: e.target.value })}
            placeholder="Reference"
            className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose"
          />
          <textarea
            value={form.scripture_text}
            onChange={(e) => setForm({ ...form, scripture_text: e.target.value })}
            rows={3}
            placeholder="The verse itself…"
            className="mt-2 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-rose"
          />
          <a
            href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(form.scripture_ref)}&version=NIV`}
            target="_blank" rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs text-rose"
          >
            <BookOpen className="h-3.5 w-3.5" /> Open in BibleGateway
          </a>
        </Field>

        <Field label="O — Observation" help="What stands out? What is God saying here?">
          <textarea
            value={form.observation}
            onChange={(e) => setForm({ ...form, observation: e.target.value })}
            rows={4}
            placeholder="Write what you notice…"
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-rose"
          />
        </Field>

        <Field label="A — Application" help="How will this change how I live today?">
          <textarea
            value={form.application}
            onChange={(e) => setForm({ ...form, application: e.target.value })}
            rows={4}
            placeholder="One specific action…"
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-rose"
          />
        </Field>

        <Field label="P — Prayer" help="Speak back to God what this verse stirred.">
          <textarea
            value={form.prayer}
            onChange={(e) => setForm({ ...form, prayer: e.target.value })}
            rows={4}
            placeholder="Father…"
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:border-rose"
          />
        </Field>

        <button
          onClick={save}
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3.5 text-sm font-medium text-rose-foreground shadow-bloom disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save & complete"}
        </button>
      </main>
    </MobileShell>
  );
}

function Field({ label, help, children }: { label: string; help: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
      <p className="font-display text-lg">{label}</p>
      <p className="mb-3 text-xs text-muted-foreground">{help}</p>
      {children}
    </section>
  );
}
