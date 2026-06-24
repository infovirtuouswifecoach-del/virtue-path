import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { getGame } from "@/lib/games";
import { ChevronLeft, Clock, Package, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/games/couples/$slug")({
  loader: ({ params }) => {
    const game = getGame(params.slug);
    if (!game) throw notFound();
    return { game };
  },
  component: GamePage,
  notFoundComponent: () => (
    <MobileShell>
      <div className="px-6 pt-16 text-center">
        <h1 className="font-display text-2xl">Game not found</h1>
        <Link to="/games" className="mt-4 inline-block text-rose">Back to Games</Link>
      </div>
    </MobileShell>
  ),
});

function GamePage() {
  const { game } = Route.useLoaderData();

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/games" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Games
        </Link>
        <p className="mt-3 text-[10px] uppercase tracking-wider text-rose">
          {game.type === "couple" ? "Play together" : "For you"}
        </p>
        <h1 className="mt-1 font-display text-[2rem] leading-tight">{game.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{game.goal}</p>
      </header>

      <main className="space-y-4 px-6 pt-6 pb-8">
        <section className="grid grid-cols-3 gap-2">
          <Pill Icon={Clock} label="Time" value={game.time} />
          <Pill Icon={Package} label="Supplies" value={game.supplies} />
          <Pill Icon={Target} label="Goal" value={game.type === "couple" ? "Connect" : "Reflect"} />
        </section>

        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">How to play</h2>
          <ol className="mt-3 space-y-3">
            {game.steps.map((s: string, i: number) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-rose/15 font-display text-sm text-rose">{i + 1}</span>
                <p className="text-[15px] leading-snug">{s}</p>
              </li>
            ))}
          </ol>
        </section>

        <Link to="/games" className="block rounded-full bg-rose-gradient py-3.5 text-center text-sm font-medium text-rose-foreground shadow-bloom">
          Back to all games
        </Link>
      </main>
    </MobileShell>
  );
}

function Pill({ Icon, label, value }: { Icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 text-center shadow-soft">
      <Icon className="mx-auto h-4 w-4 text-rose" />
      <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="text-[11px] font-medium leading-tight">{value}</p>
    </div>
  );
}
