import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth", search: { mode: "signin" } });
  },
  component: Onboarding,
});

const STATUSES = [
  { v: "single", label: "Single" },
  { v: "engaged", label: "Engaged" },
  { v: "living_together", label: "Living together" },
  { v: "married", label: "Married" },
  { v: "married_separated", label: "Married — living separately" },
  { v: "divorced", label: "Divorced" },
  { v: "widowed", label: "Widowed" },
];

type Child = { name: string; age: number; gender: "girl" | "boy" };

function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    marital_status: "",
    husband_name: "",
    marriage_length_years: 0,
    has_children: null as null | boolean,
    children: [] as Child[],
    going_well: "",
    biggest_struggle: "",
  });

  const isMarried = ["engaged", "living_together", "married", "married_separated"].includes(form.marital_status);
  const isSingle = ["single", "divorced", "widowed"].includes(form.marital_status);

  // Skip husband + length steps when single
  const steps = [
    "name",
    "status",
    ...(isMarried ? ["husband", "length"] : []),
    "children",
    ...(form.has_children ? ["children-details"] : []),
    "going_well",
    "struggle",
  ];

  const current = steps[step];
  const total = steps.length;

  async function finish() {
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("profiles").upsert({
      user_id: u.user.id,
      display_name: form.display_name,
      marital_status: form.marital_status,
      husband_name: isMarried ? form.husband_name : null,
      marriage_length_years: isMarried ? form.marriage_length_years : null,
      children: form.children as unknown as never,
      going_well: form.going_well,
      biggest_struggle: form.biggest_struggle,
      spiritual_season:
        isSingle ? "Single Season"
        : form.marriage_length_years <= 2 ? "Newlywed"
        : "Established",
      onboarded: true,
    });
    if (error) { toast.error(error.message); setSaving(false); return; }
    navigate({ to: "/today", replace: true });
  }

  function next() {
    if (step >= total - 1) return finish();
    setStep(step + 1);
  }
  function back() {
    if (step === 0) return;
    setStep(step - 1);
  }

  const canContinue =
    (current === "name" && !!form.display_name) ||
    (current === "status" && !!form.marital_status) ||
    (current === "husband") ||
    (current === "length") ||
    (current === "children" && form.has_children !== null) ||
    (current === "children-details") ||
    (current === "going_well") ||
    (current === "struggle");

  return (
    <div className="app-shell bg-dawn">
      <div className="flex min-h-dvh flex-col px-7 pt-14">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition ${i <= step ? "bg-rose" : "bg-border"}`} />
          ))}
        </div>

        <div className="flex-1 pt-10">
          {current === "name" && (
            <Step title="What should we call you?" sub="The name you'd love to be greeted with each morning.">
              <input
                autoFocus value={form.display_name}
                onChange={(e) => setForm({ ...form, display_name: e.target.value })}
                placeholder="Sarah"
                className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-lg outline-none focus:border-rose"
              />
            </Step>
          )}

          {current === "status" && (
            <Step title="Where are you today?" sub="So your daily journey fits your real life.">
              <div className="flex flex-col gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s.v}
                    onClick={() => setForm({ ...form, marital_status: s.v })}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-[15px] transition ${
                      form.marital_status === s.v
                        ? "border-rose bg-rose/10"
                        : "border-border bg-card"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {current === "husband" && (
            <Step title="What's his first name?" sub="So prayers and dares feel personal.">
              <input
                autoFocus value={form.husband_name}
                onChange={(e) => setForm({ ...form, husband_name: e.target.value })}
                placeholder="Optional"
                className="w-full rounded-2xl border border-input bg-card px-4 py-3 text-lg outline-none focus:border-rose"
              />
            </Step>
          )}

          {current === "length" && (
            <Step title="How long together?" sub="Years married (or engaged/together).">
              <NumberStepper value={form.marriage_length_years} onChange={(v) => setForm({ ...form, marriage_length_years: v })} min={0} max={70} suffix="years" />
            </Step>
          )}

          {current === "children" && (
            <Step title="Do you have children?" sub="We'll personalize prayers and tools for motherhood.">
              <div className="grid grid-cols-2 gap-3">
                {[true, false].map((v) => (
                  <button
                    key={String(v)}
                    onClick={() => setForm({ ...form, has_children: v, children: v ? form.children : [] })}
                    className={`rounded-2xl border py-4 text-[15px] transition ${
                      form.has_children === v ? "border-rose bg-rose/10" : "border-border bg-card"
                    }`}
                  >
                    {v ? "Yes" : "Not yet"}
                  </button>
                ))}
              </div>
            </Step>
          )}

          {current === "children-details" && (
            <Step title="Tell us about them" sub="A name, age, and whether boy or girl.">
              <div className="space-y-3">
                {form.children.map((c, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-3">
                    <input
                      value={c.name}
                      placeholder="Name"
                      onChange={(e) => updateChild(i, { name: e.target.value })}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <select
                        value={c.gender}
                        onChange={(e) => updateChild(i, { gender: e.target.value as "girl" | "boy" })}
                        className="rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="girl">Girl</option>
                        <option value="boy">Boy</option>
                      </select>
                      <input
                        type="number" min={0} max={50} value={c.age}
                        onChange={(e) => updateChild(i, { age: Number(e.target.value) })}
                        className="w-20 rounded-xl border border-input bg-background px-3 py-2 text-sm"
                      />
                      <span className="text-xs text-muted-foreground">years old</span>
                      <button onClick={() => removeChild(i)} className="ml-auto text-xs text-rose">Remove</button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setForm({ ...form, children: [...form.children, { name: "", age: 0, gender: "girl" }] })}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-rose/50 py-3 text-sm text-rose"
                >
                  <Plus className="h-4 w-4" /> Add a child
                </button>
              </div>
            </Step>
          )}

          {current === "going_well" && (
            <Step
              title={isSingle ? "What's going well in this season?" : "What's going well in your marriage?"}
              sub="A short, honest answer."
            >
              <textarea
                autoFocus value={form.going_well}
                onChange={(e) => setForm({ ...form, going_well: e.target.value })}
                rows={4}
                placeholder="One or two sentences…"
                className="w-full resize-none rounded-2xl border border-input bg-card px-4 py-3 text-[15px] outline-none focus:border-rose"
              />
            </Step>
          )}

          {current === "struggle" && (
            <Step
              title={isSingle ? "What's the biggest struggle right now?" : "What's the biggest struggle in marriage right now?"}
              sub="So your guidance can meet you where you are."
            >
              <textarea
                autoFocus value={form.biggest_struggle}
                onChange={(e) => setForm({ ...form, biggest_struggle: e.target.value })}
                rows={4}
                placeholder="It's safe to be honest here…"
                className="w-full resize-none rounded-2xl border border-input bg-card px-4 py-3 text-[15px] outline-none focus:border-rose"
              />
            </Step>
          )}
        </div>

        <div className="flex gap-3 pb-10">
          {step > 0 && (
            <button onClick={back} className="flex items-center justify-center rounded-full border border-border bg-card px-5 py-3.5 text-sm font-medium">
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          <button
            disabled={!canContinue || saving}
            onClick={next}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-rose-gradient py-3.5 text-[15px] font-medium text-rose-foreground shadow-bloom disabled:opacity-60"
          >
            {step < total - 1 ? "Continue" : saving ? "Beginning…" : "Begin"} <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  function updateChild(i: number, patch: Partial<Child>) {
    const next = [...form.children];
    next[i] = { ...next[i], ...patch };
    setForm({ ...form, children: next });
  }
  function removeChild(i: number) {
    setForm({ ...form, children: form.children.filter((_, idx) => idx !== i) });
  }
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

function NumberStepper({ value, onChange, min, max, suffix }: { value: number; onChange: (v: number) => void; min: number; max: number; suffix: string }) {
  return (
    <div className="flex items-center justify-center gap-6">
      <button onClick={() => onChange(Math.max(min, value - 1))} className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card">
        <Minus className="h-4 w-4" />
      </button>
      <div className="text-center">
        <div className="font-display text-5xl">{value}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{suffix}</div>
      </div>
      <button onClick={() => onChange(Math.min(max, value + 1))} className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card">
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
