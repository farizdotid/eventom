import Link from "next/link";

// Ringkasan fitur Eventom. Statis — tidak perlu data dari DB.
const features = [
  {
    title: "Pendaftaran online",
    description:
      "Formulir publik per acara, kuota dan batas tanggal dijaga di server. Email ganda dan kuota penuh ditolak otomatis.",
  },
  {
    title: "Presensi QR",
    description:
      "Peserta tunjukkan kode unik, panitia scan lewat halaman check-in. Tanpa login tambahan.",
  },
  {
    title: "Sertifikat otomatis",
    description:
      "Nomor urut dibekukan per peserta, cetak satuan atau massal, langsung ke PDF lewat dialog cetak browser.",
  },
  {
    title: "Verifikasi publik",
    description:
      "Setiap sertifikat punya halaman keaslian yang bisa dibuka siapa saja lewat kode peserta.",
  },
];

const steps = [
  "Buat acara dan isi halaman publiknya.",
  "Bagikan tautan pendaftaran dan pantau peserta.",
  "Scan kode peserta di lokasi, lalu terbitkan sertifikat.",
];

export default function Home() {
  return (
    <div
      className="flex flex-1 flex-col overflow-x-hidden"
      style={{ "--accent": "#6D4AFF", "--soft": "#F1EAFF" } as React.CSSProperties}
    >
      <header className="sticky top-0 z-20 border-b border-[#F3F0FA] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--accent)] text-xs font-semibold text-white">
              E
            </span>
            <span className="truncate text-sm font-semibold tracking-tight">Eventom</span>
          </div>
          <nav className="flex shrink-0 items-center gap-2 text-sm">
            <Link
              href="/login"
              className="rounded-full px-3 py-2 font-medium text-[#4B4657] hover:bg-[#F4F1FB]"
            >
              Masuk
            </Link>
            <Link
              href="/signup"
              className="whitespace-nowrap rounded-full bg-[var(--accent)] px-3.5 py-2 text-[13px] font-medium text-white hover:opacity-90 sm:px-4 sm:text-sm"
            >
              Daftar gratis
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-10 md:grid-cols-[1.1fr_1fr] md:items-center md:py-16">
          <div className="min-w-0">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
              Event management · pendaftaran · presensi · sertifikat
            </span>

            <h1 className="mt-4 text-balance text-[28px] font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              Kelola acara dari pendaftaran sampai sertifikat
            </h1>

            <p className="mt-3 text-[15px] leading-relaxed text-[#5B5568]">
              Satu tempat untuk menyebar halaman acara, menerima pendaftar,
              memindai kehadiran, dan menerbitkan sertifikat yang bisa
              diverifikasi siapa saja.
            </p>

            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/signup"
                className="block w-full rounded-xl bg-[var(--accent)] px-5 py-3 text-center text-sm font-medium text-white hover:opacity-90 sm:w-auto"
              >
                Mulai kelola acara
              </Link>
              <Link
                href="/e/uiux-batch-3"
                className="block w-full rounded-xl border border-[#EDE9F7] px-5 py-3 text-center text-sm font-medium text-[#4B4657] hover:bg-[#FBFAFE] sm:w-auto"
              >
                Lihat contoh acara
              </Link>
            </div>

            <p className="mt-3 text-xs text-[#8F8A9E]">
              Sudah punya akun?{" "}
              <Link href="/login" className="underline">
                Masuk
              </Link>
              .
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-[#EDE9F7] bg-[#FBFAFE] p-5">
            <p className="text-xs font-medium text-[#8F8A9E]">Alur kerja</p>
            <ol className="mt-3 space-y-3">
              {steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm text-[#4B4657]">
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--soft)] text-xs font-semibold text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <span className="min-w-0 break-words">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-t border-[#F3F0FA]">
          <div className="mx-auto w-full max-w-5xl px-5 py-10 md:py-14">
            <h2 className="text-lg font-semibold tracking-tight">Yang sudah tersedia</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {features.map((feature) => (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-[#EDE9F7] p-5"
                >
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[#5B5568]">
                    {feature.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#F3F0FA] py-6 text-center text-xs text-[#8F8A9E]">
        Eventom — dibuat dengan Next.js dan Supabase.
      </footer>
    </div>
  );
}
