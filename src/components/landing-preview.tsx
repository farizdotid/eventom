"use client";

import { useEffect, useState } from "react";
import {
  LANDING_THEMES,
  demoRegistrants,
  type LandingData,
} from "@/lib/demo-data";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function LandingPreview({ data }: { data: LandingData }) {
  const theme = LANDING_THEMES.find((item) => item.id === data.theme) ?? LANDING_THEMES[0];
  const [now, setNow] = useState<number | null>(null);
  const learn = data.about.learn.split("\n").filter(Boolean);
  const seatsLeft = Math.max(0, data.registration.quota - demoRegistrants.count);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const target = new Date(`${data.event.date}T${data.event.startTime}:00`).getTime();
  const diff = now === null ? 0 : Math.max(0, target - now);
  const countdown = [
    Math.floor(diff / 86_400_000),
    Math.floor(diff / 3_600_000) % 24,
    Math.floor(diff / 60_000) % 60,
    Math.floor(diff / 1000) % 60,
  ].map((value) => String(value).padStart(2, "0"));

  return (
    <div
      className="bg-white text-[#241F31]"
      style={
        { "--accent": theme.accent, "--soft": theme.soft } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between border-b border-[#F3F0FA] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="grid size-4 place-items-center rounded bg-[var(--accent)] text-white">
            <svg viewBox="0 0 24 24" className="size-2.5" fill="currentColor" aria-hidden>
              <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
            </svg>
          </span>
          <span className="text-[7px] font-semibold text-[#8F8A9E]">Eventom</span>
        </div>
        <div className="flex items-center gap-2.5 text-[8px] text-[#4B4657]">
          <span>Tentang</span>
          <span>Agenda</span>
          <span>Lokasi</span>
          <span className="rounded bg-[var(--accent)] px-2 py-1 text-[7px] font-medium text-white">
            {data.registration.cta}
          </span>
        </div>
      </div>

      <div className="grid gap-3 px-4 py-4 sm:grid-cols-[1.1fr_1fr]">
        <div>
          <h3 className="text-[17px] font-semibold leading-[1.15]">
            {data.event.name}
          </h3>
          <p className="mt-2 text-[8px] leading-relaxed text-[#6B6578]">
            {data.event.tagline}
          </p>
          <p className="mt-2 text-[7px] text-[#8F8A9E]">
            {dateLabel(data.event.date)} · {data.registration.price} ·{" "}
            {data.event.format} · {data.event.location}
          </p>
          <span className="mt-2.5 inline-block rounded bg-[var(--accent)] px-2.5 py-1.5 text-[7px] font-medium text-white">
            {data.registration.cta}
          </span>
          {data.sections.quota && (
            <p className="mt-1.5 text-[7px] text-[#8F8A9E]">
              Kuota tersisa {seatsLeft} dari {data.registration.quota}
            </p>
          )}
          {data.sections.countdown && (
            <div className="mt-3 flex gap-1.5">
              {countdown.map((value, i) => (
                <span
                  key={i}
                  className="rounded border border-[#EDE9F7] bg-white px-2.5 py-1 text-[9px] font-semibold tabular-nums"
                >
                  {value}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-lg border border-dashed border-[#D9CFEF] bg-[#FBFAFE]">
          {data.event.banner ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
            <img
              src={data.event.banner}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <div className="text-center text-[7px] text-[#A8A3B5]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="mx-auto mb-1 size-4"
                aria-hidden
              >
                <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm0 10.5 4.5-4.5a2 2 0 0 1 2.8 0L15 16m-1-2.5 1.7-1.7a2 2 0 0 1 2.8 0L21 14.3" />
              </svg>
              Banner visual
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-3 border-t border-[#F3F0FA] px-4 py-3 sm:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="text-[6px] font-semibold tracking-[0.14em] text-[#A8A3B5]">
            TENTANG EVENT INI
          </p>
          <p className="mt-1.5 text-[8px] leading-relaxed text-[#4B4657]">
            {data.about.description}
          </p>
        </div>
        <div className="rounded-lg bg-[var(--soft)] p-2.5">
          <p className="text-[7px] font-semibold">Yang akan dipelajari</p>
          <ul className="mt-1.5 space-y-1 text-[7px] text-[#4B4657]">
            {learn.map((item) => (
              <li key={item} className="flex gap-1.5">
                <span className="text-[var(--accent)]">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-3 border-t border-[#F3F0FA] px-4 py-3 sm:grid-cols-[0.85fr_1.15fr]">
        {data.sections.speaker && (
          <div>
            <p className="text-[6px] font-semibold tracking-[0.14em] text-[#A8A3B5]">
              PEMBICARA
            </p>
            <div className="mt-1.5 rounded-lg border border-[#F1EDFA] p-2.5">
              <span className="grid size-7 place-items-center rounded-full bg-[var(--soft)] text-[7px] font-semibold text-[var(--accent)]">
                {initials(data.speaker.name)}
              </span>
              <p className="mt-1.5 text-[8px] font-semibold">{data.speaker.name}</p>
              <p className="text-[7px] text-[#8F8A9E]">{data.speaker.role}</p>
              <p className="mt-1 text-[7px] leading-relaxed text-[#6B6578]">
                {data.speaker.bio}
              </p>
            </div>
          </div>
        )}

        <div>
          <p className="text-[6px] font-semibold tracking-[0.14em] text-[#A8A3B5]">
            AGENDA
          </p>
          {data.sections.agenda ? (
            <ul className="mt-1.5 space-y-1.5">
              {data.agenda.map((session) => (
                <li key={session.id} className="flex items-baseline gap-2 text-[7px]">
                  <span className="shrink-0 tabular-nums text-[#8F8A9E]">
                    {session.start} – {session.end}
                  </span>
                  <span>{session.title}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[7px] text-[#A8A3B5]">Agenda disembunyikan.</p>
          )}
        </div>
      </div>

      <div className="border-t border-[#F3F0FA] px-4 py-3">
        <p className="text-[6px] font-semibold tracking-[0.14em] text-[#A8A3B5]">
          LOKASI
        </p>
        <p className="mt-1 text-[8px] font-semibold">{data.event.location}</p>
        <p className="text-[7px] text-[#8F8A9E]">
          {dateLabel(data.event.date)} · {data.event.startTime}–{data.event.endTime} WIB
        </p>
      </div>

      <div className="m-3 rounded-lg bg-[var(--soft)] p-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-[9px] font-semibold">Amankan kursimu</p>
            <p className="mt-1 text-[7px] leading-relaxed text-[#6B6578]">
              Pendaftaran ditutup {dateLabel(data.registration.deadline)}. Kuota{" "}
              {data.registration.quota} peserta.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <span className="rounded border border-white bg-white/70 px-1.5 py-1 text-[6px] text-[#A8A3B5]">
              Nama lengkap
            </span>
            <span className="rounded border border-white bg-white/70 px-1.5 py-1 text-[6px] text-[#A8A3B5]">
              Email
            </span>
            {data.fields.whatsapp && (
              <span className="rounded border border-white bg-white/70 px-1.5 py-1 text-[6px] text-[#A8A3B5]">
                No. WhatsApp
              </span>
            )}
            {data.fields.institution && (
              <span className="rounded border border-white bg-white/70 px-1.5 py-1 text-[6px] text-[#A8A3B5]">
                Instansi/kampus
              </span>
            )}
            {data.fields.job && (
              <span className="col-span-2 rounded border border-white bg-white/70 px-1.5 py-1 text-[6px] text-[#A8A3B5]">
                Pekerjaan
              </span>
            )}
            <span className="col-span-2 rounded bg-[var(--accent)] px-1.5 py-1 text-center text-[6px] font-medium text-white">
              {data.registration.cta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
