"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = ["image/png", "image/jpeg", "image/webp"];

/**
 * Unggah gambar ke bucket `event-assets/<event_id>/<kind>-<timestamp>.<ext>`
 * lalu kirim URL publiknya ke pemanggil. Dipakai banner, logo, dan tanda tangan.
 */
export function AssetUpload({
  eventId,
  kind,
  label,
  value,
  onChange,
}: {
  eventId: string;
  kind: string;
  label: string;
  value?: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    if (!TYPES.includes(file.type)) {
      setError("Format harus PNG, JPG, atau WebP.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Ukuran maksimal 5 MB.");
      return;
    }

    setBusy(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `${eventId}/${kind}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("event-assets")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    setBusy(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("event-assets").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-[#EDE9F7] bg-white px-3.5 py-2 text-xs font-medium text-[#3B3647] hover:bg-[#FBFAFE] disabled:opacity-60"
        >
          {busy ? "Mengunggah..." : value ? `Ganti ${label}` : `Unggah ${label}`}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setError(null);
            }}
            className="text-xs font-medium text-[#8F8A9E] hover:text-[#DC2626]"
          >
            Hapus
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={TYPES.join(",")}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }}
        />
      </div>

      {value ? (
        // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
        <img
          src={value}
          alt={label}
          className="mt-2 max-h-24 w-auto rounded-lg border border-[#EDE9F7] bg-white object-contain p-1"
        />
      ) : null}

      {error && <p className="mt-2 text-[11px] text-[#DC2626]">{error}</p>}
    </div>
  );
}
