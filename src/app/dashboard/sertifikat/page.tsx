import { Suspense } from "react";
import { CertificateEditor } from "@/components/certificate-editor";
import { DashboardGuard } from "@/components/dashboard-guard";
import { isDemoMode } from "@/lib/demo";
import { demoCertificateConfig } from "@/lib/demo-data";
import { getCertificate } from "@/lib/supabase/queries/certificates";

async function CertificateContent() {
  const initialConfig = isDemoMode()
    ? demoCertificateConfig
    : (await getCertificate()).config;

  return <CertificateEditor initialConfig={initialConfig} />;
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
