import { demoParticipants } from "@/lib/demo-data";
import type { ParticipantRow } from "@/lib/supabase/queries/participants";

/**
 * Data peserta dummy dalam bentuk baris database, dipakai saat demo mode nyala.
 * Waktu dummy ditulis sebagai jam WIB; jam check-in ditempel ke tanggal acara.
 */
export function demoParticipantRows(): ParticipantRow[] {
  return demoParticipants.map((person) => ({
    id: String(person.id),
    name: person.name,
    email: person.email,
    org: person.org,
    phone: person.phone,
    job: null,
    code: person.code,
    status: person.status,
    registeredAt: new Date(
      new Date(person.registeredAt).getTime() - 7 * 3_600_000,
    ).toISOString(),
    checkedInAt: person.checkedInAt
      ? new Date(`2026-10-29T${person.checkedInAt}:00+07:00`).toISOString()
      : null,
  }));
}
