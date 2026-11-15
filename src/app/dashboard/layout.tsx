import { Suspense } from "react";
import { AdminMenu } from "@/components/admin-menu";
import { DashboardShell } from "@/components/dashboard-shell";
import { RegistrationLink } from "@/components/registration-link";

const SIDEBAR_CARD = "h-[104px] animate-pulse rounded-xl bg-[#F6F0FF]";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      userMenu={
        <Suspense
          fallback={<div className="size-9 animate-pulse rounded-full bg-[#EDE9F7]" />}
        >
          <AdminMenu />
        </Suspense>
      }
      footer={
        <Suspense fallback={<div className={SIDEBAR_CARD} />}>
          <RegistrationLink />
        </Suspense>
      }
    >
      {children}
    </DashboardShell>
  );
}
