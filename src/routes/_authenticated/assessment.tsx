import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { SHIFTS, type ShiftKey } from "@/lib/daily-content";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/assessment")({
  component: AssessmentPage,
});

const QUESTIONS: { shift: ShiftKey; text: string }[] = [
  { shift: "V", text: "I have a clear vision for my life and marriage that I can articulate." },
  { shift: "V", text: "I regularly imagine the woman God is calling me to become." },
  { shift: "V", text: "I have written down or prayed over my family's mission." },

  { shift: "I", text: "I spend time with God daily — not just when I feel like it." },
  { shift: "I", text: "I feel emotionally close to the people I love." },
  { shift: "I", text: "I make space for connection without distraction." },

  { shift: "R", text: "I quickly forgive when I am hurt." },
  { shift: "R", text: "I have surrendered past wounds to God." },
  { shift: "R", text: "I notice patterns of bitterness and bring them to Him." },

  { shift: "T", text: "When I feel a strong emotion, I check it against scripture before acting." },
  { shift: "T", text: "I can recognize lies I tend to believe about myself." },
  { shift: "T", text: "I renew my mind regularly." },

  { shift: "U", text: "I serve others without keeping score." },
  { shift: "U", text: "I speak life — even when I am tired or annoyed." },
  { shift: "U", text: "My home feels like a place of welcome." },

  { shift: "E", text: "I am equipped to pray confidently for myself and others." },
  { shift: "E", text: "I am in community where I am known and growing." },
  { shift: "E", text: "I sense God using me to encourage other women." },
];

function AssessmentPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(QUESTIONS.length).fill(0));
  const [result, setResult] = useState<{ scores: Record<ShiftKey, number>; weakest: ShiftKey; strongest: ShiftKey } | null>(null);

  function setAnswer(v: number) {
    const next = [...answers];
    next[step] = v;
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
    else finish(next);
  }

  async function finish(final: number[]) {
    const totals: Record<ShiftKey, { sum: number; count: number }> = {
      V: { sum: 0, count: 0 }, I: { sum: 0, count: 0 }, R: { sum: 0, count: 0 },
      T: { sum: 0, count: 0 }, U: { sum: 0, count: 0 }, E: { sum: 0, count: 0 },
    };
    QUESTIONS.forEach((q, i) => {
      totals[q.shift].sum += final[i];
      totals[q.shift].count += 1;
    });
    const scores = {} as Record<ShiftKey, number>;
    (Object.keys(totals) as ShiftKey[]).forEach((k) => {
      scores[k] = Math.round((totals[k].sum / (totals[k].count * 5)) * 100);
    });
    const sorted = (Object.entries(scores) as [ShiftKey, number][]).sort((a, b) => a[1] - b[1]);
    const weakest = sorted[0][0];
    const strongest = sorted[sorted.length - 1][0];
    setResult({ scores, weakest, strongest });

    const { data: u } = await supabase.auth.getUser();
    if (u.user) {
      await supabase.from("assessment_responses").insert({
        user_id: u.user.id,
        scores: scores as unknown as never,
        weakest_pillar: weakest,
        strongest_pillar: strongest,
      });
      toast.success("Assessment saved");
    }
  }

  if (result) {
    return (
      <MobileShell>
        <header className="bg-dawn px-6 pb-6 pt-12">
          <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
            <ChevronLeft className="h-4 w-4" /> Explore
          </Link>
          <h1 className="mt-3 font-display text-[2rem] leading-tight">Your Shift Map</h1>
          <p className="mt-2 text-sm text-muted-foreground">Where God might be inviting you next.</p>
        </header>
        <main className="space-y-5 px-6 pt-6 pb-8">
          <section className="space-y-3">
            {SHIFTS.map((s) => {
              const v = result.scores[s.key as ShiftKey];
              const isMin = s.key === result.weakest;
              const isMax = s.key === result.strongest;
              return (
                <div key={s.key} className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Shift {s.key}</p>
                      <p className="font-display text-base">{s.name}</p>
                    </div>
                    <p className={`font-display text-2xl ${isMin ? "text-rose" : isMax ? "text-sage" : ""}`}>{v}%</p>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full bg-rose-gradient" style={{ width: `${v}%` }} />
                  </div>
                  {isMin && <p className="mt-2 text-xs text-rose">Start here — your biggest growth opportunity.</p>}
                  {isMax && <p className="mt-2 text-xs text-sage">A strength — keep cultivating.</p>}
                </div>
              );
            })}
          </section>
          <Link to="/explore" className="block rounded-full bg-rose-gradient py-3.5 text-center text-sm font-medium text-rose-foreground shadow-bloom">
            Begin where you're weakest
          </Link>
        </main>
      </MobileShell>
    );
  }

  const q = QUESTIONS[step];
  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Cancel
        </Link>
        <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
          Question {step + 1} of {QUESTIONS.length}
        </p>
        <div className="mt-2 flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-rose" : "bg-border"}`} />
          ))}
        </div>
      </header>
      <main className="px-6 pt-8 pb-8">
        <h2 className="font-display text-[1.6rem] leading-snug">{q.text}</h2>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-rose">Shift {q.shift} · {SHIFTS.find(s => s.key === q.shift)!.name}</p>
        <div className="mt-8 space-y-2">
          {[
            { v: 1, label: "Never" }, { v: 2, label: "Rarely" }, { v: 3, label: "Sometimes" },
            { v: 4, label: "Often" }, { v: 5, label: "Always" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setAnswer(o.v)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3.5 text-left text-[15px]"
            >
              <span>{o.label}</span>
              <ChevronRight className="h-4 w-4 text-rose" />
            </button>
          ))}
        </div>
        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="mt-6 flex w-full items-center justify-center gap-1 text-xs text-muted-foreground">
            <ChevronLeft className="h-3 w-3" /> Previous
          </button>
        )}
      </main>
    </MobileShell>
  );
}
