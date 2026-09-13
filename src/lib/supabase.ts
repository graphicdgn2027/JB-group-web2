import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is configured entirely through Vite env vars so the same build can
 * run against staging / production without code changes.
 *
 * Create a `.env` file in the project root (it is already git-ignored):
 *
 *   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
 *
 * When the vars are missing the site still renders — every page falls back to
 * the bundled default content in `src/content/defaults.ts`, and the dashboard
 * shows a setup notice instead of a login form.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "jbgroup-dashboard-auth",
      },
    })
  : null;

/** Table holding one row per content section (`id` = section key, `data` = jsonb). */
export const CONTENT_TABLE = "site_content";

/** Storage bucket used by the dashboard media library. */
export const MEDIA_BUCKET = "media";
