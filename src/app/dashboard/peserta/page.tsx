import { Suspense } from "react";
import { DashboardGuard } from "@/components/dashboard-guard";
import { ParticipantsTable } from "@/components/participants-table";
import { isDemoMode } from "@/lib/demo";
import { demoParticipantRows } from "@/lib/demo-rows";
import { getParticipants, type ParticipantRow } from "@/lib/supabase/queries/participants";

const HEADER_BUTTON =
  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium";

function Skeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#EDE9F7] bg-white">
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="h-8 w-64 animate-pulse rounded-full bg-[#F6F3FC]" />
        <div className="h-8 w-full max-w-64 animate-pulse rounded-full bg-[#F6F3FC]" />
      </div>
      <div className="h-[420px] animate-pulse bg-[#FBFAFE]" />
    </div>
  );
}

async function loadParticipants(): Promise<ParticipantRow[]> {
  return isDemoMode() ? demoParticipantRows() : getParticipants();
}

async function ParticipantsContent() {
  const participants = await loadParticipants();
  return <ParticipantsTable participants={participants} />;
}

export default function PesertaPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-tight">Peserta</h1>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/dashboard/peserta/export"
            className={`${HEADER_BUTTON} border border-[#EDE9F7] bg-white text-[#3B3647] hover:bg-[#FBFAFE]`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="size-4" aria-hidden>
              <path d="M12 4v10m0 0 4-4m-4 4-4-4M5 19h14" />
            </svg>
            Export CSV
          </a>
          <button
            type="button"
            title="Belum tersambung ke backend"
            className={`${HEADER_BUTTON} bg-[#6D4AFF] text-white hover:bg-[#5B3AEB]`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="size-4" aria-hidden>
              <path d="M7 3h7l4 4v14H7zM14 3v4h4M10 13h5M10 17h5" />
            </svg>
            Unduh Semua Sertifikat
          </button>
        </div>
      </div>

      <Suspense fallback={<Skeleton />}>
        <ParticipantsContent />
      </Suspense>
    </div>
  );
}
