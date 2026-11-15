import Link from "next/link";
import { Suspense } from "react";
import { AUTH_INPUT, AuthShell } from "@/components/auth-shell";
import { DEMO_USER, isDemoMode } from "@/lib/demo";
import { login } from "./actions";

// Reads `?error=` set by the login action.
// Isolated in its own component + <Suspense> because reading searchParams
// is dynamic; this keeps the rest of the page static (cacheComponents).
async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  if (!error) return null;

  return (
    <p
      role="alert"
      className="mb-4 rounded-xl border border-[#F6C9C9] bg-[#FDF0F0] px-4 py-3 text-sm text-[#B42318]"
    >
      {error}
    </p>
  );
}

export default function LoginPage({
  searchParams,
}: PageProps<"/login">) {
  return (
    <AuthShell
      title="Masuk ke Eventom"
      description="Kelola pendaftaran, presensi, dan sertifikat eventmu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#6D4AFF] underline-offset-4 hover:underline"
          >
            Buat akun
          </Link>
        </>
      }
    >
      {isDemoMode() && (
        <div className="mb-5 rounded-xl border border-[#E7DDFF] bg-[#F6F1FF] px-4 py-3">
          <p className="text-xs font-medium text-[#5B3AEB]">Mode demo aktif</p>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-[#4B4657]">
            <span>{DEMO_USER.email}</span>
            <span>{DEMO_USER.password}</span>
          </div>
          <p className="mt-1.5 text-[11px] text-[#8F8A9E]">
            Form sudah terisi otomatis, tinggal klik Masuk.
          </p>
        </div>
      )}

      <Suspense>
        <ErrorMessage searchParams={searchParams as Promise<{ error?: string }>} />
      </Suspense>

      <form action={login} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#6B6578]">Email</span>
          <input
            name="email"
            defaultValue={isDemoMode() ? DEMO_USER.email : undefined}
            type="email"
            required
            autoComplete="email"
            placeholder="nama@email.com"
            className={AUTH_INPUT}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#6B6578]">
            Password
          </span>
          <input
            name="password"
            defaultValue={isDemoMode() ? DEMO_USER.password : undefined}
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password akunmu"
            className={AUTH_INPUT}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6D4AFF] py-3 text-sm font-semibold text-white transition hover:bg-[#5B3AEB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30 active:translate-y-px"
        >
          Masuk
        </button>
      </form>

      <p className="mt-5 text-center text-[11px] text-[#A8A3B5]">
        Sesi demo disimpan di cookie browser, tidak dikirim ke server mana pun.
      </p>
    </AuthShell>
  );
}
