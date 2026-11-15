import { Suspense } from "react";
import { AttendancePanel } from "@/components/attendance-panel";
import { DashboardGuard } from "@/components/dashboard-guard";
import { isDemoMode } from "@/lib/demo";
import { demoParticipantRows } from "@/lib/demo-rows";
import { getMyEvent } from "@/lib/supabase/queries/events";
import { getParticipants, type ParticipantRow } from "@/lib/supabase/queries/participants";

const DEMO_CHECKIN_URL = "https://eventom.id/checkin/uiux-b3";

async function loadAttendance(): Promise<{
  participants: ParticipantRow[];
  checkinUrl: string;
}> {
  if (isDemoMode()) {
    return { participants: demoParticipantRows(), checkinUrl: DEMO_CHECKIN_URL };
  }

  const [event, participants] = await Promise.all([getMyEvent(), getParticipants()]);
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return { participants, checkinUrl: `${base}/checkin/${event?.slug ?? ""}` };
}

async function AttendanceContent() {
  const { participants, checkinUrl } = await loadAttendance();
  return <AttendancePanel participants={participants} checkinUrl={checkinUrl} />;
}

export default function PresensiPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>
      <Suspense
        fallback={
          <div className="mx-auto h-[640px] w-full max-w-[1180px] animate-pulse rounded-2xl bg-white/60" />
        }
      >
        <AttendanceContent />
      </Suspense>
    </>
  );
}
