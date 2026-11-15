import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { CERTIFICATE_TEMPLATES } from "@/lib/demo-data";
import { getMyEvent } from "@/lib/supabase/queries/events";
import type { ParticipantStatus } from "@/types/database.types";

const DAY_MS = 86_400_000;
const TZ = "Asia/Jakarta";

const dayKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const clockTime = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const dayMonth = new Intl.DateTimeFormat("id-ID", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
});

export type DashboardData = {
  quota: number;
  registered: number;
  weekly: number;
  spark: number[];
  attendance: {
    rate: number;
    segments: { name: string; value: number; color: string }[];
  };
  enrollment: { day: string; total: number }[];
  rangeLabel: string;
  checkins: {
    id: string;
    name: string;
    org: string | null;
    time: string;
    status: ParticipantStatus;
  }[];
  certificate: {
    issued: number;
    eligible: number;
    template: string;
    signatures: number;
  };
};

const EMPTY: DashboardData = {
  quota: 0,
  registered: 0,
  weekly: 0,
  spark: Array(12).fill(0),
  attendance: {
    rate: 0,
    segments: [
      { name: "Hadir tepat waktu", value: 0, color: "#3EC6F0" },
      { name: "Terlambat", value: 0, color: "#C9B6FF" },
      { name: "Belum scan", value: 0, color: "#ECE9F5" },
    ],
  },
  enrollment: [],
  rangeLabel: "belum ada data",
  checkins: [],
  certificate: { issued: 0, eligible: 0, template: "Modern Lilac", signatures: 0 },
};

type EventConfig = {
  quota?: number;
  registration?: { quota?: number };
};

type CertificateConfig = {
  template?: string;
  signers?: { name: string }[];
  rules?: { attendedOnly?: boolean };
};

/**
 * Semua angka Ringkasan dihitung dari tabel asli.
 * Dihitung di JS (bukan beberapa query agregat) karena satu event realistis
 * masih ribuan baris; pindahkan ke SQL function kalau peserta sudah puluhan ribu.
 */
export const getDashboardData = cache(async (): Promise<DashboardData> => {
  const event = await getMyEvent();
  if (!event) return EMPTY;

  const supabase = await createClient();

  const [{ data: participants }, { data: certificate }] = await Promise.all([
    supabase
      .from("participants")
      .select("id, name, org, status, checked_in_at, registered_at")
      .eq("event_id", event.id),
    supabase
      .from("certificates")
      .select("config, issued")
      .eq("event_id", event.id)
      .maybeSingle(),
  ]);

  const rows = participants ?? [];
  const now = Date.now();

  const config = (event.config ?? {}) as EventConfig;
  const quota = config.registration?.quota ?? config.quota ?? 0;

  const dayTotals = new Map<string, number>();
  for (const row of rows) {
    const key = dayKey.format(new Date(row.registered_at));
    dayTotals.set(key, (dayTotals.get(key) ?? 0) + 1);
  }

  const last14 = Array.from({ length: 14 }, (_, i) =>
    new Date(now - (13 - i) * DAY_MS),
  );
  const enrollment = last14.map((date) => ({
    day: String(date.getDate()),
    total: dayTotals.get(dayKey.format(date)) ?? 0,
  }));

  const weekly = rows.filter(
    (row) => now - new Date(row.registered_at).getTime() <= 7 * DAY_MS,
  ).length;

  const onTime = rows.filter((row) => row.status === "Hadir").length;
  const late = rows.filter((row) => row.status === "Terlambat").length;
  const absent = rows.length - onTime - late;

  const certConfig = (certificate?.config ?? {}) as CertificateConfig;
  const visited = onTime + late;
  const eligible = certConfig.rules?.attendedOnly === false ? rows.length : visited;
  const templateLabel =
    CERTIFICATE_TEMPLATES.find((item) => item.id === certConfig.template)?.label ??
    CERTIFICATE_TEMPLATES[0].label;

  return {
    quota,
    registered: rows.length,
    weekly,
    spark: enrollment.slice(-12).map((item) => item.total),
    attendance: {
      rate: rows.length === 0 ? 0 : Math.round((visited / rows.length) * 100),
      segments: [
        { name: "Hadir tepat waktu", value: onTime, color: "#3EC6F0" },
        { name: "Terlambat", value: late, color: "#C9B6FF" },
        { name: "Belum scan", value: absent, color: "#ECE9F5" },
      ],
    },
    enrollment,
    rangeLabel: `${dayMonth.format(last14[0])}–${dayMonth.format(last14[13])}`,
    checkins: rows
      .filter((row) => row.checked_in_at)
      .sort((a, b) => String(b.checked_in_at).localeCompare(String(a.checked_in_at)))
      .slice(0, 5)
      .map((row) => ({
        id: row.id,
        name: row.name,
        org: row.org,
        time: clockTime.format(new Date(row.checked_in_at as string)),
        status: row.status,
      })),
    certificate: {
      issued: certificate?.issued ?? 0,
      eligible,
      template: templateLabel,
      signatures: certConfig.signers?.length ?? 0,
    },
  };
});
