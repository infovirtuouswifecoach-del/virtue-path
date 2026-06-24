import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { getCategory, getTopic } from "@/lib/categories";
import { SHIFTS } from "@/lib/daily-content";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/topic/$category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.category);
    const topic = getTopic(params.category, params.slug);
    if (!cat || !topic) throw notFound();
    return { cat, topic };
  },
  component: TopicPage,
  notFoundComponent: () => (
    <MobileShell>
      <div className="px-6 pt-16 text-center">
        <h1 className="font-display text-2xl">Topic not found</h1>
        <Link to="/explore" className="mt-4 inline-block text-rose">Back to Explore</Link>
      </div>
    </MobileShell>
  ),
});

function TopicPage() {
  const { cat, topic } = Route.useLoaderData();
  const shift = SHIFTS.find((s) => s.key === topic.shift)!;
  const completionKey = `topic_${cat.slug}_${topic.slug}`;
  const today = new Date().toISOString().slice(0, 10);
  const [done, setDone] = useState(false);
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data } = await supabase
        .from("daily_completions")
        .select("items")
        .eq("user_id", u.user.id).eq("day", today).maybeSingle();
      const items = (data?.items ?? {}) as Record<string, boolean>;
      setDone(!!items[completionKey]);
    })();
  }, [completionKey, today]);

  async function markDone() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase
      .from("daily_completions").select("items")
      .eq("user_id", u.user.id).eq("day", today).maybeSingle();
    const items = { ...((data?.items ?? {}) as Record<string, boolean>), [completionKey]: true };
    await supabase.from("daily_completions").upsert(
      { user_id: u.user.id, day: today, items }, { onConflict: "user_id,day" },
    );
    setDone(true);
    if (reflection.trim()) {
      await supabase.from("prayer_entries").insert({
        user_id: u.user.id,
        title: `Reflection: ${topic.title}`,
        body: reflection,
      });
    }
    toast.success("Marked complete 💛");
  }

  return (
    <MobileShell>
      <header className={`px-6 pb-6 pt-12 ${cat.tint}`}>
        <Link
          to="/category/$slug" params={{ slug: cat.slug }}
          className="inline-flex items-center text-xs text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4" /> {cat.name}
        </Link>
        <div className="mt-3 flex items-center gap-2">
          <span className="rounded-full bg-rose/20 px-2.5 py-1 text-[10px] uppercase tracking-wider text-rose">
            Shift {shift.key} · {shift.name}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{topic.kind}</span>
        </div>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">{topic.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{topic.summary}</p>
      </header>

      <main className="space-y-5 px-6 pt-6">
        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
          <p className="text-[10px] uppercase tracking-wider text-rose">Scripture anchor</p>
          <p className="mt-2 font-display text-xl">{topic.scripture}</p>
          <a
            href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(topic.scripture)}&version=NIV`}
            target="_blank" rel="noreferrer"
            className="mt-3 inline-block text-xs text-rose"
          >
            Open in BibleGateway →
          </a>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Walk it out</p>
          <ol className="mt-3 space-y-3">
            {topic.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose/15 font-display text-sm text-rose">{i + 1}</span>
                <p className="text-[15px] leading-snug">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
          <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Your reflection (optional)</label>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            rows={4}
            placeholder="What's God showing you?"
            className="mt-2 w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-rose"
          />
          <p className="mt-1 text-[11px] text-muted-foreground">Saved to your prayer journal.</p>
        </section>

        <button
          onClick={markDone}
          disabled={done}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3.5 text-sm font-medium text-rose-foreground shadow-bloom disabled:opacity-60"
        >
          {done ? <><Check className="h-4 w-4" /> Completed today</> : "Mark complete"}
        </button>
      </main>
    </MobileShell>
  );
}
