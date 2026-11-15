import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { demoLanding, type LandingData } from "@/lib/demo-data";
import type { Database } from "@/types/database.types";

export type Event = Database["public"]["Tables"]["events"]["Row"];

/** Isi editor landing yang tersimpan di `events.config.landing`. */
export type EventConfig = {
  registration_url?: string;
  landing?: Partial<LandingData>;
  [key: string]: unknown;
};

/**
 * Event pertama milik user yang login.
 * Tidak perlu filter owner: RLS yang membatasi ke event milik sendiri.
 * Di-cache per request supaya header dan isi halaman tidak query dua kali.
 */
export const getMyEvent = cache(async (): Promise<Event | null> => {
  const supabase = await createClient();

  const { data } = await supabase
    .from("events")
    .select("id, owner_id, name, slug, status, config, created_at")
    .order("created_at")
    .limit(1)
    .maybeSingle();

  return data;
});

/**
 * Data landing untuk editor: config tersimpan ditimpa di atas data contoh,
 * jadi field yang belum pernah disimpan tetap punya isi.
 */
export const getLanding = cache(async (): Promise<LandingData> => {
  const event = await getMyEvent();
  const saved = ((event?.config ?? {}) as EventConfig).landing;
  if (!saved) return demoLanding;

  return {
    ...demoLanding,
    ...saved,
    event: { ...demoLanding.event, ...saved.event },
    about: { ...demoLanding.about, ...saved.about },
    speaker: { ...demoLanding.speaker, ...saved.speaker },
    registration: { ...demoLanding.registration, ...saved.registration },
    fields: { ...demoLanding.fields, ...saved.fields },
    sections: { ...demoLanding.sections, ...saved.sections },
    agenda: saved.agenda ?? demoLanding.agenda,
  };
});
