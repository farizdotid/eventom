"use client";

export function PrintButton({ label = "Cetak / Simpan PDF" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-[#6D4AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5B3AEB]"
    >
      {label}
    </button>
  );
}
