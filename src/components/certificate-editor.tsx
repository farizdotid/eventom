"use client";

import { useState, useTransition } from "react";
import { QRCodeSVG } from "qrcode.react";
import { saveCertificate } from "@/app/dashboard/sertifikat/actions";
import { AssetUpload } from "@/components/asset-upload";
import { Field, Toggle } from "@/components/form-controls";
import {
  CERTIFICATE_TEMPLATES,
  demoCertificateConfig,
  demoCertificateSample,
  type CertificateConfig,
} from "@/lib/demo-data";

const CARD = "rounded-2xl border border-[#EDE9F7] bg-white p-5";
const INP =
  "w-full rounded-lg border border-[#EDE9F7] bg-white px-3 py-2.5 text-sm outline-none placeholder:text-[#A8A3B5] focus:border-[#C9B6FF]";

function CertificatePreview({ config }: { config: CertificateConfig }) {
  const theme =
    CERTIFICATE_TEMPLATES.find((item) => item.id === config.template) ??
    CERTIFICATE_TEMPLATES[0];

  return (
    <div
      className="relative flex min-h-[360px] flex-col items-center justify-center overflow-hidden rounded-xl px-5 py-6 pb-16 text-center sm:px-6 sm:py-7 sm:pb-16"
      style={{ background: theme.background }}
    >
      <div className="flex items-center justify-center gap-3">
        {config.logo ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
          <img src={config.logo} alt="Logo" className="h-11 w-auto object-contain" />
        ) : (
          <div className="grid h-11 w-24 place-items-center rounded-md border border-dashed border-[#C9BFDC] text-[8px] text-[#8F8A9E]">
            Logo
          </div>
        )}
      </div>

      <h3
        className="mt-4 text-[21px] font-semibold tracking-tight"
        style={{ color: theme.accent }}
      >
        {config.title}
      </h3>
      <p className="mt-1 text-[8px] text-[#8F8A9E]">
        No. {config.numberFormat.replace("{no}", demoCertificateSample.number)}
      </p>

      <p className="mt-3 text-[8px] text-[#8F8A9E]">{config.intro}</p>
      <p className="mt-1 text-[24px] font-semibold leading-tight">
        {demoCertificateSample.name}
      </p>

      <p className="mt-2 max-w-[360px] text-[8px] leading-relaxed text-[#6B6578]">
        {config.description}
      </p>

      <p className="mt-3 text-[8px] text-[#8F8A9E]">{config.issueDate}</p>

      <div className="mt-4 flex items-center justify-center gap-4 sm:gap-10">
        {config.signers.map((signer) => (
          <div key={signer.name} className="text-center">
            {signer.signature ? (
              // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
              <img
                src={signer.signature}
                alt=""
                className="mx-auto h-10 w-20 object-contain sm:w-24"
              />
            ) : (
              <div className="grid h-10 w-20 place-items-center rounded-md border border-dashed border-[#C9BFDC] text-[8px] text-[#8F8A9E] sm:w-24">
                TTD
              </div>
            )}
            <p className="mt-1.5 text-[8px] font-semibold">{signer.name}</p>
            <p className="text-[7px] text-[#8F8A9E]">{signer.role}</p>
          </div>
        ))}
      </div>

      {config.rules.showVerification && (
        <div className="absolute bottom-4 right-4 text-center">
          <QRCodeSVG
            value={`${process.env.NEXT_PUBLIC_SITE_URL ?? "https://eventom.id"}/verify/${demoCertificateSample.code}`}
            size={40}
            bgColor="transparent"
            fgColor="#171321"
            level="M"
            marginSize={0}
          />
          <p className="mt-1 text-[6px] text-[#8F8A9E]">{demoCertificateSample.code}</p>
        </div>
      )}
    </div>
  );
}

export function CertificateEditor({
  initialConfig = demoCertificateConfig,
  eventId,
}: {
  initialConfig?: CertificateConfig;
  eventId?: string;
}) {
  const [config, setConfig] = useState<CertificateConfig>(initialConfig);
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);

  function save() {
    startTransition(async () => {
      const result = await saveCertificate(config);
      setNotice(
        result.ok
          ? { ok: true, text: "Sertifikat tersimpan." }
          : { ok: false, text: result.error },
      );
    });
  }

  function patch(key: keyof CertificateConfig, value: CertificateConfig[keyof CertificateConfig]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function patchSigner(index: number, key: "name" | "role" | "signature", value: string) {
    setConfig((prev) => ({
      ...prev,
      signers: prev.signers.map((signer, i) =>
        i === index ? { ...signer, [key]: value } : signer,
      ),
    }));
  }

  function toggleRule(key: keyof CertificateConfig["rules"]) {
    setConfig((prev) => ({
      ...prev,
      rules: { ...prev.rules, [key]: !prev.rules[key] },
    }));
  }

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[26px] font-semibold tracking-tight">Sertifikat</h1>
        <div className="flex items-center gap-2">
          {notice && (
            <span
              className={`hidden text-xs sm:inline ${
                notice.ok ? "text-[#16A34A]" : "text-[#DC2626]"
              }`}
            >
              {notice.text}
            </span>
          )}
          <a
            href="/dashboard/sertifikat/cetak"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#EDE9F7] bg-white px-4 py-2 text-sm font-medium text-[#3B3647] hover:bg-[#FBFAFE]"
          >
            Cetak semua
          </a>
          <button
            type="button"
            onClick={() => {
              setConfig(initialConfig);
              setNotice(null);
            }}
            className="rounded-full border border-[#EDE9F7] bg-white px-4 py-2 text-sm font-medium text-[#3B3647] hover:bg-[#FBFAFE]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-full bg-[#6D4AFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#5B3AEB] disabled:opacity-60"
          >
            {pending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2 xl:items-start">
        <div className="flex flex-col gap-4">
          <section className={CARD}>
            <h2 className="text-sm font-semibold">Template</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {CERTIFICATE_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => patch("template", template.id)}
                  className={`rounded-xl border p-2 text-left transition ${
                    config.template === template.id
                      ? "border-[#6D4AFF]"
                      : "border-[#EDE9F7] hover:border-[#D9CDF7]"
                  }`}
                >
                  <div
                    className="h-20 rounded-lg border border-[#F1EDFA]"
                    style={{ background: template.background }}
                  />
                  <p className="mt-2 text-xs font-medium">{template.label}</p>
                </button>
              ))}
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Isi Sertifikat</h2>
            <div className="mt-3 flex flex-col gap-3">
              <Field label="Judul">
                <input
                  className={INP}
                  value={config.title}
                  onChange={(event) => patch("title", event.target.value)}
                />
              </Field>
              <Field label="Teks pengantar">
                <input
                  className={INP}
                  value={config.intro}
                  onChange={(event) => patch("intro", event.target.value)}
                />
              </Field>
              <Field label="Keterangan">
                <textarea
                  className={INP}
                  rows={3}
                  value={config.description}
                  onChange={(event) => patch("description", event.target.value)}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field
                  label="Format nomor"
                  hint="Gunakan {no} untuk nomor urut otomatis."
                >
                  <input
                    className={INP}
                    value={config.numberFormat}
                    onChange={(event) => patch("numberFormat", event.target.value)}
                  />
                </Field>
                <Field label="Tanggal terbit">
                  <input
                    className={INP}
                    value={config.issueDate}
                    onChange={(event) => patch("issueDate", event.target.value)}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Trainer &amp; Penandatangan</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {config.signers.map((signer, index) => (
                <div key={index} className="contents">
                  <Field label={`Nama penandatangan ${index + 1}`}>
                    <input
                      className={INP}
                      value={signer.name}
                      onChange={(event) => patchSigner(index, "name", event.target.value)}
                    />
                  </Field>
                  <Field label="Jabatan">
                    <input
                      className={INP}
                      value={signer.role}
                      onChange={(event) => patchSigner(index, "role", event.target.value)}
                    />
                  </Field>
                  <div className="sm:col-span-1">
                    {eventId ? (
                      <AssetUpload
                        eventId={eventId}
                        kind={`ttd-${index + 1}`}
                        label="tanda tangan"
                        value={signer.signature}
                        onChange={(url) => patchSigner(index, "signature", url)}
                      />
                    ) : (
                      <p className="text-xs text-[#A8A3B5]">
                        Unggah tanda tangan hanya tersedia saat terhubung ke Supabase.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-[#F7F4FD] pt-4">
              <p className="text-xs font-medium text-[#4B4657]">Logo penyelenggara</p>
              <div className="mt-2">
                {eventId ? (
                  <AssetUpload
                    eventId={eventId}
                    kind="logo"
                    label="logo"
                    value={config.logo}
                    onChange={(url) => patch("logo", url)}
                  />
                ) : (
                  <p className="text-xs text-[#A8A3B5]">
                    Unggah logo hanya tersedia saat terhubung ke Supabase.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className={CARD}>
            <h2 className="text-sm font-semibold">Aturan</h2>
            <div className="mt-2 divide-y divide-[#F7F4FD]">
              <Toggle
                title="Hanya untuk peserta hadir"
                hint="Sertifikat terbuka setelah peserta check-in"
                checked={config.rules.attendedOnly}
                onChange={() => toggleRule("attendedOnly")}
              />
              <Toggle
                title="Peserta unduh sendiri"
                hint="Link unduh dikirim ke email peserta"
                checked={config.rules.selfDownload}
                onChange={() => toggleRule("selfDownload")}
              />
              <Toggle
                title="Tampilkan kode verifikasi"
                hint="Kode unik dan QR verifikasi di pojok sertifikat"
                checked={config.rules.showVerification}
                onChange={() => toggleRule("showVerification")}
              />
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-3 xl:sticky xl:top-[5.5rem]">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium">Pratinjau</h2>
            <p className="text-xs text-[#A8A3B5]">Contoh: {demoCertificateSample.name}</p>
          </div>
          <div className="rounded-2xl border border-[#EDE9F7] bg-white p-3">
            <CertificatePreview config={config} />
          </div>
        </div>
      </div>
    </div>
  );
}
