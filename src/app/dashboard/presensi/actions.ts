"use server";

import { revalidatePath } from "next/cache";
import { getMyEvent, type EventConfig } from "@/lib/supabase/queries/events";
import { createClient } from "@/lib/supabase/server";

const LATE_AFTER_MS = 30 * 60_000; // toleransi 30 menit dari jam mulai

export type CheckInResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

/**
 * Catat kehadiran dari kode unik peserta.
 * Status dihitung dari `config.start_at` + toleransi; toleransi sengaja di app
 * supaya bisa diubah tanpa migrasi data.
 */
export async function checkIn(rawCode: string): Promise<CheckInResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Kode unik kosong." };

  const event = await getMyEvent();
  if (!event) return { ok: false, error: "Belum ada event." };

  const supabase = await createClient();
  const { data: participant } = await supabase
    .from("participants")
    .select("id, name, checked_in_at")
    .eq("event_id", event.id)
    .eq("code", code)
    .maybeSingle();

  if (!participant) return { ok: false, error: "Kode unik tidak ditemukan." };
  if (participant.checked_in_at) {
    return { ok: false, error: `${participant.name} sudah check-in.` };
  }

  const now = new Date();
  const startAt = ((event.config ?? {}) as EventConfig).start_at;
  const late =
    typeof startAt === "string" &&
    now.getTime() > new Date(startAt).getTime() + LATE_AFTER_MS;
  const status = late ? "Terlambat" : "Hadir";

  const { error } = await supabase
    .from("participants")
    .update({ status, checked_in_at: now.toISOString() })
    .eq("id", participant.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/peserta");
  revalidatePath("/dashboard/presensi");

  return {
    ok: true,
    text: `${participant.name} tercatat ${late ? "terlambat" : "hadir"}.`,
  };
}
