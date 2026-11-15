import { UserMenu } from "@/components/dashboard-shell";
import { DEMO_USER, isDemoMode } from "@/lib/demo";
import { demoAdmin } from "@/lib/demo-data";
import { getProfile } from "@/lib/supabase/queries/profiles";

/**
 * Tombol akun di topbar. Server Component supaya bisa ambil profil yang login;
 * dropdown-nya sendiri (`UserMenu`) yang jalan di client.
 */
export async function AdminMenu() {
  if (isDemoMode()) {
    return <UserMenu name={demoAdmin.name} role="admin" email={DEMO_USER.email} />;
  }

  const profile = await getProfile();
  if (!profile) return <UserMenu name="Panitia" role="staff" email="-" />;

  const name = profile.full_name?.trim() || profile.email.split("@")[0];

  return <UserMenu name={name} role={profile.role} email={profile.email} />;
}
