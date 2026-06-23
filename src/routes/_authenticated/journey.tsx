import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Flame, Trophy, Heart, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/journey")({
  component: JourneyPage,
});

function JourneyPage() {
  const [stats, setStats] = useState({ streak: 0, dares: 0, gratitudes: 0, soap: 0 });
  const [recent, setRecent] = useState<{ day: string; count: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const uid = u.user.id;

      const [{ data: completions }, { count: dares }, { count: grats }, { count: soaps }] =
        await Promise.all([
          supabase.from("daily_completions").select("day, items").eq("user_id", uid).order("day", { ascending: false }).limit(30),
          supabase.from("dare_completions").select("*", { count: "exact", head: true }).eq("user_id", uid),
          supabase.from("gratitude_entries").select("*", { count: "exact", head: true }).eq("user_id", uid),
          supabase.from("soap_entries").select("*", { count: "exact", head: true }).eq("user_id", uid),
        ]);

      // streak: consecutive days back from today with >=1 item
      let streak = 0;
      const days = (completions ?? []).map((c) => ({
        day: c.day, count: Object.values((c.items as Record<string, boolean>) ?? {}).filter(Boolean).length,
      }));
      const set = new Map(days.map((d) => [d.day, d.count]));
      const cur = new Date();
      while (true) {
        const k = cur.toISOString().slice(0, 10);
        if ((set.get(k) ?? 0) > 0) { streak++; cur.setDate(cur.getDate() - 1); } else break;
      }
      setStats({ streak, dares: dares ?? 0, gratitudes: grats ?? 0, soap: soaps ?? 0 });
      setRecent(days.slice(0, 14).reverse());
    })();
  }, []);

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Your Journey</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">A walk worth remembering</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every day with Him is a milestone. Here is yours so far.
        </p>
      </header>

      <main className="space-y-6 px-6 pt-6">
        <div className="rounded-3xl bg-rose-gradient p-6 text-rose-foreground shadow-bloom">
          <div className="flex items-center gap-3">
            <Flame className="h-6 w-6" />
            <p className="text-xs uppercase tracking-[0.22em] opacity-80">Current Streak</p>
          </div>
          <p className="mt-2 font-display text-6xl">{stats.streak}</p>
          <p className="mt-1 text-sm opacity-90">consecutive day{stats.streak === 1 ? "" : "s"} of intentional growth</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat Icon={Heart} label="Dares" value={stats.dares} />
          <Stat Icon={BookOpen} label="SOAP" value={stats.soap} />
          <Stat Icon={Trophy} label="Gratitudes" value={stats.gratitudes} />
        </div>

        <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg">Last 14 days</h2>
          <div className="mt-4 flex items-end gap-1.5">
            {Array.from({ length: 14 }).map((_, i) => {
              const r = recent[i];
              const h = r ? Math.min(r.count, 4) * 18 + 8 : 6;
              return (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`w-full rounded-md ${r && r.count > 0 ? "bg-rose" : "bg-border"}`}
                    style={{ height: `${h}px` }}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
          <h2 className="font-display text-lg">Milestones</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <Milestone met={stats.streak >= 3} label="Three-day streak" />
            <Milestone met={stats.streak >= 7} label="One week of intentional growth" />
            <Milestone met={stats.dares >= 1} label="Your first Love & Respect Dare" />
            <Milestone met={stats.soap >= 5} label="Five SOAP studies completed" />
            <Milestone met={stats.gratitudes >= 7} label="A week of gratitude" />
          </ul>
        </section>
      </main>
    </MobileShell>
  );
}

function Stat({ Icon, label, value }: { Icon: any; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 text-center shadow-soft">
      <Icon className="mx-auto h-4 w-4 text-rose" />
      <p className="mt-1 font-display text-2xl">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Milestone({ met, label }: { met: boolean; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className={`grid h-6 w-6 place-items-center rounded-full text-[11px] ${
        met ? "bg-rose text-rose-foreground" : "border border-border text-muted-foreground"
      }`}>
        {met ? "✓" : "·"}
      </span>
      <span className={met ? "text-foreground" : "text-muted-foreground"}>{label}</span>
    </li>
  );
}
