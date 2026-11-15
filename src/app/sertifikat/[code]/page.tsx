import { Suspense } from "react";
import { CertificateQr } from "@/components/certificate-qr";
import { PrintButton } from "@/components/print-button";
import { PublicCard } from "@/components/public-card";
import { CERTIFICATE_TEMPLATES } from "@/lib/demo-data";
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

  const config = result.config;
  const template =
    CERTIFICATE_TEMPLATES.find((item) => item.id === config.template) ??
    CERTIFICATE_TEMPLATES[0];
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/verify/${encodeURIComponent(code)}`;

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
          <div
            className="mx-auto flex aspect-[297/210] w-[1000px] flex-col justify-between rounded-2xl p-12 shadow-[0_30px_80px_-40px_rgba(23,19,33,0.35)] print:h-[210mm] print:w-[297mm] print:rounded-none print:p-[18mm] print:shadow-none"
            style={{
              background: template.background,
              border: `1px solid ${template.accent}22`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="grid size-7 place-items-center rounded-md text-xs font-semibold text-white"
                  style={{ backgroundColor: template.accent }}
                >
                  E
                </span>
                <span className="text-xs font-semibold tracking-tight text-[#5B5568]">
                  Eventom
                </span>
              </div>
              <span className="font-mono text-[11px] text-[#8F8A9E]">
                {result.number}
              </span>
            </div>

            <div className="px-8 text-center">
              <p
                className="text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ color: template.accent }}
              >
                {config.title}
              </p>
              <p className="mt-3 text-sm text-[#5B5568]">{config.intro}</p>
              <p
                className="mt-2 text-[42px] font-semibold leading-tight tracking-tight"
                style={{ color: "#171321" }}
              >
                {result.name}
              </p>
              <div
                className="mx-auto mt-3 h-px w-40"
                style={{ backgroundColor: `${template.accent}55` }}
              />
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#4B4657]">
                {config.description}
              </p>
            </div>

            <div className="flex items-end justify-between gap-6">
              <div className="flex gap-10">
                {config.signers.map((signer) => (
                  <div key={signer.name} className="text-center">
                    <div
                      className="mb-1 h-8 w-32 border-b"
                      style={{ borderColor: `${template.accent}55` }}
                    />
                    <p className="text-xs font-semibold">{signer.name}</p>
                    <p className="text-[10px] text-[#8F8A9E]">{signer.role}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-end gap-1">
                {config.rules.showVerification && (
                  <CertificateQr value={verifyUrl} />
                )}
                <p className="text-[10px] text-[#8F8A9E]">
                  {result.issueDate ?? result.eventName}
                </p>
              </div>
            </div>
          </div>
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
