"use client";

import { useState, useTransition } from "react";
import { checkInByCode, type CheckinResult } from "@/app/checkin/[slug]/actions";

export function CheckinForm({ slug }: { slug: string }) {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!code.trim()) return;

    startTransition(async () => {
      const response = await checkInByCode(slug, code);
      setResult(response);
      if (response.ok) setCode("");
    });
  }

  return (
    <div className="mt-6">
      <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
            setResult(null);
          }}
          autoComplete="off"
          autoCapitalize="characters"
          placeholder="UX3-XXXX"
          aria-label="Kode unik peserta"
          className="min-w-0 flex-1 rounded-xl border border-[#E4DFF2] bg-white px-4 py-3 text-center font-mono text-base uppercase tracking-wider outline-none placeholder:text-[#BDB7CC] focus:border-[#C9B6FF] sm:text-left"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[#6D4AFF] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#5B3AEB] disabled:opacity-60"
        >
          {pending ? "Memeriksa..." : "Check-In"}
        </button>
      </form>

      {result && (
        <div
          role="status"
          className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
            result.ok
              ? "border-[#BBF0CF] bg-[#E9F9EF] text-[#15803D]"
              : "border-[#FBD5D5] bg-[#FEF2F2] text-[#B91C1C]"
          }`}
        >
          <p className="font-medium">{result.ok ? "Check-in berhasil" : "Gagal"}</p>
          <p className="mt-0.5 text-[13px]">{result.message}</p>
        </div>
      )}
    </div>
  );
}
