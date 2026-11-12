import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

type BrowserClient = ReturnType<typeof createBrowserClient<Database, "public">>;
let browserClient: BrowserClient | null = null;

export function createClient(): BrowserClient {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase is not configured for this project.");

  browserClient = createBrowserClient<Database, "public">(url, key, {
    cookieOptions: { secure: process.env.NODE_ENV === "production" },
  });
  return browserClient;
}
