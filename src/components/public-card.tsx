/** Kartu terpusat untuk halaman publik (check-in, verifikasi sertifikat). */
export function PublicCard({ children }: { children: React.ReactNode }) {
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
