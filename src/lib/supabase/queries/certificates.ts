import { cache } from "react";
import { demoCertificateConfig, type CertificateConfig } from "@/lib/demo-data";
import { getMyEvent } from "@/lib/supabase/queries/events";
import { createClient } from "@/lib/supabase/server";

export type CertificateState = {
  config: CertificateConfig;
  issued: number;
};

/**
 * Isi editor sertifikat + jumlah yang sudah diunduh.
 * Config tersimpan ditimpa di atas contoh, jadi field baru tetap punya isi.
 */
export const getCertificate = cache(async (): Promise<CertificateState> => {
  const event = await getMyEvent();
  if (!event) return { config: demoCertificateConfig, issued: 0 };

  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("config, issued")
    .eq("event_id", event.id)
    .maybeSingle();

  const saved = (data?.config ?? {}) as Partial<CertificateConfig>;

  return {
    config: {
      ...demoCertificateConfig,
      ...saved,
      signers: saved.signers ?? demoCertificateConfig.signers,
      rules: { ...demoCertificateConfig.rules, ...saved.rules },
    },
    issued: data?.issued ?? 0,
  };
});
