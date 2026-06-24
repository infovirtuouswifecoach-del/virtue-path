import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { getCategory } from "@/lib/categories";
import { SHIFTS } from "@/lib/daily-content";
import { ChevronLeft, ChevronRight, BookOpen, Brain, Target, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { cat };
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <MobileShell>
      <div className="px-6 pt-16 text-center">
        <h1 className="font-display text-2xl">Category not found</h1>
        <Link to="/explore" className="mt-4 inline-block text-rose">Back to Explore</Link>
      </div>
    </MobileShell>
  ),
});

const KIND_ICON = {
  lesson: BookOpen,
  quiz: Brain,
  challenge: Target,
  game: Sparkles,
  journal: MessageSquare,
};

function CategoryPage() {
  const { cat } = Route.useLoaderData();

  return (
    <MobileShell>
      <header className={`px-6 pb-6 pt-12 ${cat.tint}`}>
        <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Explore
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">{cat.name}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{cat.blurb}</p>
        <p className="mt-3 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {cat.topics.length} topics · all guided by the V.I.R.T.U.E. framework
        </p>
      </header>

      <main className="space-y-3 px-6 pt-6">
        {cat.topics.map((t) => {
          const Icon = KIND_ICON[t.kind];
          const shift = SHIFTS.find((s) => s.key === t.shift)!;
          return (
            <Link
              key={t.slug}
              to="/topic/$category/$slug"
              params={{ category: cat.slug, slug: t.slug }}
              className="flex items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-soft transition active:scale-[0.99]"
            >
              <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${cat.tint}`}>
                <Icon className={`h-5 w-5 ${cat.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-rose/15 px-2 py-0.5 text-[9px] uppercase tracking-wider text-rose">
                    Shift {shift.key} · {shift.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.kind}</span>
                </div>
                <p className="mt-1 font-display text-[15px] leading-tight">{t.title}</p>
                <p className="truncate text-[11px] text-muted-foreground">{t.scripture}</p>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-rose" />
            </Link>
          );
        })}
      </main>
    </MobileShell>
  );
}
