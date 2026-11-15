import { Suspense } from "react";
import { CertificateEditor } from "@/components/certificate-editor";
import { DashboardGuard } from "@/components/dashboard-guard";

export default function SertifikatPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>
      <CertificateEditor />
    </>
  );
}
