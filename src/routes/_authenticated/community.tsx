import { createFileRoute } from "@tanstack/react-router";
import { MobileShell } from "@/components/MobileShell";
import { Users, MapPin, MessageCircleHeart, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/community")({
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Community</p>
        <h1 className="mt-2 font-display text-[2rem] leading-tight">You're not walking alone</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pray with sisters, share testimonies, and find women growing alongside you.
        </p>
      </header>

      <main className="space-y-4 px-6 pt-6">
        <Tile Icon={MessageCircleHeart} title="Prayer Warrior Center" sub="Pray for another wife's request today" />
        <Tile Icon={Sparkles} title="Testimony Journal" sub="Share what God is doing in your marriage" />
        <Tile Icon={Users} title="Titus 2 Mentorship" sub="Find a mentor — or become one" />
        <Tile Icon={MapPin} title="Community Map" sub="State-level only · your privacy is sacred" />

        <div className="rounded-3xl border border-dashed border-rose/40 bg-rose/5 p-5 text-center">
          <p className="font-display text-lg">Coming soon</p>
          <p className="mt-1 text-sm text-muted-foreground">
            The community circles, prayer wall, and mentorship matching are being prepared with care.
          </p>
        </div>
      </main>
    </MobileShell>
  );
}

function Tile({ Icon, title, sub }: { Icon: any; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-rose/10 text-rose">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="font-display text-lg leading-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}
