import { Suspense } from "react";
import { CertificateSheet } from "@/components/certificate-sheet";
import { DashboardGuard } from "@/components/dashboard-guard";
import { PrintButton } from "@/components/print-button";
import { demoCertificateConfig } from "@/lib/demo-data";
import { demoParticipantRows } from "@/lib/demo-rows";
import { isDemoMode } from "@/lib/demo";
import { getCertificate } from "@/lib/supabase/queries/certificates";
import { getMyEvent } from "@/lib/supabase/queries/events";
import { getParticipants } from "@/lib/supabase/queries/participants";

/**
 * Satu lembar per peserta yang hadir, siap dicetak sekaligus (Save as PDF).
 * Nomor urut dibaca dari `participants.cert_seq` (dibekukan saat pendaftaran),
 * jadi sama persis dengan nomor di halaman verifikasi.
 */
async function SheetContent() {
  const demo = isDemoMode();
  const [certificate, people, event] = demo
    ? [{ config: demoCertificateConfig }, demoParticipantRows(), null]
    : await Promise.all([getCertificate(), getParticipants(), getMyEvent()]);

  const config = certificate.config;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const footer = config.issueDate || event?.name || config.title;

  const ordered = [...people].sort((a, b) =>
    a.registeredAt === b.registeredAt
      ? a.id.localeCompare(b.id)
      : a.registeredAt < b.registeredAt
        ? -1
        : 1,
  );

  const recipients = config.rules.attendedOnly
    ? ordered.filter((person) => person.status !== "Belum hadir")
    : ordered;

  if (recipients.length === 0) {
    return (
      <p className="rounded-2xl border border-[#EDE9F7] bg-white p-6 text-sm text-[#8F8A9E]">
        Belum ada peserta yang hadir. Cetak sertifikat tersedia setelah check-in.
      </p>
    );
  }

  return (
    <main className="print:bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div>
          <h1 className="text-[26px] font-semibold tracking-tight">Cetak sertifikat</h1>
          <p className="mt-0.5 text-xs text-[#8F8A9E]">
            {recipients.length} lembar · A4 landscape · nomor urut tetap per peserta
          </p>
        </div>
        <PrintButton label="Cetak semua" />
      </div>

      <div className="mt-5 space-y-6 print:mt-0 print:space-y-0">
        {recipients.map((person, index) => (
          <div
            key={person.id}
            className={
              index === 0
                ? "overflow-x-auto print:overflow-visible"
                : "overflow-x-auto break-before-page print:overflow-visible"
            }
          >
            <CertificateSheet
              name={person.name}
              number={config.numberFormat.replace(
                "{no}",
                String(person.certSeq ?? 0).padStart(4, "0"),
              )}
              config={config}
              verifyUrl={`${base}/verify/${encodeURIComponent(person.code)}`}
              footer={footer}
            />
          </div>
        ))}
      </div>

      <style>{`@page { size: A4 landscape; margin: 0 } @media print { body { background: #fff } }`}</style>
    </main>
  );
}

export default function CetakSertifikatPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>
      <Suspense
        fallback={
          <div className="mx-auto h-[70vh] w-full max-w-[1040px] animate-pulse rounded-2xl bg-white/60" />
        }
      >
        <SheetContent />
      </Suspense>
    </>
  );
}
