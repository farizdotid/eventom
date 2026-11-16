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

export type RegistrationWindow =
  | { open: true }
  | { open: false; message: string };

/**
 * Buka/tutup pendaftaran menurut tanggal acara dan batas pendaftaran (WIB).
 * Aturan yang sama dicek ulang di `register_participant()`, jadi ini hanya
 * untuk tampilan — server tetap menolak walau halaman sudah basi.
 */
export function registrationWindow(
  landing: LandingData,
  now: number = Date.now(),
): RegistrationWindow {
  const { date, startTime, endTime } = landing.event;
  const ended = Date.parse(`${date}T${endTime || startTime}:00+07:00`);

  if (Number.isFinite(ended) && now >= ended) {
    return { open: false, message: "Acara ini sudah selesai." };
  }

  const closed = Date.parse(`${landing.registration.deadline}T23:59:59+07:00`);

  if (Number.isFinite(closed) && now >= closed) {
    return { open: false, message: "Pendaftaran sudah ditutup." };
  }

  return { open: true };
}
