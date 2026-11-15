import { CopyButton } from "@/components/dashboard-shell";
import { isDemoMode } from "@/lib/demo";
import { demoEvent } from "@/lib/demo-data";
import { getMyEvent } from "@/lib/supabase/queries/events";

type EventConfig = { registration_url?: string };

/** Kartu link pendaftaran di sidebar; diambil dari events.config. */
export async function RegistrationLink() {
  if (isDemoMode()) return <LinkCard url={demoEvent.registrationUrl} />;

  const event = await getMyEvent();
  const config = (event?.config ?? {}) as EventConfig;

  return <LinkCard url={config.registration_url ?? ""} />;
}

function LinkCard({ url }: { url: string }) {
  return (
    <div className="rounded-xl bg-[#F6F0FF] p-3.5">
      <p className="text-[11px] text-[#8F8A9E]">Link pendaftaran</p>
      <p className="mt-0.5 truncate text-xs font-medium">
        {url || "Belum diatur"}
      </p>
      {url && <CopyButton value={url} />}
    </div>
  );
}
