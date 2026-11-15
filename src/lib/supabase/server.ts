import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import type { Database } from "@/types/database.types";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers.
 * `cookies()` is async in modern Next.js, so this function is async too:
 *   const supabase = await createClient();
 */
export async function createClient() {
  // Penanda render waktu-request. Tanpa ini, Next 16 (cacheComponents)
  // menganggap panggilan Date.now() di dalam auth Supabase sebagai bagian
  // prerender dan menggagalkan route ("unstable value Date.now()").
  await connection();

  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read all auth cookies from the incoming request
        getAll() {
          return cookieStore.getAll();
        },
        // Write refreshed auth cookies back to the response
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component, where cookies are read-only.
            // Safe to ignore: the proxy already refreshes the session.
          }
        },
      },
    },
  );
}
