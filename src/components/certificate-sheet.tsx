import { CertificateQr } from "@/components/certificate-qr";
import { CERTIFICATE_TEMPLATES, type CertificateConfig } from "@/lib/demo-data";

/**
 * Satu lembar sertifikat A4 landscape. Dipakai halaman cetak per kode
 * (`/sertifikat/<kode>`) dan cetak massal (`/dashboard/sertifikat/cetak`).
 */
export function CertificateSheet({
  name,
  number,
  config,
  verifyUrl,
  footer,
}: {
  name: string;
  number: string;
  config: CertificateConfig;
  verifyUrl: string;
  footer: string;
}) {
  const template =
    CERTIFICATE_TEMPLATES.find((item) => item.id === config.template) ??
    CERTIFICATE_TEMPLATES[0];

  return (
    <div
      className="mx-auto flex aspect-[297/210] w-[1000px] flex-col justify-between rounded-2xl p-12 shadow-[0_30px_80px_-40px_rgba(23,19,33,0.35)] print:h-[210mm] print:w-[297mm] print:rounded-none print:p-[18mm] print:shadow-none"
      style={{
        background: template.background,
        border: `1px solid ${template.accent}22`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {config.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
            <img src={config.logo} alt="Logo penyelenggara" className="h-7 w-auto" />
          ) : (
            <>
              <span
                className="grid size-7 place-items-center rounded-md text-xs font-semibold text-white"
                style={{ backgroundColor: template.accent }}
              >
                E
              </span>
              <span className="text-xs font-semibold tracking-tight text-[#5B5568]">
                Eventom
              </span>
            </>
          )}
        </div>
        <span className="font-mono text-[11px] text-[#8F8A9E]">{number}</span>
      </div>

      <div className="px-8 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.25em]"
          style={{ color: template.accent }}
        >
          {config.title}
        </p>
        <p className="mt-3 text-sm text-[#5B5568]">{config.intro}</p>
        <p
          className="mt-2 text-[42px] font-semibold leading-tight tracking-tight"
          style={{ color: "#171321" }}
        >
          {name}
        </p>
        <div
          className="mx-auto mt-3 h-px w-40"
          style={{ backgroundColor: `${template.accent}55` }}
        />
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#4B4657]">
          {config.description}
        </p>
      </div>

      <div className="flex items-end justify-between gap-6">
        <div className="flex gap-10">
          {config.signers.map((signer) => (
            <div key={signer.name} className="text-center">
              {signer.signature && (
                // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
                <img
                  src={signer.signature}
                  alt=""
                  className="mx-auto mb-1 h-9 w-32 object-contain"
                />
              )}
              <div
                className="mb-1 h-8 w-32 border-b"
                style={{ borderColor: `${template.accent}55` }}
              />
              <p className="text-xs font-semibold">{signer.name}</p>
              <p className="text-[10px] text-[#8F8A9E]">{signer.role}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-end gap-1">
          {config.rules.showVerification && <CertificateQr value={verifyUrl} />}
          <p className="text-[10px] text-[#8F8A9E]">{footer}</p>
        </div>
      </div>
    </div>
  );
}
