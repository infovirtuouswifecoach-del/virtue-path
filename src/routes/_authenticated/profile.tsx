import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, Save, Heart } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

const SEASONS = ["Newlywed", "Young Family", "Established", "Empty Nest", "Single Again", "Engaged"];

function ProfilePage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    display_name: "", husband_name: "", marriage_date: "", spiritual_season: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setEmail(u.user.email ?? "");
      const { data: p } = await supabase
        .from("profiles")
        .select("display_name, husband_name, marriage_date, spiritual_season")
        .eq("user_id", u.user.id)
        .maybeSingle();
      if (p) setForm({
        display_name: p.display_name ?? "",
        husband_name: p.husband_name ?? "",
        marriage_date: p.marriage_date ?? "",
        spiritual_season: p.spiritual_season ?? "",
      });
    })();
  }, []);

  async function save() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setSaving(false); return; }
    const { error } = await supabase.from("profiles").upsert({
      user_id: u.user.id,
      ...form,
      marriage_date: form.marriage_date || null,
      onboarded: true,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", search: { mode: "signin" }, replace: true });
  }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Your Profile</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">{form.display_name || "Friend"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{email}</p>
      </header>

      <main className="space-y-5 px-6 pt-6">
        <section className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
          <Field label="Your name" value={form.display_name} onChange={(v) => setForm({ ...form, display_name: v })} />
          <Field label="Husband's first name" value={form.husband_name} onChange={(v) => setForm({ ...form, husband_name: v })} />
          <Field label="Marriage date" type="date" value={form.marriage_date} onChange={(v) => setForm({ ...form, marriage_date: v })} />

          <div>
            <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">Spiritual season</span>
            <div className="flex flex-wrap gap-2">
              {SEASONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setForm({ ...form, spiritual_season: s })}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                    form.spiritual_season === s
                      ? "bg-rose text-rose-foreground"
                      : "border border-border bg-secondary text-secondary-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3 text-sm font-medium text-rose-foreground shadow-bloom disabled:opacity-70"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
          <h3 className="font-display text-lg">Anniversary</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-rose" />
            {form.marriage_date
              ? `Married since ${new Date(form.marriage_date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}`
              : "Add your marriage date to see anniversaries celebrated in your journey."}
          </p>
        </section>

        <button
          onClick={signOut}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-medium text-muted-foreground"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="pb-6 pt-2 text-center text-[11px] text-muted-foreground">
          The Virtuous Wife App™ · built with reverence
        </p>
      </main>
    </MobileShell>
  );
}

function Field({
  label, value, onChange, type = "text",
}: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-[15px] outline-none ring-rose/20 transition focus:border-rose focus:ring-4"
      />
    </label>
  );
}
