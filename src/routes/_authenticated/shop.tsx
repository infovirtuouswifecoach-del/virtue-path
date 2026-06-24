import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ExternalLink, Plus, Trash2, Package, Download, Link as LinkIcon } from "lucide-react";
import { isAdmin } from "@/lib/activity";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/shop")({
  component: ShopPage,
});

type Product = {
  id: string; title: string; description: string | null;
  price_cents: number | null; image_url: string | null;
  product_type: string; external_url: string | null; category: string | null;
};

const TYPE_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  digital: Download, physical: Package, affiliate: LinkIcon,
};

function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [admin, setAdmin] = useState(false);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", price_cents: 0, image_url: "",
    product_type: "affiliate", external_url: "", category: "",
  });

  useEffect(() => { (async () => { setAdmin(await isAdmin()); load(); })(); }, []);

  async function load() {
    const { data } = await supabase.from("shop_products").select("*").order("sort_order");
    if (data) setProducts(data as Product[]);
  }
  async function save() {
    if (!form.title) { toast.error("Title required"); return; }
    const { error } = await supabase.from("shop_products").insert({ ...form, published: true });
    if (error) return toast.error(error.message);
    setForm({ title: "", description: "", price_cents: 0, image_url: "", product_type: "affiliate", external_url: "", category: "" });
    setAdding(false);
    load();
  }
  async function remove(id: string) {
    await supabase.from("shop_products").delete().eq("id", id);
    load();
  }

  return (
    <MobileShell>
      <header className="bg-dawn px-6 pb-6 pt-12">
        <Link to="/explore" className="inline-flex items-center text-xs text-muted-foreground">
          <ChevronLeft className="h-4 w-4" /> Explore
        </Link>
        <h1 className="mt-3 font-display text-[2rem] leading-tight">Shop Virtuous</h1>
        <p className="mt-2 text-sm text-muted-foreground">Digital tools, physical goods, and favorites we love.</p>
      </header>

      <main className="space-y-4 px-6 pt-6 pb-8">
        {admin && (
          <button onClick={() => setAdding((a) => !a)} className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-gradient py-3 text-sm font-medium text-rose-foreground shadow-bloom">
            <Plus className="h-4 w-4" /> {adding ? "Cancel" : "Add product"}
          </button>
        )}
        {admin && adding && (
          <section className="space-y-3 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="inp" />
            <textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="inp resize-none" />
            <div className="grid grid-cols-2 gap-2">
              <select value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })} className="inp">
                <option value="affiliate">Affiliate</option>
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
              </select>
              <input type="number" placeholder="Price (cents)" value={form.price_cents} onChange={(e) => setForm({ ...form, price_cents: Number(e.target.value) })} className="inp" />
            </div>
            <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="inp" />
            <input placeholder="External / affiliate URL" value={form.external_url} onChange={(e) => setForm({ ...form, external_url: e.target.value })} className="inp" />
            <input placeholder="Category (optional)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="inp" />
            <button onClick={save} className="w-full rounded-full bg-rose py-3 text-sm font-medium text-rose-foreground">Save product</button>
            <style>{`.inp{width:100%;border-radius:1rem;border:1px solid var(--input);background:var(--background);padding:0.625rem 1rem;font-size:0.875rem;outline:none;}`}</style>
          </section>
        )}

        {products.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            The shop is just getting started. {admin ? "Add the first product above." : "Check back soon for tools and favorites."}
          </p>
        ) : (
          products.map((p) => {
            const Icon = TYPE_ICON[p.product_type] ?? LinkIcon;
            return (
              <article key={p.id} className="flex gap-3 rounded-3xl border border-border/60 bg-card p-3 shadow-soft">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                ) : (
                  <div className="grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-secondary">
                    <Icon className="h-6 w-6 text-rose" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {p.category && <p className="text-[10px] uppercase tracking-wider text-rose">{p.category}</p>}
                  <p className="font-display text-base leading-tight">{p.title}</p>
                  {p.description && <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{p.description}</p>}
                  <div className="mt-2 flex items-center gap-2">
                    {p.price_cents && p.price_cents > 0 ? (
                      <span className="font-display text-sm">${(p.price_cents / 100).toFixed(2)}</span>
                    ) : (
                      <span className="text-xs text-muted-foreground capitalize">{p.product_type}</span>
                    )}
                    {p.external_url && (
                      <a href={p.external_url} target="_blank" rel="noreferrer" className="ml-auto inline-flex items-center gap-1 rounded-full bg-rose px-3 py-1 text-xs font-medium text-rose-foreground">
                        Shop <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {admin && (
                      <button onClick={() => remove(p.id)} className="text-muted-foreground"><Trash2 className="h-4 w-4" /></button>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </main>
    </MobileShell>
  );
}
