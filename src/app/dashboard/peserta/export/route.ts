import { getMyEvent } from "@/lib/supabase/queries/events";
import { getParticipants } from "@/lib/supabase/queries/participants";

const stamp = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

const HEADER = [
  "Nama",
  "Email",
  "Instansi",
  "No. HP",
  "Kode Unik",
  "Status",
  "Terdaftar",
  "Check-in",
];

/** Escape sel CSV: kutip kalau mengandung pemisah/baris baru, dobel kutip. */
function cell(value: string) {
  return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
}

export async function GET() {
  const [event, participants] = await Promise.all([getMyEvent(), getParticipants()]);

  const rows = participants.map((person) => [
    person.name,
    person.email,
    person.org ?? "",
    person.phone ?? "",
    person.code,
    person.status,
    stamp.format(new Date(person.registeredAt)),
    person.checkedInAt ? stamp.format(new Date(person.checkedInAt)) : "",
  ]);

  const csv = [HEADER, ...rows]
    .map((row) => row.map((value) => cell(String(value))).join(","))
    .join("\r\n");

  const name = event ? `peserta-${event.slug}` : "peserta";

  return new Response(`\uFEFF${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}.csv"`,
    },
  });
}
