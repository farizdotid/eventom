import { CopyButton } from "@/components/dashboard-shell";
import { isDemoMode } from "@/lib/demo";
import { demoEvent } from "@/lib/demo-data";
import { getMyEvent } from "@/lib/supabase/queries/events";

/** Kartu link pendaftaran di sidebar: halaman publik /e/<slug>. */
export async function RegistrationLink() {
  if (isDemoMode()) return <LinkCard url={demoEvent.registrationUrl} />;

  const event = await getMyEvent();
  if (!event) return <LinkCard url="" />;

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return <LinkCard url={`${base}/e/${event.slug}`} />;
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
