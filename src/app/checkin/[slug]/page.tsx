import { Suspense } from "react";
import { CheckinForm } from "@/components/checkin-form";
import { getPublicEvent } from "@/lib/supabase/queries/public";

const dateFormat = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F5FB] px-4 py-10 text-[#171321]">
      <div className="w-full max-w-md rounded-3xl border border-[#EDE9F7] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(23,19,33,0.25)]">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-[#6D4AFF] text-sm font-semibold text-white">
            E
          </span>
          <span className="text-sm font-semibold tracking-tight">Eventom</span>
        </div>
        {children}
      </div>
    </main>
  );
}

async function CheckinContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getPublicEvent(slug);

  if (!event) {
    return (
      <Shell>
        <h1 className="mt-6 text-xl font-semibold tracking-tight">
          Acara tidak ditemukan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6B6578]">
          QR ini mungkin sudah kedaluwarsa atau acaranya belum dibuka panitia.
          Minta panitia menampilkan QR terbaru.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <p className="mt-6 text-[11px] font-medium uppercase tracking-wide text-[#8F8A9E]">
        Presensi acara
      </p>
      <h1 className="mt-1 text-xl font-semibold tracking-tight">{event.name}</h1>

      <div className="mt-3 space-y-1 text-sm text-[#6B6578]">
        {event.startAt && <p>{dateFormat.format(new Date(event.startAt))} WIB</p>}
        {event.location && <p>{event.location}</p>}
      </div>

      <CheckinForm slug={event.slug} />

      <p className="mt-5 text-[11px] leading-relaxed text-[#A8A3B5]">
        Masukkan kode unik yang dikirim ke email pendaftaran. Satu kode hanya bisa
        dipakai sekali.
      </p>
    </Shell>
  );
}

export default function CheckinPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <Shell>
          <div className="mt-6 h-5 w-2/3 animate-pulse rounded-full bg-[#F1EDFA]" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded-full bg-[#F1EDFA]" />
          <div className="mt-6 h-12 animate-pulse rounded-xl bg-[#F1EDFA]" />
        </Shell>
      }
    >
      <CheckinContent params={params} />
    </Suspense>
  );
}
