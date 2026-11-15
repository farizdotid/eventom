"use client";

import { useState } from "react";
import { LandingPreview } from "@/components/landing-preview";
import {
  LANDING_THEMES,
  demoEvent,
  demoLanding,
  type LandingData,
} from "@/lib/demo-data";

const CARD = "rounded-2xl border border-[#EDE9F7] bg-white p-5";
const INP =
  "w-full rounded-lg border border-[#EDE9F7] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#A8A3B5] focus:border-[#C9B6FF]";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs text-[#8F8A9E]">{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  title,
  hint,
  checked,
  onChange,
}: {
  title: string;
  hint?: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5">
      <div>
        <p className="text-sm">{title}</p>
        {hint && <p className="text-xs text-[#8F8A9E]">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={onChange}
        className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition ${
          checked ? "bg-[#6D4AFF]" : "bg-[#E5E1EF]"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${
            checked ? "left-[1.15rem]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export function LandingEditor() {
  const [data, setData] = useState<LandingData>(demoLanding);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  function patch<K extends keyof LandingData>(key: K, value: LandingData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function patchGroup<K extends "event" | "about" | "speaker" | "registration">(
    group: K,
    key: keyof LandingData[K],
    value: string | number,
  ) {
    setData(
      (prev) =>
        ({ ...prev, [group]: { ...prev[group], [key]: value } }) as LandingData,
    );
  }

  function toggleField(key: keyof LandingData["fields"]) {
    setData((prev) => ({
      ...prev,
      fields: { ...prev.fields, [key]: !prev.fields[key] },
    }));
  }

  function toggleSection(key: keyof LandingData["sections"]) {
    setData((prev) => ({
      ...prev,
      sections: { ...prev.sections, [key]: !prev.sections[key] },
    }));
  }

  function patchAgenda(id: number, key: "start" | "end" | "title", value: string) {
    setData((prev) => ({
      ...prev,
      agenda: prev.agenda.map((session) =>
        session.id === id ? { ...session, [key]: value } : session,
      ),
    }));
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-tight">Landing Page</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setData(demoLanding)}
            className="rounded-full border border-[#EDE9F7] bg-white px-4 py-2 text-sm font-medium text-[#3B3647] hover:bg-[#FBFAFE]"
          >
            Reset
          </button>
          <button
            type="button"
            title="Belum tersambung ke backend"
            className="rounded-full bg-[#6D4AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5B3AEB]"
          >
            Simpan &amp; Publikasikan
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_26rem] xl:items-start">
        <div className="flex flex-col gap-4">
          <section className={CARD}>
            <h2 className="text-sm font-semibold">Tema</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {LANDING_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => patch("theme", theme.id)}
                  className={`rounded-xl border p-2 text-left transition ${
                    data.theme === theme.id
                      ? "border-[#6D4AFF]"
                      : "border-[#EDE9F7] hover:border-[#D9CDF7]"
                  }`}
                >
                  <div
                    className="rounded-lg p-2.5"
                    style={{ backgroundColor: theme.soft }}
                  >
                    <div className="h-1.5 w-10 rounded-full bg-[#C8BEE6]" />
                    <div className="mt-1 h-1.5 w-14 rounded-full bg-[#DED7F0]" />
                    <div
                      className="mt-3 h-1 w-9 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium">{theme.label}</p>
                </button>
              ))}
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Informasi Utama</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Nama event" className="sm:col-span-2">
                <input
                  className={INP}
                  value={data.event.name}
                  onChange={(e) => patchGroup("event", "name", e.target.value)}
                />
              </Field>
              <Field label="Tagline" className="sm:col-span-2">
                <textarea
                  className={INP}
                  rows={2}
                  value={data.event.tagline}
                  onChange={(e) => patchGroup("event", "tagline", e.target.value)}
                />
              </Field>
              <Field label="Tanggal">
                <input
                  type="date"
                  className={INP}
                  value={data.event.date}
                  onChange={(e) => patchGroup("event", "date", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Jam mulai">
                  <input
                    type="time"
                    className={INP}
                    value={data.event.startTime}
                    onChange={(e) =>
                      patchGroup("event", "startTime", e.target.value)
                    }
                  />
                </Field>
                <Field label="Jam selesai">
                  <input
                    type="time"
                    className={INP}
                    value={data.event.endTime}
                    onChange={(e) =>
                      patchGroup("event", "endTime", e.target.value)
                    }
                  />
                </Field>
              </div>
              <Field label="Format">
                <select
                  className={INP}
                  value={data.event.format}
                  onChange={(e) => patchGroup("event", "format", e.target.value)}
                >
                  <option>Offline</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                </select>
              </Field>
              <Field label="Lokasi">
                <input
                  className={INP}
                  value={data.event.location}
                  onChange={(e) => patchGroup("event", "location", e.target.value)}
                />
              </Field>
            </div>
            <p className="mt-3 text-xs text-[#A8A3B5]">
              Banner diunggah langsung di pratinjau.
            </p>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Tentang Event</h2>
            <div className="mt-3 flex flex-col gap-3">
              <Field label="Deskripsi">
                <textarea
                  className={INP}
                  rows={4}
                  value={data.about.description}
                  onChange={(e) =>
                    patchGroup("about", "description", e.target.value)
                  }
                />
              </Field>
              <Field label="Yang akan dipelajari (satu per baris)">
                <textarea
                  className={INP}
                  rows={4}
                  value={data.about.learn}
                  onChange={(e) => patchGroup("about", "learn", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Pembicara</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Nama">
                <input
                  className={INP}
                  value={data.speaker.name}
                  onChange={(e) => patchGroup("speaker", "name", e.target.value)}
                />
              </Field>
              <Field label="Jabatan / instansi">
                <input
                  className={INP}
                  value={data.speaker.role}
                  onChange={(e) => patchGroup("speaker", "role", e.target.value)}
                />
              </Field>
              <Field label="Bio singkat" className="sm:col-span-2">
                <textarea
                  className={INP}
                  rows={2}
                  value={data.speaker.bio}
                  onChange={(e) => patchGroup("speaker", "bio", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Agenda</h2>
            <div className="mt-3 flex flex-col gap-2">
              {data.agenda.map((session) => (
                <div key={session.id} className="flex flex-wrap items-center gap-2">
                  <input
                    type="time"
                    aria-label={`Jam mulai ${session.title}`}
                    className={`${INP} w-[6.5rem]`}
                    value={session.start}
                    onChange={(e) => patchAgenda(session.id, "start", e.target.value)}
                  />
                  <input
                    type="time"
                    aria-label={`Jam selesai ${session.title}`}
                    className={`${INP} w-[6.5rem]`}
                    value={session.end}
                    onChange={(e) => patchAgenda(session.id, "end", e.target.value)}
                  />
                  <input
                    aria-label="Judul sesi"
                    className={`${INP} min-w-0 flex-1`}
                    value={session.title}
                    onChange={(e) => patchAgenda(session.id, "title", e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={`Hapus sesi ${session.title}`}
                    onClick={() =>
                      patch(
                        "agenda",
                        data.agenda.filter((item) => item.id !== session.id),
                      )
                    }
                    className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#F7F4FF] text-[#8F8A9E] hover:text-[#6D4AFF]"
                  >
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                patch("agenda", [
                  ...data.agenda,
                  {
                    id: Date.now(),
                    start: "10:00",
                    end: "11:00",
                    title: "Sesi baru",
                  },
                ])
              }
              className="mt-3 text-xs font-medium text-[#6D4AFF]"
            >
              + Tambah sesi
            </button>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Pendaftaran</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field label="Harga tiket">
                <input
                  className={INP}
                  value={data.registration.price}
                  onChange={(e) =>
                    patchGroup("registration", "price", e.target.value)
                  }
                />
              </Field>
              <Field label="Kuota peserta">
                <input
                  type="number"
                  min={0}
                  className={INP}
                  value={data.registration.quota}
                  onChange={(e) =>
                    patchGroup("registration", "quota", Number(e.target.value))
                  }
                />
              </Field>
              <Field label="Batas pendaftaran">
                <input
                  type="date"
                  className={INP}
                  value={data.registration.deadline}
                  onChange={(e) =>
                    patchGroup("registration", "deadline", e.target.value)
                  }
                />
              </Field>
              <Field label="Teks tombol">
                <input
                  className={INP}
                  value={data.registration.cta}
                  onChange={(e) =>
                    patchGroup("registration", "cta", e.target.value)
                  }
                />
              </Field>
              <Field label="Kontak panitia (WhatsApp)" className="sm:col-span-2">
                <input
                  className={INP}
                  value={data.registration.whatsapp}
                  onChange={(e) =>
                    patchGroup("registration", "whatsapp", e.target.value)
                  }
                />
              </Field>
            </div>

            <div className="mt-4 border-t border-[#F3F0FA] pt-3">
              <p className="text-xs font-semibold">Field formulir</p>
              <p className="mt-1 text-xs text-[#A8A3B5]">
                Nama lengkap dan email selalu wajib.
              </p>
              <div className="mt-2 divide-y divide-[#F7F4FD]">
                <Toggle
                  title="No. WhatsApp"
                  hint="Untuk pengingat acara"
                  checked={data.fields.whatsapp}
                  onChange={() => toggleField("whatsapp")}
                />
                <Toggle
                  title="Instansi / kampus"
                  hint="Ditampilkan di data Peserta"
                  checked={data.fields.institution}
                  onChange={() => toggleField("institution")}
                />
                <Toggle
                  title="Pekerjaan"
                  hint="Opsional"
                  checked={data.fields.job}
                  onChange={() => toggleField("job")}
                />
              </div>
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Tampilan Bagian</h2>
            <div className="mt-2 divide-y divide-[#F7F4FD]">
              <Toggle
                title="Sisa kuota"
                hint="Tampilkan jumlah kursi tersisa di hero"
                checked={data.sections.quota}
                onChange={() => toggleSection("quota")}
              />
              <Toggle
                title="Hitung mundur"
                hint="Waktu tersisa sampai acara dimulai"
                checked={data.sections.countdown}
                onChange={() => toggleSection("countdown")}
              />
              <Toggle
                title="Agenda"
                hint="Tampilkan susunan acara"
                checked={data.sections.agenda}
                onChange={() => toggleSection("agenda")}
              />
              <Toggle
                title="Pembicara"
                hint="Tampilkan profil trainer"
                checked={data.sections.speaker}
                onChange={() => toggleSection("speaker")}
              />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 xl:sticky xl:top-[5.5rem]">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Pratinjau</h2>
            <div className="flex rounded-full border border-[#EDE9F7] bg-white p-0.5 text-[11px]">
              {(["desktop", "mobile"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDevice(mode)}
                  className={`rounded-full px-3 py-1.5 capitalize transition ${
                    device === mode
                      ? "bg-[#F1EAFF] font-medium text-[#6D4AFF]"
                      : "text-[#8F8A9E]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EDE9F7] bg-white p-3">
            <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-[#FBFAFE] px-3 py-2">
              <span className="size-1.5 rounded-full bg-[#E5E1EF]" />
              <span className="size-1.5 rounded-full bg-[#E5E1EF]" />
              <span className="size-1.5 rounded-full bg-[#E5E1EF]" />
              <span className="ml-1.5 truncate text-[10px] text-[#8F8A9E]">
                {demoEvent.registrationUrl}
              </span>
            </div>
            <div className="max-h-[calc(100vh-12rem)] overflow-y-auto rounded-xl border border-[#F1EDFA]">
              <div
                className={
                  device === "desktop" ? "w-full" : "mx-auto w-full max-w-[300px]"
                }
              >
                <LandingPreview data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
