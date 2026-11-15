import Link from "next/link";
import { Suspense } from "react";
import { AUTH_INPUT, AuthShell } from "@/components/auth-shell";
import { signup } from "../login/actions";

// Shows `?error=` / `?message=` set by the signup action.
// Own component + <Suspense>: searchParams is dynamic (cacheComponents).
async function Feedback({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  if (error) {
    return (
      <p
        role="alert"
        className="mb-4 rounded-xl border border-[#F6C9C9] bg-[#FDF0F0] px-4 py-3 text-sm text-[#B42318]"
      >
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p
        role="status"
        className="mb-4 rounded-xl border border-[#BFE7CE] bg-[#F0FAF3] px-4 py-3 text-sm text-[#16794A]"
      >
        {message}
      </p>
    );
  }
  return null;
}

export default function SignupPage({ searchParams }: PageProps<"/signup">) {
  return (
    <AuthShell
      title="Buat akun panitia"
      description="Gratis untuk satu event pertamamu."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-[#6D4AFF] underline-offset-4 hover:underline"
          >
            Masuk
          </Link>
        </>
      }
    >
      <Suspense>
        <Feedback
          searchParams={searchParams as Promise<{ error?: string; message?: string }>}
        />
      </Suspense>

      <form action={signup} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-[#6B6578]">Email</span>
          <input
            name="email"
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
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Minimal 6 karakter"
            className={AUTH_INPUT}
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#6D4AFF] py-3 text-sm font-semibold text-white transition hover:bg-[#5B3AEB] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#6D4AFF]/30 active:translate-y-px"
        >
          Buat akun
        </button>
      </form>

      <p className="mt-5 text-[11px] leading-relaxed text-[#A8A3B5]">
        Di mode demo, signup hanya menerima data tanpa disimpan. Akun asli butuh
        koneksi Supabase.
      </p>
    </AuthShell>
  );
}
