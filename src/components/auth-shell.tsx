import Link from "next/link";

const FEATURES = [
  {
    title: "Landing page siap pakai",
    text: "Tema, agenda, dan formulir pendaftaran tanpa coding.",
  },
  {
    title: "Presensi QR realtime",
    text: "Peserta scan, log kehadiran langsung masuk.",
  },
  {
    title: "Sertifikat otomatis",
    text: "Hanya untuk yang hadir, lengkap dengan kode verifikasi.",
  },
];

export const AUTH_INPUT =
  "w-full rounded-xl border border-[#E7E1F3] bg-white px-3.5 py-3 text-sm text-[#171321] outline-none transition placeholder:text-[#767080] focus:border-[#6D4AFF] focus:ring-4 focus:ring-[#6D4AFF]/10";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="flex min-h-[100dvh] flex-1 bg-[#F7F5FB] text-[#171321]">
      <div className="flex w-full flex-col justify-center px-5 py-10 sm:px-10 lg:w-[52%] lg:px-16">
        <div className="mx-auto w-full max-w-[420px]">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-[#6D4AFF] text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="size-4.5" aria-hidden>
                <path d="M3 5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-13Zm0 3.5h18M9 9v11" />
              </svg>
            </span>
            <span className="text-[17px] font-semibold tracking-tight">Eventom</span>
          </Link>

          <h1 className="mt-8 text-[30px] font-semibold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[#6B6578]">{description}</p>

          <div className="mt-7">{children}</div>

          <div className="mt-6 text-sm text-[#6B6578]">{footer}</div>
        </div>
      </div>

      <aside className="relative hidden overflow-hidden bg-[#221A3B] p-12 lg:flex lg:w-[48%] lg:flex-col lg:justify-center xl:p-16">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-28 top-1/5 size-[440px] rounded-full bg-[#6D4AFF]/35 blur-[130px]" />
          <div className="absolute -right-20 bottom-0 size-[380px] rounded-full bg-[#F3A6D0]/20 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[460px]">
          <h2 className="text-[30px] font-semibold leading-[1.15] tracking-tight text-white xl:text-[34px]">
            Kelola event dari pendaftaran sampai sertifikat.
          </h2>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-white/70">
            Satu dasbor untuk panitia: data peserta, kehadiran di lokasi, dan
            sertifikat yang bisa diverifikasi.
          </p>

          <ul className="mt-10 space-y-6">
            {FEATURES.map((feature, index) => (
              <li key={feature.title} className="flex gap-4">
                <span className="mt-0.5 font-mono text-[11px] text-[#C9B6FF]">
                  0{index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{feature.title}</p>
                  <p className="mt-0.5 text-[13px] leading-relaxed text-white/70">
                    {feature.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-12 border-t border-white/10 pt-4 text-[11px] text-white/60">
            Demo mode tersedia, tidak perlu project Supabase.
          </p>
        </div>
      </aside>
    </main>
  );
}
