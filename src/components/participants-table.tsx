"use client";

import { useMemo, useState } from "react";
import type { ParticipantRow } from "@/lib/supabase/queries/participants";
import type { ParticipantStatus } from "@/types/database.types";

const PAGE_SIZE = 10;

const AVATARS = [
  "bg-[#EDE4FF] text-[#6D4AFF]",
  "bg-[#FCE7F3] text-[#BE185D]",
  "bg-[#E0F2FE] text-[#0369A1]",
  "bg-[#DCFCE7] text-[#15803D]",
  "bg-[#FEF3C7] text-[#B45309]",
  "bg-[#FFE4E6] text-[#BE123C]",
];

const STATUS_STYLE: Record<ParticipantStatus, string> = {
  Hadir: "bg-[#E9F9EF] text-[#16A34A]",
  Terlambat: "bg-[#F1EAFF] text-[#6D4AFF]",
  "Belum hadir": "bg-[#F4F1FB] text-[#8F8A9E]",
};

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const timeFormat = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Asia/Jakarta",
});

const TABS = ["Semua", "Hadir", "Belum hadir"] as const;
type Tab = (typeof TABS)[number];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export function ParticipantsTable({
  participants,
}: {
  participants: ParticipantRow[];
}) {
  const [tab, setTab] = useState<Tab>("Semua");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(
    () => ({
      Semua: participants.length,
      Hadir: participants.filter((p) => p.status !== "Belum hadir").length,
      "Belum hadir": participants.filter((p) => p.status === "Belum hadir").length,
    }),
    [participants],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return participants.filter((p) => {
      const matchTab =
        tab === "Semua" ||
        (tab === "Hadir" ? p.status !== "Belum hadir" : p.status === "Belum hadir");
      const matchQuery =
        !needle ||
        `${p.name} ${p.email} ${p.org ?? ""}`.toLowerCase().includes(needle);
      return matchTab && matchQuery;
    });
  }, [participants, tab, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const firstRow = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const lastRow = Math.min(currentPage * PAGE_SIZE, filtered.length);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#EDE9F7] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-1 rounded-full bg-[#F6F3FC] p-1 text-xs">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setTab(item);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                tab === item
                  ? "bg-white font-medium text-[#171321] shadow-sm ring-1 ring-[#EDE9F7]"
                  : "text-[#6B6578]"
              }`}
            >
              {item}
              <span className="text-[#A8A3B5]">{counts[item]}</span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
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
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari nama, email, instansi"
            className="w-full rounded-full border border-[#EDE9F7] bg-[#FBFAFE] py-2 pl-9 pr-3 text-xs outline-none placeholder:text-[#A8A3B5] focus:border-[#C9B6FF] focus:bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm lg:min-w-[820px]">
          <thead>
            <tr className="border-y border-[#F3F0FA] bg-[#FCFBFE] text-left text-[10px] uppercase tracking-wide text-[#A8A3B5]">
              <th className="hidden w-10 py-2.5 pl-4 sm:table-cell">
                <input type="checkbox" aria-label="Pilih semua peserta" className="size-3.5 rounded border-[#D9D3E8]" />
              </th>
              <th className="py-2.5 pl-4 font-medium sm:pl-0">Peserta</th>
              <th className="hidden py-2.5 font-medium md:table-cell">Instansi</th>
              <th className="hidden py-2.5 font-medium lg:table-cell">Kode unik</th>
              <th className="hidden py-2.5 font-medium xl:table-cell">No. HP</th>
              <th className="hidden py-2.5 font-medium sm:table-cell">Tgl daftar</th>
              <th className="py-2.5 font-medium">Kehadiran</th>
              <th className="hidden py-2.5 pr-4 text-right font-medium sm:table-cell">Sertifikat</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((person, i) => (
              <tr key={person.id} className="border-b border-[#F6F3FC]">
                <td className="hidden py-3 pl-4 sm:table-cell">
                  <input
                    type="checkbox"
                    aria-label={`Pilih ${person.name}`}
                    className="size-3.5 rounded border-[#D9D3E8]"
                  />
                </td>
                <td className="py-3 pl-4 pr-3 sm:pl-0 sm:pr-4">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`grid size-8 shrink-0 place-items-center rounded-full text-[10px] font-semibold ${AVATARS[i % AVATARS.length]}`}
                    >
                      {initials(person.name)}
                    </span>
                    <div className="min-w-0 max-w-[170px] sm:max-w-none">
                      <p className="truncate font-medium">{person.name}</p>
                      <p className="truncate text-xs text-[#8F8A9E]">{person.email}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden max-w-[180px] py-3 pr-4 md:table-cell">
                  <span className="block truncate text-xs text-[#4B4657]">{person.org ?? "-"}</span>
                </td>
                <td className="hidden py-3 pr-4 lg:table-cell">
                  <span className="rounded-md bg-[#F6F3FC] px-2 py-1 font-mono text-[10px] text-[#6B6578]">
                    {person.code}
                  </span>
                </td>
                <td className="hidden py-3 pr-4 text-xs text-[#4B4657] xl:table-cell">
                  {person.phone ?? "-"}
                </td>
                <td className="hidden whitespace-nowrap py-3 pr-4 sm:table-cell">
                  <p className="text-xs">{dateFormat.format(new Date(person.registeredAt))}</p>
                  <p className="text-[11px] text-[#8F8A9E]">
                    {timeFormat.format(new Date(person.registeredAt))} WIB
                  </p>
                </td>
                <td className="py-3 pr-3 sm:pr-4">
                  <span
                    className={`inline-block rounded-md px-2 py-1 text-[11px] font-medium ${STATUS_STYLE[person.status]}`}
                  >
                    {person.status}
                  </span>
                </td>
                <td className="hidden py-3 pr-4 text-right sm:table-cell">
                  {person.status === "Belum hadir" ? (
                    <span className="text-[11px] text-[#A8A3B5]">Belum tersedia</span>
                  ) : (
                    <button
                      type="button"
                      aria-label={`Unduh sertifikat ${person.name}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#EDE9F7] bg-white px-2.5 py-1.5 text-[11px] font-medium text-[#6D4AFF] hover:bg-[#F7F4FF]"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="size-3.5" aria-hidden>
                        <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />
                      </svg>
                      <span className="hidden sm:inline">Unduh</span>
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-sm text-[#8F8A9E]">
                  Tidak ada peserta yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#F3F0FA] px-4 py-3">
        <p className="text-xs text-[#8F8A9E]">
          Menampilkan {firstRow}–{lastRow} dari {filtered.length} peserta
        </p>
        <div className="flex flex-wrap items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            className="rounded-lg border border-[#EDE9F7] px-3 py-1.5 disabled:opacity-40"
          >
            Sebelumnya
          </button>
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={`size-8 rounded-lg border ${
                number === currentPage
                  ? "border-[#6D4AFF] bg-[#6D4AFF] font-medium text-white"
                  : "border-[#EDE9F7] hover:bg-[#F7F4FF]"
              }`}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            disabled={currentPage === pageCount}
            className="rounded-lg border border-[#EDE9F7] px-3 py-1.5 disabled:opacity-40"
          >
            Berikutnya
          </button>
        </div>
      </div>
    </div>
  );
}
