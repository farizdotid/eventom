import { Suspense } from "react";
import { PublicCard } from "@/components/public-card";
import { verifyCertificate } from "@/lib/supabase/queries/public";

async function VerifyContent({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const result = await verifyCertificate(decodeURIComponent(code));

  if (!result.ok) {
    return (
      <PublicCard>
        <div className="mt-6 grid size-11 place-items-center rounded-full bg-[#FEF2F2] text-[#DC2626]">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            strokeLinecap="round"
            className="size-5"
            aria-hidden
          >
            <path d="M12 8v5M12 16.5h.01M12 3l9 16H3z" />
          </svg>
        </div>
        <h1 className="mt-4 text-xl font-semibold tracking-tight">
          Sertifikat tidak terverifikasi
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6578]">
          {result.message}
        </p>
        <p className="mt-5 text-[11px] leading-relaxed text-[#A8A3B5]">
          Kode ada di bagian bawah sertifikat. Hubungi panitia kalau menurutmu ini
          keliru.
        </p>
      </PublicCard>
    );
  }

  return (
    <PublicCard>
      <div className="mt-6 grid size-11 place-items-center rounded-full bg-[#E9F9EF] text-[#16A34A]">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5"
          aria-hidden
        >
          <path d="m5 12.5 4.5 4.5L19 7" />
        </svg>
      </div>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">
        Sertifikat terverifikasi
      </h1>
      <p className="mt-1 text-sm text-[#6B6578]">Diterbitkan oleh Eventom.</p>

      <dl className="mt-5 divide-y divide-[#F3F0FA] rounded-2xl border border-[#EDE9F7] bg-[#FBFAFE] px-4">
        <div className="py-3">
          <dt className="text-[11px] text-[#8F8A9E]">Nama peserta</dt>
          <dd className="mt-0.5 text-sm font-medium">{result.name}</dd>
        </div>
        <div className="py-3">
          <dt className="text-[11px] text-[#8F8A9E]">Acara</dt>
          <dd className="mt-0.5 text-sm font-medium">{result.eventName}</dd>
        </div>
        <div className="py-3">
          <dt className="text-[11px] text-[#8F8A9E]">Nomor sertifikat</dt>
          <dd className="mt-0.5 font-mono text-sm">{result.number}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 py-3">
          <div>
            <dt className="text-[11px] text-[#8F8A9E]">Kehadiran</dt>
            <dd className="mt-0.5 text-sm font-medium">{result.status}</dd>
          </div>
          {result.issueDate && (
            <p className="text-right text-[11px] text-[#8F8A9E]">
              {result.issueDate}
            </p>
          )}
        </div>
      </dl>
    </PublicCard>
  );
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <Suspense
      fallback={
        <PublicCard>
          <div className="mt-6 size-11 animate-pulse rounded-full bg-[#F1EDFA]" />
          <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-[#F1EDFA]" />
          <div className="mt-5 h-40 animate-pulse rounded-2xl bg-[#F1EDFA]" />
        </PublicCard>
      }
    >
      <VerifyContent params={params} />
    </Suspense>
  );
}
