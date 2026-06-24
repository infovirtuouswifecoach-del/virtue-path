import { createFileRoute, Link } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { IRL_GAMES } from "@/lib/games";
import { ChevronLeft, ChevronRight, Gamepad2, Brain, Search, Heart, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/games")({
  component: GamesHub,
});

function GamesHub() {
  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Explore
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">Games &amp; Challenges</h1>
        <p className="mt-2 text-sm text-muted-foreground">Quick, biblical, fun — for you and for your husband.</p>
      </header>

      <main className="space-y-5 px-6 pt-6 pb-8">
        <section className="space-y-3">
          <Tile to="/games/wordsearch" Icon={Search} title="Daily Word Search" sub="From today's verse — a quick warm-up." />
          <Tile to="/games/trivia" Icon={Brain} title="Bible Trivia" sub="15 questions on women, marriage & faith." />
        </section>

        <section>
          <h2 className="font-display text-xl">Couples & Connection Games</h2>
          <p className="text-xs text-muted-foreground">Play in person — full instructions inside.</p>
          <div className="mt-3 space-y-3">
            {IRL_GAMES.map((g) => (
              <Link
                key={g.slug}
                to="/games/couples/$slug" params={{ slug: g.slug }}
                className="block rounded-3xl border border-border/60 bg-card p-4 shadow-soft transition active:scale-[0.99]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider text-rose">{g.type === "couple" ? "With your husband" : "Womanhood"}</p>
                    <p className="font-display text-lg leading-tight">{g.title}</p>
                    <p className="text-xs text-muted-foreground">{g.goal}</p>
                    <p className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {g.time}</span>
                      <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" /> {g.supplies}</span>
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 shrink-0 text-rose" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </MobileShell>
  );
}

function Tile({ to, Icon, title, sub }: { to: string; Icon: React.ComponentType<{ className?: string }>; title: string; sub: string }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose/15">
        <Icon className="h-5 w-5 text-rose" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-base leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      <ChevronRight className="h-5 w-5 text-rose" />
    </Link>
  );
}
