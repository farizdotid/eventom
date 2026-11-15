import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

/** Profil panitia yang sedang login, atau null kalau belum login. */
export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}
