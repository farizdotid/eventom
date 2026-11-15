import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

/**
 * Second line of defense: the proxy already redirects guests.
 * Reads cookies, so wrap it in <Suspense> to keep the shell prerenderable.
 */
export async function DashboardGuard() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return null;
}
