"use server";

import { revalidatePath } from "next/cache";
import type { LandingData } from "@/lib/demo-data";
import { getMyEvent, type EventConfig } from "@/lib/supabase/queries/events";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Simpan isi editor landing ke `events.config.landing`. */
export async function saveLanding(data: LandingData): Promise<SaveResult> {
  const event = await getMyEvent();
  if (!event) return { ok: false, error: "Belum ada event untuk disimpan." };

  const config: EventConfig = { ...(event.config as EventConfig), landing: data };

  const supabase = await createClient();
  const { error } = await supabase
    .from("events")
    .update({
      name: data.event.name.trim() || event.name,
      config: config as Json,
    })
    .eq("id", event.id);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/landing");

  return { ok: true };
}
