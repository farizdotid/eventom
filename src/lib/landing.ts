import { demoLanding, type LandingData } from "@/lib/demo-data";

/**
 * Config landing tersimpan ditimpa di atas data contoh, per grup.
 * Dipakai editor dashboard dan halaman publik supaya bentuk datanya identik.
 */
export function mergeLanding(saved?: Partial<LandingData> | null): LandingData {
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
}
