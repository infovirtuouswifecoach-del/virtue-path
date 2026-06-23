import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth", search: { mode: "signin" } });
  },
  component: Onboarding,
});

const SEASONS = ["Newlywed", "Young Family", "Established", "Empty Nest", "Single Again", "Engaged"];

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ display_name: "", husband_name: "", spiritual_season: "" });
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("profiles").upsert({
      user_id: u.user.id, ...form, onboarded: true,
    });
    if (error) { toast.error(error.message); setSaving(false); return; }
    navigate({ to: "/today", replace: true });
  }

  return (
    <div className="app-shell bg-dawn">
      <div className="flex min-h-dvh flex-col px-7 pt-14">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-rose" : "bg-border"}`} />
          ))}
        </div>

        <div className="flex-1 pt-10">
          {step === 0 && (
            <Step title="What should we call you?" sub="The name you'd love to be greeted with each morning.">
              <input
                autoFocus value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                placeholder="Sarah"
                className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-lg outline-none focus:border-rose"
              />
            </Step>
          )}
          {step === 1 && (
            <Step title="Your husband's first name?" sub="So your prayers and dares feel personal.">
              <input
                autoFocus value={form.husband_name}
                onChange={(e) => setForm({ ...form, husband_name: e.target.value })}
                placeholder="Optional"
                className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-lg outline-none focus:border-rose"
              />
            </Step>
          )}
          {step === 2 && (
            <Step title="Where are you in your journey?" sub="Choose the season that fits today.">
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm({ ...form, spiritual_season: s })}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      form.spiritual_season === s
                        ? "bg-rose text-rose-foreground"
                        : "border border-border bg-card"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Step>
          )}
        </div>

        <div className="pb-10">
          <button
            disabled={(step === 0 && !form.display_name) || saving}
            onClick={() => (step < 2 ? setStep(step + 1) : finish())}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3.5 text-[15px] font-medium text-rose-foreground shadow-bloom disabled:opacity-60"
          >
            {step < 2 ? "Continue" : saving ? "Beginning…" : "Begin"} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-[2rem] leading-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
      <div className="mt-8">{children}</div>
    </div>
  );
}
