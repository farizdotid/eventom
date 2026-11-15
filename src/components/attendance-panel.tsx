"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { checkIn } from "@/app/dashboard/presensi/actions";
import type { ParticipantRow } from "@/lib/supabase/queries/participants";

type LogEntry = {
  id: string;
  name: string;
  org: string | null;
  code: string;
  time: string;
  status: "Tepat waktu" | "Terlambat";
};

const AVATARS = [
  "bg-[#EDE4FF] text-[#6D4AFF]",
  "bg-[#FCE7F3] text-[#BE185D]",
  "bg-[#E0F2FE] text-[#0369A1]",
  "bg-[#DCFCE7] text-[#15803D]",
  "bg-[#FEF3C7] text-[#B45309]",
];

const pad = (value: number) => String(value).padStart(2, "0");

const clock = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

const STEPS = [
  "Peserta scan QR di lokasi acara.",
  "Peserta memasukkan kode unik dari email pendaftaran.",
  "Status di Peserta berubah jadi Hadir dan nama masuk ke log.",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function AttendancePanel({
  participants,
  checkinUrl,
}: {
  participants: ParticipantRow[];
  checkinUrl: string;
}) {
  const router = useRouter();
  const [active, setActive] = useState(true);
  const [token, setToken] = useState("");
  const [updatedAt, setUpdatedAt] = useState("08:00");
  const [fullscreen, setFullscreen] = useState(false);
  const [query, setQuery] = useState("");
  const [code, setCode] = useState("");
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const log = useMemo<LogEntry[]>(
    () =>
      participants
        .filter((person) => person.checkedInAt)
        .map((person): LogEntry => ({
          id: person.id,
          name: person.name,
          org: person.org,
          code: person.code,
          time: clock.format(new Date(person.checkedInAt as string)),
          status: person.status === "Terlambat" ? "Terlambat" : "Tepat waktu",
        }))
        .sort((a, b) => b.time.localeCompare(a.time)),
    [participants],
  );

  const qrValue = token ? `${checkinUrl}?t=${token}` : checkinUrl;
  const qrLabel = checkinUrl.replace(/^https?:\/\//, "");

  const attended = log.length;
  const late = log.filter((entry) => entry.status === "Terlambat").length;

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return log;
    return log.filter((entry) =>
      `${entry.name} ${entry.code}`.toLowerCase().includes(needle),
    );
  }, [log, query]);

  function regenerate() {
    const now = new Date();
    setToken(String(now.getTime()));
    setUpdatedAt(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;

    startTransition(async () => {
      const result = await checkIn(value);
      if (result.ok) {
        setCode("");
        setFeedback({ ok: true, text: result.text });
        router.refresh();
      } else {
        setFeedback({ ok: false, text: result.error });
      }
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-tight">Presensi</h1>
        <div className="flex items-center gap-7">
          <div className="text-right">
            <p>
              <span className="text-xl font-semibold">{attended}</span>
              <span className="text-sm text-[#A8A3B5]"> / {participants.length}</span>
            </p>
            <p className="text-[11px] text-[#8F8A9E]">peserta hadir</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold">{late}</p>
            <p className="text-[11px] text-[#8F8A9E]">terlambat</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
        <div className="flex min-w-0 flex-col gap-4">
          <section className="rounded-2xl border border-[#EDE9F7] bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">QR Presensi</h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#8F8A9E]">Aktif</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  aria-label="Aktifkan QR presensi"
                  onClick={() => setActive((value) => !value)}
                  className={`relative h-5 w-9 rounded-full transition ${
                    active ? "bg-[#22C55E]" : "bg-[#E5E1EF]"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${
                      active ? "left-[1.15rem]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mx-auto mt-5 w-fit rounded-2xl bg-[#F3EEFF] p-5">
              <QRCodeSVG
                value={qrValue}
                size={196}
                bgColor="#F3EEFF"
                fgColor="#171321"
                level="M"
                marginSize={0}
              />
            </div>

            <p className="mt-4 text-center text-[11px] font-medium text-[#3B3647]">
              {qrLabel}
            </p>
            <p className="mt-0.5 text-center text-[11px] text-[#A8A3B5]">
              Diperbarui pukul {updatedAt}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={regenerate}
                className="rounded-lg border border-[#EDE9F7] bg-white py-2.5 text-xs font-medium text-[#3B3647] hover:bg-[#FBFAFE]"
              >
                Generate Ulang
              </button>
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="rounded-lg bg-[#6D4AFF] py-2.5 text-xs font-medium text-white hover:bg-[#5B3AEB]"
              >
                Tampilkan Layar Penuh
              </button>
            </div>

            <div className="mt-4 border-t border-[#F3F0FA] pt-3">
              <p className="text-xs font-medium">Alur check-in peserta</p>
              <ol className="mt-2 space-y-1.5">
                {STEPS.map((step, i) => (
                  <li key={step} className="flex gap-2 text-[11px] text-[#4B4657]">
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-[#EDE4FF] text-[9px] font-semibold text-[#6D4AFF]">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-[#D9CFE8] bg-[#FCFBFE] p-4">
            <h2 className="text-sm font-semibold">Simulasi check-in</h2>
            <p className="mt-1 text-xs text-[#8F8A9E]">
              Masukkan kode unik seperti yang dilakukan peserta setelah scan. Contoh:{" "}
              <span className="font-mono text-[#6D4AFF]">
                {participants[0]?.code ?? "UX3-XXXX"}
              </span>
            </p>
            <form onSubmit={submit} className="mt-3 flex gap-2">
              <input
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setFeedback(null);
                }}
                placeholder="UX3-XXXX"
                className="min-w-0 flex-1 rounded-lg border border-[#EDE9F7] bg-white px-3 py-2.5 font-mono text-sm uppercase outline-none placeholder:font-sans placeholder:text-[#A8A3B5] focus:border-[#C9B6FF]"
              />
              <button
                type="submit"
                disabled={pending}
                className="rounded-lg bg-[#171321] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2A2438] disabled:opacity-60"
              >
                {pending ? "..." : "Check-In"}
              </button>
            </form>
            {feedback && (
              <p
                className={`mt-2 text-xs ${feedback.ok ? "text-[#16A34A]" : "text-[#DC2626]"}`}
              >
                {feedback.text}
              </p>
            )}
          </section>
        </div>

        <section className="min-w-0 rounded-2xl border border-[#EDE9F7] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Log Presensi</h2>
              <span className="flex items-center gap-1.5 rounded-full bg-[#E9F9EF] px-2 py-0.5 text-[11px] font-medium text-[#16A34A]">
                <span className="size-1.5 rounded-full bg-[#22C55E]" />
                Live
              </span>
            </div>
            <div className="relative w-full sm:w-56">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A8A3B5]"
                aria-hidden
              >
                <path d="M20 20l-4.5-4.5M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" />
              </svg>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama atau kode"
                className="w-full rounded-full border border-[#EDE9F7] bg-[#FBFAFE] py-2 pl-9 pr-3 text-xs outline-none placeholder:text-[#A8A3B5] focus:border-[#C9B6FF] focus:bg-white"
              />
            </div>
          </div>

          <ul className="mt-2 max-h-[560px] divide-y divide-[#F6F3FC] overflow-y-auto pr-1">
            {visible.map((entry, i) => (
              <li key={entry.id} className="flex items-center gap-3 py-2.5">
                <span
                  className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${AVATARS[i % AVATARS.length]}`}
                >
                  {initials(entry.name)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{entry.name}</p>
                  <p className="truncate text-[11px] text-[#8F8A9E]">{entry.org ?? "-"}</p>
                </div>
                <span className="hidden shrink-0 rounded-md bg-[#F6F3FC] px-2 py-1 font-mono text-[10px] text-[#6B6578] sm:block">
                  {entry.code}
                </span>
                <span className="w-10 shrink-0 text-right text-[11px] text-[#5B5568]">
                  {entry.time}
                </span>
                <span
                  className={`shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${
                    entry.status === "Terlambat"
                      ? "bg-[#F1EAFF] text-[#6D4AFF]"
                      : "bg-[#E9F9EF] text-[#16A34A]"
                  }`}
                >
                  {entry.status}
                </span>
              </li>
            ))}

            {visible.length === 0 && (
              <li className="py-10 text-center text-sm text-[#8F8A9E]">
                Tidak ada presensi yang cocok.
              </li>
            )}
          </ul>
        </section>
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-white p-6">
          <QRCodeSVG
            value={qrValue}
            size={320}
            bgColor="#FFFFFF"
            fgColor="#171321"
            level="M"
            className="h-auto w-full max-w-[320px]"
          />
          <p className="text-center text-sm font-medium">{qrLabel}</p>
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="rounded-full border border-[#EDE9F7] px-5 py-2 text-sm hover:bg-[#FBFAFE]"
          >
            Tutup
          </button>
        </div>
      )}
    </div>
  );
}
