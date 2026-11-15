"use client";

import { useEffect, useState } from "react";

/** Hitung mundur ke waktu mulai acara (WIB). Render kosong sampai client siap. */
export function Countdown({ date, time }: { date: string; time: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(`${date}T${time}:00+07:00`).getTime();
  const diff = now === null ? 0 : Math.max(0, target - now);
  const parts = [
    Math.floor(diff / 86_400_000),
    Math.floor(diff / 3_600_000) % 24,
    Math.floor(diff / 60_000) % 60,
    Math.floor(diff / 1000) % 60,
  ].map((value) => String(value).padStart(2, "0"));

  const labels = ["hari", "jam", "menit", "detik"];

  return (
    <div className="flex gap-2">
      {parts.map((value, i) => (
        <div
          key={labels[i]}
          className="min-w-14 rounded-xl border border-[#EDE9F7] bg-white px-2 py-1.5 text-center"
        >
          <p className="text-base font-semibold tabular-nums leading-none">{value}</p>
          <p className="mt-1 text-[10px] text-[#8F8A9E]">{labels[i]}</p>
        </div>
      ))}
    </div>
  );
}
