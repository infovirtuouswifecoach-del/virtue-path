import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { getDailyVerse, getDailyDare, getDailyFunFact } from "@/lib/daily-content";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Heart, Sparkles, MessageCircleHeart, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/today")({
  component: TodayPage,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function TodayPage() {
  const verse = getDailyVerse();
  const dare = getDailyDare();
  const fact = getDailyFunFact();
  const [name, setName] = useState<string>("");
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("user_id", u.user.id)
        .maybeSingle();
      if (p?.display_name) setName(p.display_name.split(" ")[0]);

      const { data: d } = await supabase
        .from("daily_completions")
        .select("items")
        .eq("user_id", u.user.id)
        .eq("day", today)
        .maybeSingle();
      if (d?.items) setCompleted(d.items as Record<string, boolean>);
    })();
  }, [today]);

  async function toggle(key: string) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const next = { ...completed, [key]: !completed[key] };
    setCompleted(next);
    await supabase
      .from("daily_completions")
      .upsert({ user_id: u.user.id, day: today, items: next }, { onConflict: "user_id,day" });
  }

  async function completeDare() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("dare_completions").insert({
      user_id: u.user.id, dare_id: dare.id, dare_title: dare.title,
    });
    toggle("dare");
    toast.success("Dare complete — love in action 💛");
  }

  const dayCount = Object.values(completed).filter(Boolean).length;

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-8 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">
          {greeting()}{name ? `, ${name}` : ""}.
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {dayCount === 0
            ? "Begin with a breath. He is here."
            : `${dayCount} of 4 completed today — well done.`}
        </p>
        <DailyProgress count={dayCount} total={4} />
      </header>

      <main className="space-y-5 px-6 pt-6">
        {/* Daily Revival Verse */}
        <Card accent="rose">
          <PillarLabel>I · Intimacy With God</PillarLabel>
          <h2 className="mt-1 font-display text-xl">Daily Revival Verse</h2>
          <p className="mt-3 font-display text-[1.35rem] leading-snug italic text-foreground">
            "{verse.text}"
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider text-rose">{verse.reference}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{verse.insight}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => toggle("verse")}
              className={chipBtn(completed.verse)}
            >
              {completed.verse ? <Check className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
              {completed.verse ? "Read today" : "Mark as read"}
            </button>
            <a
              href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(verse.reference)}&version=NIV`}
              target="_blank" rel="noreferrer"
              className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium"
            >
              Read full chapter →
            </a>
          </div>
          <p className="mt-3 text-[11px] italic text-muted-foreground">
            Tip: read this in your physical Bible — highlight, underline, and write in the margins.
          </p>
        </Card>

        <ActionLink to="/explore" label="SOAP Bible Study" sub="Scripture · Observation · Application · Prayer" Icon={BookOpen} done={completed.soap} onCheck={() => toggle("soap")} />

        <ActionLink to="/explore" label="Three things you're grateful for" sub="Daily Gratitude Journal" Icon={Sparkles} done={completed.gratitude} onCheck={() => toggle("gratitude")} />

        {/* Dare Card */}
        <Card accent="gold">
          <PillarLabel>I · Intimacy With Husband</PillarLabel>
          <h2 className="mt-1 font-display text-xl">Today's Love & Respect Dare</h2>
          <p className="mt-3 font-display text-lg">{dare.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{dare.body}</p>
          <button
            onClick={completeDare}
            disabled={completed.dare}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-rose-gradient px-5 py-2 text-sm font-medium text-rose-foreground shadow-bloom disabled:opacity-60"
          >
            <Heart className="h-4 w-4" /> {completed.dare ? "Completed" : "I'll do it today"}
          </button>
        </Card>

        {/* Fun Fact */}
        <Card>
          <PillarLabel>Fun Fact</PillarLabel>
          <p className="mt-2 text-sm leading-relaxed">{fact.text}</p>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{fact.verse}</p>
        </Card>

        <Card accent="sage">
          <div className="flex items-start gap-3">
            <MessageCircleHeart className="mt-0.5 h-5 w-5 shrink-0 text-rose" />
            <div>
              <h3 className="font-display text-lg">Need support right now?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Lonely, anxious, overwhelmed, or struggling with conflict? Find a scripture, prayer, and next step.
              </p>
              <Link to="/explore" className="mt-2 inline-flex items-center text-sm font-medium text-rose">
                Real-Life Support Center <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
      </main>
    </MobileShell>
  );
}

function DailyProgress({ count, total }: { count: number; total: number }) {
  return (
    <div className="mt-5 flex gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition ${
            i < count ? "bg-rose" : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function PillarLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] uppercase tracking-[0.22em] text-rose/80">{children}</p>;
}

function Card({
  children, accent,
}: { children: React.ReactNode; accent?: "rose" | "gold" | "sage" }) {
  const ring =
    accent === "rose" ? "ring-rose/15" :
    accent === "gold" ? "ring-gold/15" :
    accent === "sage" ? "ring-sage/15" : "ring-border/40";
  return (
    <section className={`rounded-3xl border border-border/60 bg-card p-6 shadow-soft ring-1 ${ring}`}>
      {children}
    </section>
  );
}

function chipBtn(done?: boolean) {
  return `inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
    done
      ? "bg-rose text-rose-foreground"
      : "border border-border bg-secondary text-secondary-foreground"
  }`;
}

function ActionLink({
  to, label, sub, Icon, done, onCheck,
}: {
  to: string; label: string; sub: string; Icon: any; done?: boolean; onCheck: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <button
        onClick={onCheck}
        aria-label={done ? "Mark incomplete" : "Mark complete"}
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-full transition ${
          done ? "bg-rose text-rose-foreground" : "border border-border bg-secondary text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className="font-display text-base leading-tight">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{sub}</p>
      </div>
      <Link to={to} className="shrink-0 text-rose">
        <ChevronRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
