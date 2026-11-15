"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/app/(auth)/login/actions";
import { demoAdmin, demoEvent } from "@/lib/demo-data";

const ICONS = {
  ringkasan:
    "M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm0 3.5h18M9 9v11",
  landing:
    "M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm0 10.5 4.5-4.5a2 2 0 0 1 2.8 0L15 16m-1-2.5 1.7-1.7a2 2 0 0 1 2.8 0L21 14.3M8.5 8.5h.01",
  peserta:
    "M16 19v-1.5a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4V19M9 9.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM17 4.2a3.5 3.5 0 0 1 0 6.6M22 19v-1.5a4 4 0 0 0-3-3.9",
  presensi: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  sertifikat:
    "M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3 9 9M15 15l2.7 2.7M17.7 6.3 15 9M9 15l-2.7 2.7",
  search: "M20 20l-4.5-4.5M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
  bell: "M18 8.5a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6ZM10.5 18.5a1.8 1.8 0 0 0 3 0",
  panel: "M3 7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7Zm4 13V4",
  logout: "M9 21H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3h3m6 4 5 5-5 5m5-5H9",
} as const;

type IconName = keyof typeof ICONS;

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

type NavItem = { label: string; icon: IconName; href?: string };

const NAV: NavItem[] = [
  { label: "Ringkasan", icon: "ringkasan", href: "/dashboard" },
  { label: "Landing Page", icon: "landing", href: "/dashboard/landing" },
  { label: "Peserta", icon: "peserta", href: "/dashboard/peserta" },
  { label: "Presensi", icon: "presensi", href: "/dashboard/presensi" },
  { label: "Sertifikat", icon: "sertifikat", href: "/dashboard/sertifikat" },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const adminInisial = demoAdmin.name
    .split(" ")
    .map((part) => part[0])
    .join("");

  return (
    <div className="flex min-h-screen bg-[#F7F5FB] text-[#171321]">
      {drawerOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-[#171321]/25 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[236px] flex-col border-r border-[#EDE9F7] bg-white px-4 py-5 transition-[transform,width] duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[80px]" : "lg:w-[236px]"}`}
      >
        <div className="flex items-center gap-2.5 px-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#6D4AFF] text-white">
            <Icon name="ringkasan" className="size-4" />
          </span>
          <span
            className={`text-[15px] font-semibold tracking-tight ${collapsed ? "lg:hidden" : ""}`}
          >
            Eventom
          </span>
        </div>

        <nav className="mt-7 flex flex-col gap-1">
          {NAV.map((item) => {
            const active = item.href === pathname;
            const content = (
              <>
                <Icon name={item.icon} />
                <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
              </>
            );

            return item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition hover:bg-[#F7F4FF] ${
                  active
                    ? "bg-[#F1EAFF] font-medium text-[#6D4AFF]"
                    : "text-[#4B4657]"
                }`}
              >
                {content}
              </Link>
            ) : (
              <span
                key={item.label}
                title="Segera hadir"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[#4B4657] ${
                  collapsed ? "lg:justify-center" : ""
                }`}
              >
                {content}
              </span>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-xl bg-[#F6F0FF] p-3.5">
            <p className={`text-[11px] text-[#8F8A9E] ${collapsed ? "lg:hidden" : ""}`}>
              Link pendaftaran
            </p>
            <p
              className={`mt-0.5 truncate text-xs font-medium ${collapsed ? "lg:hidden" : ""}`}
            >
              {demoEvent.registrationUrl}
            </p>
            <button
              type="button"
              className={`mt-2.5 w-full rounded-lg bg-white py-2 text-xs font-medium text-[#6D4AFF] hover:bg-white/70 ${
                collapsed ? "lg:hidden" : ""
              }`}
            >
              Salin Link
            </button>
          </div>

          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs text-[#8F8A9E] hover:bg-[#F7F4FF] hover:text-[#6D4AFF]"
            >
              <Icon name="logout" className="size-4" />
              <span className={collapsed ? "lg:hidden" : ""}>Keluar</span>
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-[#EDE9F7] bg-white/85 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Ubah lebar menu"
            onClick={() => {
              setCollapsed((value) => !value);
              setDrawerOpen((value) => !value);
            }}
            className="grid size-9 shrink-0 place-items-center rounded-lg border border-[#EDE9F7] text-[#8F8A9E] hover:text-[#6D4AFF]"
          >
            <Icon name="panel" className="size-4.5" />
          </button>

          <div className="relative min-w-0 flex-1 max-w-md">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#A8A3B5]"
            />
            <input
              type="search"
              placeholder="Cari pendaftar, event..."
              className="w-full rounded-full border border-[#EDE9F7] bg-[#FBFAFE] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-[#A8A3B5] focus:border-[#C9B6FF] focus:bg-white"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              aria-label="Notifikasi"
              className="grid size-9 place-items-center rounded-full text-[#6C6879] hover:bg-[#F7F4FF]"
            >
              <Icon name="bell" className="size-5" />
            </button>
            <div className="hidden h-8 w-px bg-[#EDE9F7] sm:block" />
            <div className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-[#F7DCCB] text-xs font-semibold text-[#9A5B33]">
                {adminInisial}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium">{demoAdmin.name}</p>
                <p className="text-[11px] text-[#8F8A9E]">{demoAdmin.role}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 px-4 py-6 sm:px-6">{children}</div>
      </div>
    </div>
  );
}
