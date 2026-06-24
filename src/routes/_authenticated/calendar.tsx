import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/calendar")({
  component: CalendarPage,
});

type Event = {
  id: string;
  title: string;
  event_type: string;
  event_date: string;
  recurring: string | null;
  notes: string | null;
};

const TYPES = [
  { v: "anniversary", label: "Anniversary", emoji: "💞" },
  { v: "birthday", label: "Birthday", emoji: "🎂" },
  { v: "cycle", label: "Cycle", emoji: "🌙" },
  { v: "kid", label: "Kids", emoji: "👶" },
  { v: "appointment", label: "Appointment", emoji: "📅" },
  { v: "custom", label: "Custom", emoji: "✨" },
];

function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: "", event_type: "custom", event_date: "", recurring: "yearly", notes: "",
  });

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase
      .from("calendar_events").select("*")
      .eq("user_id", u.user.id).order("event_date");
    if (data) setEvents(data as Event[]);
  }

  async function save() {
    if (!form.title || !form.event_date) { toast.error("Title and date required"); return; }
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("calendar_events").insert({ ...form, user_id: u.user.id });
    setForm({ title: "", event_type: "custom", event_date: "", recurring: "yearly", notes: "" });
    setAdding(false);
    load();
  }

  async function remove(id: string) {
    await supabase.from("calendar_events").delete().eq("id", id);
    load();
  }

  const grouped = events.reduce<Record<string, Event[]>>((acc, e) => {
    const month = new Date(e.event_date).toLocaleDateString(undefined, { month: "long" });
    (acc[month] ||= []).push(e);
    return acc;
  }, {});

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Explore
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">Calendar</h1>
        <p className="mt-2 text-sm text-muted-foreground">Anniversaries, birthdays, cycle, important dates.</p>
      </header>

      <main className="space-y-5 px-6 pt-6 pb-8">
        <button onClick={() => setAdding((a) => !a)} className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3 text-sm font-medium text-rose-foreground shadow-bloom">
          <Plus className="h-4 w-4" /> {adding ? "Close" : "Add event"}
        </button>

        {adding && (
          <section className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
            <div className="grid grid-cols-3 gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.v}
                  onClick={() => setForm({ ...form, event_type: t.v })}
                  className={`rounded-xl border px-2 py-2 text-xs ${form.event_type === t.v ? "border-rose bg-rose/10" : "border-border bg-background"}`}
                >
                  <span className="block text-base">{t.emoji}</span>{t.label}
                </button>
              ))}
            </div>
            <input
              placeholder="Title" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose"
            />
            <input
              type="date" value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose"
            />
            <select value={form.recurring ?? ""} onChange={(e) => setForm({ ...form, recurring: e.target.value })} className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm">
              <option value="">Doesn't repeat</option>
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
            <textarea
              rows={2} placeholder="Notes (optional)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-rose"
            />
            <button onClick={save} className="w-full rounded-full bg-rose py-3 text-sm font-medium text-rose-foreground">
              Save event
            </button>
          </section>
        )}

        {Object.keys(grouped).length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No events yet. Add your wedding anniversary first.
          </p>
        ) : (
          Object.entries(grouped).map(([month, items]) => (
            <section key={month}>
              <h2 className="font-display text-lg">{month}</h2>
              <ul className="mt-2 space-y-2">
                {items.map((e) => {
                  const t = TYPES.find((x) => x.v === e.event_type);
                  return (
                    <li key={e.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-soft">
                      <span className="text-xl">{t?.emoji ?? "📅"}</span>
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-base">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(e.event_date).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                          {e.recurring && ` · repeats ${e.recurring}`}
                        </p>
                      </div>
                      <button onClick={() => remove(e.id)} className="text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </main>
    </MobileShell>
  );
}
