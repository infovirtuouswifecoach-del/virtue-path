import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { PILLARS } from "@/lib/daily-content";
import { BookOpen, Heart, Sparkles, Mic, Compass, Users } from "lucide-react";

export const Route = createFileRoute("/_authenticated/explore")({
  component: ExplorePage,
});

const QUICK_TOOLS = [
  { name: "SOAP Bible Study", Icon: BookOpen, sub: "Scripture · Observation · Application · Prayer" },
  { name: "Gratitude Journal", Icon: Sparkles, sub: "Three things — every day" },
  { name: "Voice Prayer Journal", Icon: Mic, sub: "Record · transcribe · revisit" },
  { name: "Truth Over Emotion", Icon: Heart, sub: "Take every thought captive" },
  { name: "Marriage Vision Board", Icon: Compass, sub: "Plan the future with God" },
  { name: "Prayer Warrior Center", Icon: Users, sub: "Pray for someone today" },
];

const CATEGORIES = [
  "Wifehood", "Marriage", "Motherhood", "Womanhood", "Home Management",
  "Communication", "Conflict Resolution", "Parenting", "Intimacy",
  "Stewardship", "Biblical Living",
];

function ExplorePage() {
  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Explore</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">
          The <em className="text-rose">V.I.R.T.U.E.</em> Framework
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Six pillars — one transformation. Choose where to grow today.
        </p>
      </header>

      <main className="space-y-8 px-6 pt-6">
        <section className="space-y-3">
          {PILLARS.map((p, i) => (
            <article
              key={p.key}
              className="group flex gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft transition active:scale-[0.99]"
            >
              <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl font-display text-3xl ${
                p.accent === "rose" ? "bg-rose/15 text-rose" :
                p.accent === "gold" ? "bg-gold/20 text-foreground" :
                "bg-sage/20 text-foreground"
              }`}>
                {p.key}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Pillar {i + 1}</p>
                <h2 className="font-display text-xl leading-tight">{p.name}</h2>
                <p className="mt-1 text-sm leading-snug text-muted-foreground">{p.tagline}</p>
                <p className="mt-1.5 text-xs text-muted-foreground/80">{p.description}</p>
              </div>
            </article>
          ))}
        </section>

        <section>
          <h2 className="font-display text-xl">Quick Tools</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {QUICK_TOOLS.map(({ name, Icon, sub }) => (
              <div key={name} className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <Icon className="h-5 w-5 text-rose" />
                <p className="mt-3 font-display text-[15px] leading-tight">{name}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl">Browse by Category</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span key={c} className="rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/80">
                {c}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-rose-gradient p-6 text-rose-foreground shadow-bloom">
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">Marriage Alignment Center</p>
          <h3 className="mt-1 font-display text-2xl">Discover your strongest & weakest pillar</h3>
          <p className="mt-2 text-sm opacity-90">
            A short assessment personalizes your daily journey, challenges, and teachings.
          </p>
          <button className="mt-4 rounded-full bg-card px-5 py-2 text-sm font-medium text-foreground">
            Take the assessment
          </button>
        </section>
      </main>
    </MobileShell>
  );
}
