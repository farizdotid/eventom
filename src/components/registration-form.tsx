"use client";

import { useState, useTransition } from "react";
import { submitRegistration } from "@/app/e/[slug]/actions";
import type { RegistrationResult } from "@/lib/supabase/queries/public";

const INPUT =
  "w-full rounded-xl border border-[#E4DFF2] bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-[#BDB7CC] focus:border-[#C9B6FF]";

export function RegistrationForm({
  slug,
  fields,
  cta,
}: {
  slug: string;
  fields: { whatsapp: boolean; institution: boolean; job: boolean };
  cta: string;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [copied, setCopied] = useState(false);

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const form = event.currentTarget;

    startTransition(async () => {
      const response = await submitRegistration({
        slug,
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        org: String(formData.get("org") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      });

      setResult(response);
      if (response.ok) form.reset();
    });
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-[#BBF0CF] bg-[#E9F9EF] p-5">
        <p className="text-sm font-semibold text-[#15803D]">Pendaftaran berhasil</p>
        <p className="mt-1 text-[13px] text-[#3F6B52]">
          Halo {result.name}, simpan kode unik ini untuk check-in di lokasi acara.
        </p>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-[#BBF0CF] bg-white px-4 py-3">
          <span className="flex-1 font-mono text-xl font-semibold tracking-widest text-[#171321]">
            {result.code}
          </span>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(result.code);
                setCopied(true);
                window.setTimeout(() => setCopied(false), 1500);
              } catch {
                // Clipboard diblokir: kode tetap terlihat di layar.
              }
            }}
            className="rounded-lg bg-[#171321] px-3 py-2 text-xs font-medium text-white hover:bg-[#2A2438]"
          >
            {copied ? "Tersalin" : "Salin"}
          </button>
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-[#3F6B52]">
          Kode ini juga dipakai untuk memverifikasi sertifikat setelah acara.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[#4B4657]">
          Nama lengkap
        </span>
        <input name="name" required autoComplete="name" className={INPUT} />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-[#4B4657]">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={INPUT}
        />
      </label>

      {fields.whatsapp && (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#4B4657]">
            No. WhatsApp
          </span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="08xx"
            className={INPUT}
          />
        </label>
      )}

      {fields.institution && (
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-[#4B4657]">
            Instansi / kampus
          </span>
          <input name="org" autoComplete="organization" className={INPUT} />
        </label>
      )}

      {result && !result.ok && (
        <p className="rounded-xl bg-[#FEF2F2] px-3 py-2 text-xs text-[#B91C1C]">
          {result.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Mengirim..." : cta}
      </button>
    </form>
  );
}
