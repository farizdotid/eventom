import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

export type PublicEvent = {
  id: string;
  name: string;
  slug: string;
  status: string;
  startAt: string | null;
  location: string | null;
};

/** Info acara untuk halaman publik (lewat RPC, bukan tabel langsung). */
export async function getPublicEvent(slug: string): Promise<PublicEvent | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("public_event", { p_slug: slug });
  if (!data) return null;

  const raw = data as Record<string, Json>;

  return {
    id: String(raw.id),
    name: String(raw.name),
    slug: String(raw.slug),
    status: String(raw.status),
    startAt: typeof raw.start_at === "string" ? raw.start_at : null,
    location: typeof raw.location === "string" ? raw.location : null,
  };
}
