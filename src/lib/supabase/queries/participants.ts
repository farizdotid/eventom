import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getMyEvent } from "@/lib/supabase/queries/events";
import type { ParticipantStatus } from "@/types/database.types";

/** Bentuk baris yang dipakai tabel peserta. */
export type ParticipantRow = {
  id: string;
  name: string;
  email: string;
  org: string | null;
  phone: string | null;
  job: string | null;
  code: string;
  status: ParticipantStatus;
  registeredAt: string;
  checkedInAt: string | null;
};

/**
 * Semua peserta event milik user. Filter/pagination dikerjakan di client
 * karena satu event realistis masih ratusan baris; pindah ke server-side
 * pagination (`.range()`) kalau sudah ribuan.
 */
export const getParticipants = cache(async (): Promise<ParticipantRow[]> => {
  const event = await getMyEvent();
  if (!event) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("participants")
    .select("id, name, email, org, phone, job, code, status, registered_at, checked_in_at")
    .eq("event_id", event.id)
    .order("registered_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    org: row.org,
    phone: row.phone,
    job: row.job,
    code: row.code,
    status: row.status,
    registeredAt: row.registered_at,
    checkedInAt: row.checked_in_at,
  }));
});
