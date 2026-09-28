import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
} from "./supabaseConfig";

/**
 * The Supabase client. Importing this module pulls in the SDK (~227KB), so
 * anything on the public site's critical path should `await import()` it
 * rather than importing it statically — see ContentProvider. Code that only
 * needs the settings should import ./supabaseConfig, which carries no SDK.
 */
export { isSupabaseConfigured, CONTENT_TABLE, MEDIA_BUCKET } from "./supabaseConfig";

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "jbgroup-dashboard-auth",
      },
    })
  : null;
