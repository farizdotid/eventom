import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];

/**
 * Event pertama milik user yang login.
 * Tidak perlu filter owner: RLS yang membatasi ke event milik sendiri.
 * Di-cache per request supaya header dan isi halaman tidak query dua kali.
 */
export const getMyEvent = cache(async (): Promise<Event | null> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("id, owner_id, name, slug, status, config, created_at")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  return data;
});
