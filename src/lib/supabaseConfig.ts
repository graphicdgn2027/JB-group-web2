/**
 * Supabase settings that carry no dependency on the SDK.
 *
 * Kept separate from `supabase.ts` on purpose: importing anything from that
 * module pulls in the whole client (~227KB), and the public site only needs
 * to know *whether* a backend is configured, not talk to it, before it paints.
 *
 * Configured entirely through Vite env vars so the same build can run against
 * staging / production without code changes. Create a `.env` in the project
 * root (already git-ignored):
 *
 *   VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
 *   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
 *
 * When the vars are missing the site still renders — every page falls back to
 * the bundled default content in `src/content/defaults.ts`, and the dashboard
 * shows a setup notice instead of a login form.
 */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as
  | string
  | undefined;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Table holding one row per content section (`id` = section key, `data` = jsonb). */
export const CONTENT_TABLE = "site_content";

/** Storage bucket used by the dashboard media library. */
export const MEDIA_BUCKET = "media";
