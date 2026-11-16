import type { CertificateConfig, LandingData } from "@/lib/demo-data";
import { mergeCertificateConfig } from "@/lib/certificate";
import { mergeLanding } from "@/lib/landing";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database.types";

export type PublicEvent = {
  id: string;
  name: string;
  slug: string;
  status: string;
  startAt: string | null;
  location: string | null;
  landing: LandingData;
  registered: number;
};

export type CertificateCheck =
  | {
      ok: true;
      name: string;
      eventName: string;
      number: string;
      issueDate: string | null;
      status: string;
      config: CertificateConfig;
    }
  | { ok: false; message: string };

/** Info acara untuk halaman publik (lewat RPC, bukan tabel langsung). */
export async function getPublicEvent(slug: string): Promise<PublicEvent | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("public_event", { p_slug: slug });
  if (!data) return null;

  const raw = data as Record<string, Json>;

  return {
    id: String(raw.id),
    name: String(raw.name),
    slug: String(raw.slug),
    status: String(raw.status),
    startAt: typeof raw.start_at === "string" ? raw.start_at : null,
    location: typeof raw.location === "string" ? raw.location : null,
    landing: mergeLanding(
      raw.landing && typeof raw.landing === "object"
        ? (raw.landing as Partial<LandingData>)
        : null,
    ),
    registered: typeof raw.registered === "number" ? raw.registered : 0,
  };
}

export type RegistrationResult =
  | { ok: true; message: string; name: string; code: string }
  | { ok: false; message: string };

/** Daftar sebagai peserta (lewat RPC, kode unik dibuat di database). */
export async function registerParticipant(input: {
  slug: string;
  name: string;
  email: string;
  org?: string;
  phone?: string;
  job?: string;
}): Promise<RegistrationResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("register_participant", {
    p_slug: input.slug,
    p_name: input.name,
    p_email: input.email,
    p_org: input.org ?? null,
    p_phone: input.phone ?? null,
    p_job: input.job ?? null,
  });

  if (error || !data) {
    return { ok: false, message: "Gagal menghubungi server. Coba lagi." };
  }

  const raw = data as Record<string, Json>;
  if (raw.ok !== true) {
    return {
      ok: false,
      message:
        typeof raw.message === "string" ? raw.message : "Pendaftaran gagal.",
    };
  }

  return {
    ok: true,
    message: typeof raw.message === "string" ? raw.message : "Pendaftaran berhasil.",
    name: String(raw.name),
    code: String(raw.code),
  };
}

/** Cek keaslian sertifikat dari kode peserta (lewat RPC). */
export async function verifyCertificate(
  code: string,
): Promise<CertificateCheck> {
  const trimmed = code.trim();
  if (!trimmed) return { ok: false, message: "Kode sertifikat masih kosong." };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("verify_certificate", {
    p_code: trimmed,
  });

  if (error || !data) {
    return { ok: false, message: "Gagal memeriksa kode. Coba lagi nanti." };
  }

  const raw = data as Record<string, Json>;
  if (raw.ok !== true) {
    return {
      ok: false,
      message:
        typeof raw.message === "string"
          ? raw.message
          : "Kode sertifikat tidak ditemukan.",
    };
  }

  return {
    ok: true,
    name: String(raw.name),
    eventName: String(raw.event_name),
    number: String(raw.number),
    issueDate: typeof raw.issue_date === "string" ? raw.issue_date : null,
    status: String(raw.status),
    config: mergeCertificateConfig(
      raw.config && typeof raw.config === "object"
        ? (raw.config as Partial<CertificateConfig>)
        : null,
    ),
  };
}
