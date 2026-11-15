import { Suspense } from "react";
import { DashboardGuard } from "@/components/dashboard-guard";
import { ParticipantsTable } from "@/components/participants-table";

export default function PesertaPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-tight">Peserta</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            title="Belum tersambung ke backend"
            className="flex items-center gap-2 rounded-full border border-[#EDE9F7] bg-white px-4 py-2 text-sm font-medium text-[#3B3647] hover:bg-[#FBFAFE]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="size-4" aria-hidden>
              <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />
            </svg>
            Export Excel
          </button>
          <button
            type="button"
            title="Belum tersambung ke backend"
            className="flex items-center gap-2 rounded-full bg-[#6D4AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5B3AEB]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="size-4" aria-hidden>
              <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 13h5M10 17h5" />
            </svg>
            Unduh Semua Sertifikat
          </button>
        </div>
      </div>

      <ParticipantsTable />
    </div>
  );
}
