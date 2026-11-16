"use client";

import { useEffect, useState } from "react";

const LABELS = ["hari", "jam", "menit", "detik"];

/**
 * Hitung mundur ke waktu mulai acara (WIB).
 * - Sebelum mulai: empat kotak angka.
 * - Sedang berlangsung: keterangan singkat.
 * - Sudah selesai: tidak dirender (status sudah ditampilkan di hero).
 * Kosong sampai client siap supaya tidak ada hydration mismatch.
 */
export function Countdown({
  date,
  time,
  endTime,
}: {
  date: string;
  time: string;
  endTime?: string;
}) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(`${date}T${time}:00+07:00`).getTime();
  const end = new Date(`${date}T${endTime || time}:00+07:00`).getTime();

  if (!Number.isFinite(start) || !Number.isFinite(end)) return null;
  if (now === null) return <div className="h-[54px]" />;
  if (now >= end) return null;

  if (now >= start) {
    return (
      <p className="rounded-xl bg-[var(--soft)] px-4 py-2.5 text-sm font-medium text-[var(--accent)]">
        Acara sedang berlangsung
      </p>
    );
  }

  const diff = start - now;
  const parts = [
    Math.floor(diff / 86_400_000),
    Math.floor(diff / 3_600_000) % 24,
    Math.floor(diff / 60_000) % 60,
    Math.floor(diff / 1000) % 60,
  ].map((value) => String(value).padStart(2, "0"));

  return (
    <div className="grid w-full max-w-[320px] grid-cols-4 gap-1.5 sm:max-w-[280px] sm:gap-2">
      {parts.map((value, i) => (
        <div
          key={LABELS[i]}
          className="rounded-xl border border-[#EDE9F7] bg-white px-1 py-1.5 text-center sm:px-2"
        >
          <p className="text-sm font-semibold tabular-nums leading-none sm:text-base">
            {value}
          </p>
          <p className="mt-1 text-[10px] text-[#8F8A9E]">{LABELS[i]}</p>
        </div>
      ))}
    </div>
  );
}
