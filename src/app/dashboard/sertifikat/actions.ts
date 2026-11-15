"use server";

import { revalidatePath } from "next/cache";
import type { CertificateConfig } from "@/lib/demo-data";
import { getMyEvent } from "@/lib/supabase/queries/events";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Simpan isi editor sertifikat (satu baris per event). */
export async function saveCertificate(
  config: CertificateConfig,
): Promise<SaveResult> {
  const event = await getMyEvent();
  if (!event) return { ok: false, error: "Belum ada event untuk disimpan." };

  const supabase = await createClient();
  const { error } = await supabase.from("certificates").upsert(
    {
      event_id: event.id,
      config: config as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "event_id" },
  );

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sertifikat");

  return { ok: true };
}
