import { demoCertificateConfig, type CertificateConfig } from "@/lib/demo-data";

/** Config sertifikat tersimpan ditimpa di atas contoh, per grup. */
export function mergeCertificateConfig(
  saved?: Partial<CertificateConfig> | null,
): CertificateConfig {
  if (!saved) return demoCertificateConfig;

  return {
    ...demoCertificateConfig,
    ...saved,
    signers: saved.signers ?? demoCertificateConfig.signers,
    rules: { ...demoCertificateConfig.rules, ...saved.rules },
  };
}
