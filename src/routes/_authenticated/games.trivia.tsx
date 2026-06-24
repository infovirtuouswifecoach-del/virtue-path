import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { TRIVIA } from "@/lib/games";
import { ChevronLeft, Check, X, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/games/trivia")({
  component: TriviaPage,
});

function TriviaPage() {
  const questions = useMemo(() => [...TRIVIA].sort(() => Math.random() - 0.5).slice(0, 10), []);
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  if (i >= questions.length) {
    return (
      <MobileShell>
        <header className="bg-dawn px-6 pb-6 pt-12">
          <Link to="/games" className="inline-flex items-center text-xs text-muted-foreground">
            <ChevronLeft className="h-4 w-4" /> Games
          </Link>
          <h1 className="mt-3 font-display text-[2rem]">Trivia Complete</h1>
        </header>
        <main className="px-6 pt-10 pb-8 text-center">
          <p className="font-display text-6xl text-rose">{score} / {questions.length}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {score === questions.length ? "Perfect — you know His Word." : score >= questions.length * 0.7 ? "Strong study, sister." : "Keep digging — His Word is alive."}
          </p>
          <button onClick={() => { setI(0); setScore(0); setPicked(null); }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-6 py-3 text-sm font-medium text-rose-foreground shadow-bloom">
            <RefreshCcw className="h-4 w-4" /> Play again
          </button>
        </main>
      </MobileShell>
    );
  }

  const q = questions[i];

  function pick(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    if (idx === q.answer) setScore((s) => s + 1);
    setTimeout(() => { setPicked(null); setI((x) => x + 1); }, 1200);
  }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/games" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Games
        </Link>
        <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">Question {i + 1} of {questions.length}</p>
        <div className="mt-2 flex gap-1">
          {questions.map((_, k) => (
            <div key={k} className={`h-1 flex-1 rounded-full ${k <= i ? "bg-rose" : "bg-border"}`} />
          ))}
        </div>
      </header>
      <main className="px-6 pt-8 pb-8">
        <h2 className="font-display text-[1.5rem] leading-snug">{q.question}</h2>
        <div className="mt-6 space-y-2">
          {q.options.map((o, idx) => {
            const isPicked = picked === idx;
            const isAnswer = q.answer === idx;
            const reveal = picked !== null;
            return (
              <button
                key={idx}
                onClick={() => pick(idx)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-[15px] transition ${
                  reveal && isAnswer ? "border-sage bg-sage/15" :
                  reveal && isPicked ? "border-rose bg-rose/10" :
                  "border-border bg-card"
                }`}
              >
                <span>{o}</span>
                {reveal && isAnswer && <Check className="h-4 w-4 text-sage" />}
                {reveal && isPicked && !isAnswer && <X className="h-4 w-4 text-rose" />}
              </button>
            );
          })}
        </div>
        {picked !== null && q.scripture && (
          <p className="mt-4 text-center text-xs uppercase tracking-wider text-rose">{q.scripture}</p>
        )}
      </main>
    </MobileShell>
  );
}
