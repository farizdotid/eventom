"use server";

import {
  registerParticipant,
  type RegistrationResult,
} from "@/lib/supabase/queries/public";

/** Daftar peserta dari halaman publik. Validasi detail ada di RPC. */
export async function submitRegistration(input: {
  slug: string;
  name: string;
  email: string;
  org?: string;
  phone?: string;
}): Promise<RegistrationResult> {
  if (!input.slug) return { ok: false, message: "Acara tidak dikenal." };

  if (input.name.trim().length < 2) {
    return { ok: false, message: "Nama minimal 2 karakter." };
  }
  if (!input.email.includes("@")) {
    return { ok: false, message: "Email belum benar." };
  }

  return registerParticipant(input);
}
