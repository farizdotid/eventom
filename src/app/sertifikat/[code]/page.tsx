import { Suspense } from "react";
import { CertificateSheet } from "@/components/certificate-sheet";
import { PrintButton } from "@/components/print-button";
import { PublicCard } from "@/components/public-card";
import { verifyCertificate } from "@/lib/supabase/queries/public";

async function CertificateContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = await verifyCertificate(decodeURIComponent(code));

  if (!result.ok) {
    return (
      <PublicCard>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Sertifikat tidak tersedia
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6578]">
          {result.message}
        </p>
      </PublicCard>
    );
  }

  return (
    <main className="min-h-screen bg-[#F1EEF6] px-4 py-6 print:bg-white print:p-0">
      <div className="mx-auto w-full max-w-[1040px]">
        <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
          <a
            href={`/verify/${encodeURIComponent(code)}`}
            className="text-sm font-medium text-[#6D4AFF] hover:underline"
          >
            Lihat halaman verifikasi
          </a>
          <PrintButton />
        </div>

        <div className="mt-4 overflow-x-auto print:mt-0 print:overflow-visible">
          <CertificateSheet
            name={result.name}
            number={result.number}
            config={result.config}
            verifyUrl={`${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/verify/${encodeURIComponent(code)}`}
            footer={result.issueDate ?? result.eventName}
          />
        </div>

        <p className="mt-3 text-center text-xs text-[#8F8A9E] print:hidden">
          Ukuran A4 landscape. Pilih &quot;Save as PDF&quot; di dialog cetak.
        </p>
      </div>

      <style>{`@page { size: A4 landscape; margin: 0 } @media print { body { background: #fff } }`}</style>
    </main>
  );
}

export default function CertificatePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F1EEF6] px-4 py-10">
          <div className="mx-auto h-[70vh] w-full max-w-[1040px] animate-pulse rounded-2xl bg-white/70" />
        </main>
      }
    >
      <CertificateContent params={params} />
    </Suspense>
  );
}
