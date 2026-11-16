import { Suspense } from "react";
import { DashboardGuard } from "@/components/dashboard-guard";
import { LandingEditor } from "@/components/landing-editor";
import { isDemoMode } from "@/lib/demo";
import { demoLanding } from "@/lib/demo-data";
import { getLanding, getMyEvent } from "@/lib/supabase/queries/events";

async function LandingContent() {
  if (isDemoMode()) {
    return <LandingEditor initialData={demoLanding} slug="uiux-batch-3" />;
  }

  const [data, event] = await Promise.all([getLanding(), getMyEvent()]);
  return <LandingEditor initialData={data} slug={event?.slug} eventId={event?.id} />;
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
