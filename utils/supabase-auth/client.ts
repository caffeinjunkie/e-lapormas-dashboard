import { createBrowserClient } from "@supabase/ssr";

//TODO: pass variable to createClient, use service_role key if user is super admin
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
