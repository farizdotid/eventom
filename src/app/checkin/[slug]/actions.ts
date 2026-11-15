"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

export type CheckinResult = {
  ok: boolean;
  message: string;
  name?: string;
  status?: string;
};

/** Check-in publik: peserta belum login, jadi jalurnya lewat RPC `check_in`. */
export async function checkInByCode(
  slug: string,
  code: string,
): Promise<CheckinResult> {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, message: "Kode unik masih kosong." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("check_in", {
    p_slug: slug,
    p_code: trimmed,
  });

  if (error) {
    return { ok: false, message: "Gagal menghubungi server. Coba lagi." };
  }

  const raw = (data ?? {}) as Record<string, Json>;

  return {
    ok: raw.ok === true,
    message:
      typeof raw.message === "string" ? raw.message : "Kode unik tidak dikenal.",
    name: typeof raw.name === "string" ? raw.name : undefined,
    status: typeof raw.status === "string" ? raw.status : undefined,
  };
}
