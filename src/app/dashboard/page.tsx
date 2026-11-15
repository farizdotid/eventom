import { Suspense } from "react";
import { AttendanceDonut, EnrollmentTrend, SparkBars } from "@/components/dashboard-charts";
import { DashboardGuard } from "@/components/dashboard-guard";
import { isDemoMode } from "@/lib/demo";
import { getMyEvent } from "@/lib/supabase/queries/events";
import { getDashboardData, type DashboardData } from "@/lib/supabase/queries/dashboard";
import {
  demoAttendance,
  demoCertificate,
  demoCheckins,
  demoEnrollment,
  demoEvent,
  demoRegistrants,
} from "@/lib/demo-data";

const CARD = "min-w-0 rounded-2xl border border-[#EDE9F7] bg-white p-5";
const LINK = "text-sm font-medium text-[#6D4AFF]";

const AVATARS = [
  "bg-[#EDE4FF] text-[#6D4AFF]",
  "bg-[#FCE7F3] text-[#BE185D]",
  "bg-[#E0F2FE] text-[#0369A1]",
  "bg-[#DCFCE7] text-[#15803D]",
  "bg-[#FEF3C7] text-[#B45309]",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("");
}

function EventPill({ name, status }: { name: string; status?: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#EDE9F7] bg-white py-1.5 pl-3 pr-1.5 text-sm">
      <span className="size-2 rounded-full bg-[#22C55E]" />
      <span className="font-medium text-[#3B3647]">{name}</span>
      {status && (
        <span className="rounded-full bg-[#E9F9EF] px-2.5 py-1 text-[11px] font-medium text-[#16A34A]">
          {status}
        </span>
      )}
    </div>
  );
}

/** Nama event dari database; data dummy cuma dipakai kalau demo mode nyala. */
async function EventPillLive() {
  const event = await getMyEvent();
  if (event) return <EventPill name={event.name} status={event.status} />;

  return isDemoMode() ? (
    <EventPill name={demoEvent.name} status={demoEvent.status} />
  ) : (
    <EventPill name="Belum ada event" />
  );
}

/** Angka Ringkasan: dari database, atau dari data dummy kalau demo mode nyala. */
async function loadDashboard(): Promise<DashboardData> {
  if (!isDemoMode()) return getDashboardData();

  return {
    quota: demoRegistrants.quota,
    registered: demoRegistrants.count,
    weekly: demoRegistrants.weekly,
    spark: demoRegistrants.spark,
    attendance: demoAttendance,
    enrollment: demoEnrollment,
    rangeLabel: "contoh data demo",
    checkins: demoCheckins.map((person) => ({
      id: String(person.id),
      name: person.name,
      org: person.org,
      time: person.time,
      status: person.status as DashboardData["checkins"][number]["status"],
    })),
    certificate: demoCertificate,
  };
}

function CardsSkeleton() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`${CARD} h-[188px] animate-pulse bg-white/60`} />
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className={`${CARD} h-[300px] animate-pulse bg-white/60`} />
        ))}
      </div>
    </>
  );
}

async function DashboardContent() {
  const data = await loadDashboard();

  const quotaFilled =
    data.quota > 0 ? Math.min(100, Math.round((data.registered / data.quota) * 100)) : 0;
  const certificateProgress =
    data.certificate.eligible > 0
      ? Math.min(100, Math.round((data.certificate.issued / data.certificate.eligible) * 100))
      : 0;
  const enrollmentTotal = data.enrollment.reduce((sum, day) => sum + day.total, 0);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <section className={CARD}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Pendaftar</h2>
            <span className={LINK}>Lihat Data</span>
          </div>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[34px] font-semibold leading-none tracking-tight">
                {data.registered}
              </p>
              <p className="mt-2 text-xs text-[#8F8A9E]">dari kuota {data.quota}</p>
              <p className="mt-1 text-xs font-medium text-[#16A34A]">
                +{data.weekly} minggu ini
              </p>
            </div>
            <SparkBars data={data.spark} />
          </div>

          <div className="mt-4 h-1.5 rounded-full bg-[#EFEBF8]">
            <div
              className="h-full rounded-full bg-[#8B6BFF]"
              style={{ width: `${quotaFilled}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[#8F8A9E]">
            <span>Kuota terisi</span>
            <span className="font-semibold text-[#3B3647]">{quotaFilled}%</span>
          </div>
        </section>

        <section className={CARD}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Kehadiran</h2>
            <span className={LINK}>Lihat Presensi</span>
          </div>

          <div className="mt-3 flex items-center gap-4">
            <AttendanceDonut segments={data.attendance.segments} rate={data.attendance.rate} />
            <ul className="flex-1 space-y-2.5">
              {data.attendance.segments.map((segment) => (
                <li
                  key={segment.name}
                  className="flex items-center justify-between gap-2 text-xs"
                >
                  <span className="flex items-center gap-2 text-[#8F8A9E]">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    />
                    {segment.name}
                  </span>
                  <span className="font-semibold text-[#3B3647]">{segment.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={`${CARD} md:col-span-2 xl:col-span-1`}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Sertifikat</h2>
            <span className={LINK}>Atur</span>
          </div>

          <p className="mt-3 flex items-baseline gap-1">
            <span className="text-[34px] font-semibold leading-none tracking-tight">
              {data.certificate.issued}
            </span>
            <span className="text-sm text-[#A8A3B5]">/ {data.certificate.eligible}</span>
          </p>
          <p className="mt-2 text-xs text-[#8F8A9E]">
            sudah diunduh peserta yang hadir
          </p>

          <div className="mt-4 h-1.5 rounded-full bg-[#EFEBF8]">
            <div
              className="h-full rounded-full bg-[#F3A6D0]"
              style={{ width: `${certificateProgress}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-lg bg-[#F4F1FB] px-2.5 py-1.5 text-[11px] text-[#5B5568]">
              Template: {data.certificate.template}
            </span>
            <span className="rounded-lg bg-[#F4F1FB] px-2.5 py-1.5 text-[11px] text-[#5B5568]">
              {data.certificate.signatures} penandatangan
            </span>
          </div>
        </section>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:items-start">
        <section className={CARD}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Presensi Terbaru</h2>
              <span className="flex items-center gap-1.5 rounded-full bg-[#E9F9EF] px-2 py-0.5 text-[11px] font-medium text-[#16A34A]">
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
                Live
              </span>
            </div>
            <span className={LINK}>Lihat Semua</span>
          </div>

          {data.checkins.length === 0 ? (
            <p className="mt-4 text-sm text-[#8F8A9E]">
              Belum ada peserta yang check-in.
            </p>
          ) : (
            <ul className="mt-2 divide-y divide-[#F3F0FA]">
              {data.checkins.map((person, i) => (
                <li key={person.id} className="flex items-center gap-3 py-3">
                  <span
                    className={`grid size-9 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${AVATARS[i % AVATARS.length]}`}
                  >
                    {initials(person.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{person.name}</p>
                    <p className="truncate text-xs text-[#8F8A9E]">{person.org}</p>
                  </div>
                  <span className="shrink-0 text-xs text-[#5B5568]">{person.time}</span>
                  <span className="shrink-0 rounded-md bg-[#F1EAFF] px-2 py-1 text-[11px] font-medium text-[#6D4AFF]">
                    {person.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={CARD}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold">Tren Pendaftaran Harian</h2>
              <p className="mt-1 text-xs text-[#8F8A9E]">
                14 hari terakhir · {data.rangeLabel}
              </p>
            </div>
            <div className="text-right leading-none">
              <p className="text-xl font-semibold">{enrollmentTotal}</p>
              <p className="mt-1 text-xs text-[#8F8A9E]">total</p>
            </div>
          </div>

          <div className="mt-4">
            <EnrollmentTrend data={data.enrollment} />
          </div>
        </section>
      </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5">
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-tight">Ringkasan</h1>
        <Suspense
          fallback={<div className="h-9 w-44 animate-pulse rounded-full bg-white" />}
        >
          <EventPillLive />
        </Suspense>
      </div>

      <Suspense fallback={<CardsSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
