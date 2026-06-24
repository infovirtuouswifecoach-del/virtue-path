import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { getDailyVerse } from "@/lib/daily-content";
import { getDailyWordSearch } from "@/lib/games";
import { ChevronLeft, Check, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/_authenticated/games/wordsearch")({
  component: WordSearchPage,
});

function WordSearchPage() {
  const verse = getDailyVerse();
  const [seed, setSeed] = useState(0);
  const game = useMemo(() => getDailyWordSearch(), [seed]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [found, setFound] = useState<Set<string>>(new Set());
  const [start, setStart] = useState<{ r: number; c: number } | null>(null);

  function key(r: number, c: number) { return `${r},${c}`; }

  function path(a: { r: number; c: number }, b: { r: number; c: number }): Array<{ r: number; c: number }> {
    const dr = Math.sign(b.r - a.r), dc = Math.sign(b.c - a.c);
    const len = Math.max(Math.abs(b.r - a.r), Math.abs(b.c - a.c)) + 1;
    // only allow straight lines
    if (b.r !== a.r && b.c !== a.c && Math.abs(b.r - a.r) !== Math.abs(b.c - a.c)) return [];
    return Array.from({ length: len }, (_, i) => ({ r: a.r + dr * i, c: a.c + dc * i }));
  }

  function handleTap(r: number, c: number) {
    if (!start) {
      setStart({ r, c });
      setSelected(new Set([key(r, c)]));
      return;
    }
    const p = path(start, { r, c });
    if (p.length === 0) { setStart({ r, c }); setSelected(new Set([key(r, c)])); return; }
    const word = p.map(({ r, c }) => game.grid[r][c]).join("");
    const reverse = word.split("").reverse().join("");
    const hit = game.words.find((w) => w === word || w === reverse);
    if (hit) {
      const next = new Set(found); next.add(hit);
      setFound(next);
    }
    setSelected(new Set());
    setStart(null);
  }

  function reshuffle() { setSeed((s) => s + 1); setFound(new Set()); setSelected(new Set()); setStart(null); }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/games" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Games
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">Word Search</h1>
        <p className="mt-1.5 text-xs text-muted-foreground">From {verse.reference}</p>
        <p className="mt-3 rounded-2xl border border-border/60 bg-card p-3 text-sm leading-snug italic">
          "{verse.text}"
        </p>
      </header>

      <main className="space-y-5 px-6 pt-6 pb-8">
        <div className="rounded-3xl border border-border/60 bg-card p-3 shadow-soft">
          <div className="grid grid-cols-12 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
            {game.grid.map((row, r) =>
              row.map((ch, c) => {
                const k = key(r, c);
                const isSel = selected.has(k);
                return (
                  <button
                    key={k}
                    onClick={() => handleTap(r, c)}
                    className={`aspect-square text-[10px] font-medium uppercase transition ${
                      isSel ? "bg-rose text-rose-foreground" : "bg-card text-foreground"
                    }`}
                  >
                    {ch}
                  </button>
                );
              })
            )}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Tap the first letter, then tap the last letter to mark a word.
          </p>
        </div>

        <section>
          <h2 className="font-display text-lg">Find these words</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {game.words.map((w) => {
              const got = found.has(w);
              return (
                <span key={w} className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${got ? "bg-rose text-rose-foreground line-through" : "border border-border bg-card"}`}>
                  {got && <Check className="h-3 w-3" />} {w}
                </span>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{found.size} of {game.words.length} found</p>
        </section>

        <div className="flex gap-2">
          <button onClick={reshuffle} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm">
            <RefreshCcw className="h-4 w-4" /> New board
          </button>
          <Link to="/soap" className="flex-1 rounded-full bg-rose-gradient py-3 text-center text-sm font-medium text-rose-foreground shadow-bloom">
            Continue to SOAP
          </Link>
        </div>
      </main>
    </MobileShell>
  );
}
