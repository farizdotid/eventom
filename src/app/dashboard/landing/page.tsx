import { Suspense } from "react";
import { DashboardGuard } from "@/components/dashboard-guard";
import { LandingEditor } from "@/components/landing-editor";
import { isDemoMode } from "@/lib/demo";
import { demoLanding } from "@/lib/demo-data";
import { getLanding } from "@/lib/supabase/queries/events";

async function LandingContent() {
  const data = isDemoMode() ? demoLanding : await getLanding();
  return <LandingEditor initialData={data} />;
}

export default function LandingPageSetup() {
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
        <LandingContent />
      </Suspense>
    </>
  );
}
