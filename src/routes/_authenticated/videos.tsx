import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, Play, Plus, Trash2 } from "lucide-react";
import { isAdmin } from "@/lib/activity";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/videos")({
  component: VideosPage,
});

type Video = {
  id: string; title: string; description: string | null;
  youtube_url: string; category: string | null; sort_order: number;
};

function extractYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/);
  return m?.[1] ?? null;
}

function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [admin, setAdmin] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", youtube_url: "", category: "" });

  useEffect(() => {
    (async () => {
      setAdmin(await isAdmin());
      load();
    })();
  }, []);

  async function load() {
    const { data } = await supabase.from("videos").select("*").order("sort_order");
    if (data) setVideos(data as Video[]);
  }

  async function save() {
    if (!form.youtube_url || !form.title) { toast.error("Title and URL required"); return; }
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase.from("videos").insert({ ...form, created_by: u.user.id, published: true });
    if (error) return toast.error(error.message);
    setForm({ title: "", description: "", youtube_url: "", category: "" });
    setAdding(false);
    load();
  }
  async function remove(id: string) {
    await supabase.from("videos").delete().eq("id", id);
    load();
  }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Explore
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">Video Library</h1>
        <p className="mt-2 text-sm text-muted-foreground">Teachings & encouragement — straight from The Virtuous Wife.</p>
      </header>

      <main className="space-y-4 px-6 pt-6 pb-8">
        {admin && (
          <button onClick={() => setAdding((a) => !a)} className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3 text-sm font-medium text-rose-foreground shadow-bloom">
            <Plus className="h-4 w-4" /> {adding ? "Cancel" : "Add a video"}
          </button>
        )}
        {admin && adding && (
          <section className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose" />
            <input placeholder="YouTube URL" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose" />
            <input placeholder="Category (optional)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose" />
            <textarea rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-rose" />
            <button onClick={save} className="w-full rounded-full bg-rose py-3 text-sm font-medium text-rose-foreground">Save video</button>
          </section>
        )}

        {videos.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No videos yet. {admin ? "Add the first teaching above." : "Check back soon."}
          </p>
        ) : (
          videos.map((v) => {
            const id = extractYouTubeId(v.youtube_url);
            return (
              <article key={v.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
                {id ? (
                  <div className="relative aspect-video w-full">
                    <iframe
                      src={`https://www.youtube.com/embed/${id}`}
                      title={v.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  </div>
                ) : (
                  <a href={v.youtube_url} target="_blank" rel="noreferrer" className="flex aspect-video w-full items-center justify-center bg-secondary">
                    <Play className="h-10 w-10 text-rose" />
                  </a>
                )}
                <div className="flex items-start justify-between gap-2 p-4">
                  <div className="min-w-0">
                    {v.category && <p className="text-[10px] uppercase tracking-wider text-rose">{v.category}</p>}
                    <p className="font-display text-base leading-tight">{v.title}</p>
                    {v.description && <p className="mt-1 text-xs text-muted-foreground">{v.description}</p>}
                  </div>
                  {admin && (
                    <button onClick={() => remove(v.id)} className="text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </main>
    </MobileShell>
  );
}
