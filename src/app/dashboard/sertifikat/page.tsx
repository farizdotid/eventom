import { Suspense } from "react";
import { CertificateEditor } from "@/components/certificate-editor";
import { DashboardGuard } from "@/components/dashboard-guard";
import { isDemoMode } from "@/lib/demo";
import { demoCertificateConfig } from "@/lib/demo-data";
import { getCertificate } from "@/lib/supabase/queries/certificates";
import { getMyEvent } from "@/lib/supabase/queries/events";

async function CertificateContent() {
  if (isDemoMode()) {
    return <CertificateEditor initialConfig={demoCertificateConfig} />;
  }

  const [{ config }, event] = await Promise.all([getCertificate(), getMyEvent()]);
  return <CertificateEditor initialConfig={config} eventId={event?.id} />;
}

export default function SertifikatPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>
      <Suspense
        fallback={
          <div className="mx-auto h-[600px] w-full max-w-[1180px] animate-pulse rounded-2xl bg-white/60" />
        }
      >
        <CertificateContent />
      </Suspense>
    </>
  );
}
