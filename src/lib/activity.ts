import { supabase } from "@/integrations/supabase/client";

export async function logActivity(eventType: string, path?: string, metadata?: Record<string, unknown>) {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    await supabase.from("activity_log").insert({
      user_id: u.user.id,
      event_type: eventType,
      event_path: path ?? (typeof window !== "undefined" ? window.location.pathname : null),
      metadata: metadata ?? {},
    });
  } catch {
    // never let analytics break the app
  }
}

export async function isAdmin(): Promise<boolean> {
  try {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return false;
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id)
      .eq("role", "admin")
      .maybeSingle();
    return !!data;
  } catch {
    return false;
  }
}
