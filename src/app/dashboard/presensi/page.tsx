import { Suspense } from "react";
import { AttendancePanel } from "@/components/attendance-panel";
import { DashboardGuard } from "@/components/dashboard-guard";

export default function PresensiPage() {
  return (
    <>
      <Suspense fallback={null}>
        <DashboardGuard />
      </Suspense>
      <AttendancePanel />
    </>
  );
}
