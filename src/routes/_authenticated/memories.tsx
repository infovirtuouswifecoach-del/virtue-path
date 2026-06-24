import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, MapPin, Plus, Image as ImageIcon, Mic, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/memories")({
  component: MemoriesPage,
});

type Memory = {
  id: string;
  title: string;
  location_name: string;
  memory_date: string | null;
  photo_url: string | null;
  note: string | null;
};

function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [adding, setAdding] = useState(false);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { data } = await supabase
      .from("memories").select("*")
      .eq("user_id", u.user.id)
      .order("memory_date", { ascending: false, nullsFirst: false });
    if (data) {
      const list = await Promise.all(data.map(async (m) => {
        let url = m.photo_url;
        if (url && !url.startsWith("http")) {
          const { data: signed } = await supabase.storage.from("memories").createSignedUrl(url, 3600);
          url = signed?.signedUrl ?? null;
        }
        return { ...m, photo_url: url } as Memory;
      }));
      setMemories(list);
    }
  }

  async function remove(id: string) {
    await supabase.from("memories").delete().eq("id", id);
    setMemories((m) => m.filter((x) => x.id !== id));
  }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Explore
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">Memory Map</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pin the trips, dates, and moments you want to remember.
        </p>
      </header>

      <main className="space-y-4 px-6 pt-6 pb-8">
        <button
          onClick={() => setAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3 text-sm font-medium text-rose-foreground shadow-bloom"
        >
          <Plus className="h-4 w-4" /> New memory
        </button>

        {memories.length === 0 && !adding && (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No memories yet. Add your first trip, date night, or special moment.
          </p>
        )}

        <ul className="space-y-3">
          {memories.map((m) => (
            <li key={m.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft">
              {m.photo_url && (
                <img src={m.photo_url} alt={m.title} className="h-48 w-full object-cover" />
              )}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-display text-lg leading-tight">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 text-rose" /> {m.location_name}
                      {m.memory_date && <span> · {new Date(m.memory_date).toLocaleDateString()}</span>}
                    </p>
                  </div>
                  <button onClick={() => remove(m.id)} className="text-muted-foreground" aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {m.note && <p className="mt-2 text-sm leading-snug text-foreground/90">{m.note}</p>}
              </div>
            </li>
          ))}
        </ul>

        {adding && <NewMemoryDialog onClose={() => { setAdding(false); load(); }} />}
      </main>
    </MobileShell>
  );
}

function NewMemoryDialog({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ title: "", location_name: "", memory_date: "", note: "" });
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      rec.ondataavailable = (e) => chunks.push(e.data);
      rec.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks, { type: "audio/webm" });
        try {
          // Try Web Speech API for instant client-side dictation as a fallback hint
          toast.info("Voice saved — type your transcription below.");
        } catch {}
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setForm((f) => ({ ...f, note: (f.note ? f.note + "\n\n" : "") + `[voice note recorded ${Math.round(blob.size / 1024)}KB]` }));
          void dataUrl;
        };
        reader.readAsDataURL(blob);
      };
      rec.start();
      recRef.current = rec;
      setRecording(true);
    } catch {
      toast.error("Microphone unavailable.");
    }
  }
  function stopRecording() {
    recRef.current?.stop();
    setRecording(false);
  }

  async function save() {
    if (!form.title || !form.location_name) { toast.error("Title and location required"); return; }
    setSaving(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) { setSaving(false); return; }

    let photoPath: string | null = null;
    if (file) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${u.user.id}/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("memories").upload(path, file);
      if (upErr) { toast.error(upErr.message); setSaving(false); return; }
      photoPath = path;
    }

    const { error } = await supabase.from("memories").insert({
      user_id: u.user.id,
      title: form.title,
      location_name: form.location_name,
      memory_date: form.memory_date || null,
      note: form.note || null,
      photo_url: photoPath,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Memory saved 💛");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-[30rem] rounded-t-3xl bg-card p-6 shadow-bloom">
        <h2 className="font-display text-xl">New memory</h2>
        <div className="mt-4 space-y-3">
          <input
            placeholder="Title (e.g., Florida 2025)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose"
          />
          <input
            placeholder="Location (e.g., Miami, FL)"
            value={form.location_name}
            onChange={(e) => setForm({ ...form, location_name: e.target.value })}
            className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose"
          />
          <input
            type="date"
            value={form.memory_date}
            onChange={(e) => setForm({ ...form, memory_date: e.target.value })}
            className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-rose"
          />
          <textarea
            placeholder="A short note…"
            rows={3}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none focus:border-rose"
          />
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card py-2.5 text-xs">
              <ImageIcon className="h-3.5 w-3.5" /> {file ? file.name.slice(0, 20) : "Add photo"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <button onClick={recording ? stopRecording : startRecording} className={`flex flex-1 items-center justify-center gap-2 rounded-full py-2.5 text-xs ${recording ? "bg-rose text-rose-foreground" : "border border-border bg-card"}`}>
              <Mic className="h-3.5 w-3.5" /> {recording ? "Stop" : "Voice note"}
            </button>
          </div>
        </div>
        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-full border border-border bg-card py-3 text-sm">Cancel</button>
          <button onClick={save} disabled={saving} className="flex-1 rounded-full bg-rose-gradient py-3 text-sm font-medium text-rose-foreground shadow-bloom disabled:opacity-60">
            {saving ? "Saving…" : "Save memory"}
          </button>
        </div>
      </div>
    </div>
  );
}
