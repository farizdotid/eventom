"use client";

import { QRCodeSVG } from "qrcode.react";

/** QR kecil di sertifikat cetak; qrcode.react butuh client. */
export function CertificateQr({ value, size = 64 }: { value: string; size?: number }) {
  return (
    <QRCodeSVG
      value={value}
      size={size}
      bgColor="transparent"
      fgColor="#171321"
      level="M"
      marginSize={0}
    />
  );
}
