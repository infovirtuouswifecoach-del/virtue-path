import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { CATEGORIES, filterCategoriesForUser } from "@/lib/categories";
import { supabase } from "@/integrations/supabase/client";
import {
  Heart, Baby, Sparkles, Home, MessageCircle, Handshake,
  Users, Wallet, BookOpen, Activity,
  Gamepad2, Map, Calendar, Video, ShoppingBag, ClipboardList,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/explore")({
  component: ExplorePage,
});

const ICONS: Record<string, LucideIcon> = {
  Heart, Baby, Sparkles, Home, MessageCircle, Handshake,
  Users, Wallet, BookOpen, Activity,
};

const TOOLS = [
  { to: "/assessment", label: "Marriage Alignment", sub: "Find your strongest & weakest shift", Icon: ClipboardList },
  { to: "/soap", label: "SOAP Journal", sub: "Bible study journal", Icon: BookOpen },
  { to: "/games", label: "Games & Challenges", sub: "Trivia · Word Search · Couples", Icon: Gamepad2 },
  { to: "/memories", label: "Memory Map", sub: "Pin your trips & moments", Icon: Map },
  { to: "/calendar", label: "Calendar", sub: "Anniversaries · birthdays · cycle", Icon: Calendar },
  { to: "/videos", label: "Video Library", sub: "Teachings you can watch", Icon: Video },
  { to: "/shop", label: "Shop Virtuous", sub: "Tools, courses & favorites", Icon: ShoppingBag },
] as const;

function ExplorePage() {
  const [maritalStatus, setMaritalStatus] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      const { data: p } = await supabase
        .from("profiles").select("marital_status").eq("user_id", u.user.id).maybeSingle();
      setMaritalStatus(p?.marital_status ?? null);
    })();
  }, []);

  const categories = filterCategoriesForUser(maritalStatus);

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Explore</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">
          Browse by <em className="text-rose">category</em>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Each category carries a Shift from the V.I.R.T.U.E. framework — choose where you want to grow today.
        </p>
      </header>

      <main className="space-y-8 px-6 pt-6">
        {/* Categories grid — matches the user's reference design */}
        <section>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">Topics</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {categories.map((c) => {
              const Icon = ICONS[c.icon] ?? Heart;
              return (
                <Link
                  key={c.slug}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-soft transition active:scale-[0.99]"
                >
                  <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${c.tint}`}>
                    <Icon className={`h-5 w-5 ${c.iconColor}`} strokeWidth={2.1} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[15px] leading-tight">{c.name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="font-display text-xl">Tools</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {TOOLS.map(({ to, label, sub, Icon }) => (
              <Link
                key={to}
                to={to}
                className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition active:scale-[0.99]"
              >
                <Icon className="h-5 w-5 text-rose" />
                <p className="mt-3 font-display text-[15px] leading-tight">{label}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{sub}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Assessment CTA */}
        <Link
          to="/assessment"
          className="block rounded-3xl bg-rose-gradient p-6 text-rose-foreground shadow-bloom"
        >
          <p className="text-[10px] uppercase tracking-[0.2em] opacity-80">Marriage Alignment Center</p>
          <h3 className="mt-1 font-display text-2xl">Discover your strongest &amp; weakest shift</h3>
          <p className="mt-2 text-sm opacity-90">
            A short assessment personalizes your daily journey, challenges, and teachings.
          </p>
          <span className="mt-4 inline-block rounded-full bg-card px-5 py-2 text-sm font-medium text-foreground">
            Take the assessment
          </span>
        </Link>

        <p className="pb-2 text-center text-[11px] text-muted-foreground">
          {categories.length} of {CATEGORIES.length} categories shown — filtered for your season
        </p>
      </main>
    </MobileShell>
  );
}
