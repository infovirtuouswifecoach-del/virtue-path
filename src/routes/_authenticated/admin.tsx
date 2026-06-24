import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/activity";
import { ChevronLeft, Users, Activity, TrendingUp, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
});

type UserRow = { user_id: string; display_name: string | null; marital_status: string | null; onboarded: boolean; created_at: string };
type ActivityRow = { id: string; user_id: string; event_type: string; event_path: string | null; created_at: string };

function AdminPage() {
  const navigate = useNavigate();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalActions: 0, today: 0 });

  useEffect(() => {
    (async () => {
      const ok = await isAdmin();
      setAllowed(ok);
      if (!ok) return;
      const { data: u } = await supabase.from("profiles").select("user_id, display_name, marital_status, onboarded, created_at").order("created_at", { ascending: false });
      const { data: a } = await supabase.from("activity_log").select("id, user_id, event_type, event_path, created_at").order("created_at", { ascending: false }).limit(100);
      const today = new Date().toISOString().slice(0, 10);
      const { count: todayCount } = await supabase.from("activity_log").select("*", { count: "exact", head: true }).gte("created_at", today);
      const { count: totalActions } = await supabase.from("activity_log").select("*", { count: "exact", head: true });
      setUsers((u ?? []) as UserRow[]);
      setActivity((a ?? []) as ActivityRow[]);
      setStats({ totalUsers: u?.length ?? 0, totalActions: totalActions ?? 0, today: todayCount ?? 0 });
    })();
  }, []);

  if (allowed === null) {
    return <MobileShell><div className="px-6 pt-16 text-center text-sm text-muted-foreground">Checking access…</div></MobileShell>;
  }
  if (!allowed) {
    return (
      <MobileShell>
        <div className="px-6 pt-16 text-center">
          <ShieldCheck className="mx-auto h-10 w-10 text-rose" />
          <h1 className="mt-3 font-display text-2xl">Admin only</h1>
          <p className="mt-2 text-sm text-muted-foreground">This page is reserved for administrators.</p>
          <button onClick={() => navigate({ to: "/today" })} className="mt-6 rounded-full bg-rose px-6 py-2.5 text-sm font-medium text-rose-foreground">Back to Today</button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/profile" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Profile
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">Admin Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">Everything happening across your app.</p>
      </header>

      <main className="space-y-5 px-6 pt-6 pb-8">
        <section className="grid grid-cols-3 gap-2">
          <Stat Icon={Users} label="Users" value={stats.totalUsers.toString()} />
          <Stat Icon={Activity} label="Actions" value={stats.totalActions.toString()} />
          <Stat Icon={TrendingUp} label="Today" value={stats.today.toString()} />
        </section>

        <section>
          <h2 className="font-display text-xl">Users</h2>
          <div className="mt-2 space-y-2">
            {users.map((u) => (
              <div key={u.user_id} className="rounded-2xl border border-border/60 bg-card p-3 shadow-soft">
                <p className="font-display text-base">{u.display_name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">
                  {u.marital_status ?? "no status"} · {u.onboarded ? "onboarded" : "pending"} · joined {new Date(u.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-xl">Recent Activity</h2>
          <div className="mt-2 space-y-1.5">
            {activity.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
            {activity.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-xs shadow-soft">
                <div className="min-w-0">
                  <p className="font-medium">{a.event_type}</p>
                  <p className="truncate text-muted-foreground">{a.event_path ?? "—"}</p>
                </div>
                <p className="shrink-0 text-muted-foreground">{new Date(a.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </MobileShell>
  );
}

function Stat({ Icon, label, value }: { Icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 text-center shadow-soft">
      <Icon className="mx-auto h-4 w-4 text-rose" />
      <p className="mt-1 font-display text-2xl">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
