import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CONTENT_TABLE, isSupabaseConfigured, supabase } from "../lib/supabase";
import { DEFAULT_CONTENT } from "./defaults";
import type { SectionKey, SiteContent } from "./types";

/**
 * Deep-merges a stored value over its default.
 *
 * Arrays are replaced wholesale (an editor deleting the last leader must not
 * resurrect the default three), but plain objects merge key-by-key so a section
 * saved before a new field existed still picks that field up from the defaults
 * instead of rendering `undefined`.
 */
function mergeValue<T>(defaultValue: T, stored: unknown): T {
  if (stored === null || stored === undefined) return defaultValue;
  if (Array.isArray(defaultValue) || Array.isArray(stored)) return stored as T;
  if (
    typeof defaultValue === "object" &&
    typeof stored === "object" &&
    defaultValue !== null
  ) {
    const out: Record<string, unknown> = { ...(defaultValue as object) };
    for (const [key, value] of Object.entries(stored as Record<string, unknown>)) {
      out[key] = mergeValue((defaultValue as Record<string, unknown>)[key], value);
    }
    return out as T;
  }
  return stored as T;
}

export type ContentStatus = "loading" | "ready" | "offline" | "error";

interface ContentContextValue {
  content: SiteContent;
  status: ContentStatus;
  /** Populated when `status === "error"`. */
  error: string | null;
  /** True when no Supabase credentials are present — the site is on defaults. */
  usingDefaults: boolean;
  refresh: () => Promise<void>;
  /** Persists one section and optimistically updates local state. */
  saveSection: <K extends SectionKey>(key: K, value: SiteContent[K]) => Promise<void>;
  /** Restores one section to its bundled default and persists that. */
  resetSection: (key: SectionKey) => Promise<void>;
  /** Writes every section, used to seed a fresh database. */
  publishAll: () => Promise<void>;
}

const ContentContext = createContext<ContentContextValue | null>(null);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(DEFAULT_CONTENT);
  const [status, setStatus] = useState<ContentStatus>(
    isSupabaseConfigured ? "loading" : "offline"
  );
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setStatus("offline");
      return;
    }
    setStatus("loading");
    const { data, error: err } = await supabase.from(CONTENT_TABLE).select("id, data");

    if (err) {
      // The site must never go blank because the database is unreachable.
      console.error("[content] falling back to defaults:", err.message);
      setError(err.message);
      setContent(DEFAULT_CONTENT);
      setStatus("error");
      return;
    }

    const next = { ...DEFAULT_CONTENT };
    for (const row of data ?? []) {
      const key = row.id as SectionKey;
      if (key in DEFAULT_CONTENT) {
        (next as Record<string, unknown>)[key] = mergeValue(
          DEFAULT_CONTENT[key],
          row.data
        );
      }
    }
    setContent(next);
    setError(null);
    setStatus("ready");
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const saveSection = useCallback<ContentContextValue["saveSection"]>(
    async (key, value) => {
      setContent((prev) => ({ ...prev, [key]: value }));
      if (!supabase) {
        throw new Error(
          "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
        );
      }
      const { error: err } = await supabase
        .from(CONTENT_TABLE)
        .upsert({ id: key, data: value, updated_at: new Date().toISOString() });
      if (err) throw new Error(err.message);
    },
    []
  );

  const resetSection = useCallback(
    async (key: SectionKey) => {
      await saveSection(key, DEFAULT_CONTENT[key] as never);
    },
    [saveSection]
  );

  const publishAll = useCallback(async () => {
    if (!supabase) throw new Error("Supabase is not configured.");
    const rows = (Object.keys(content) as SectionKey[]).map((key) => ({
      id: key,
      data: content[key],
      updated_at: new Date().toISOString(),
    }));
    const { error: err } = await supabase.from(CONTENT_TABLE).upsert(rows);
    if (err) throw new Error(err.message);
  }, [content]);

  // Brand colours are editable, so push them into the CSS custom properties the
  // Tailwind theme already reads from.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-brand-blue", content.settings.brandBlue);
    root.style.setProperty("--color-brand-red", content.settings.brandGold);
    root.style.setProperty("--accent", content.settings.brandGold);
  }, [content.settings.brandBlue, content.settings.brandGold]);

  useEffect(() => {
    if (content.settings.siteTitle) document.title = content.settings.siteTitle;
  }, [content.settings.siteTitle]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content,
      status,
      error,
      usingDefaults: !isSupabaseConfigured,
      refresh,
      saveSection,
      resetSection,
      publishAll,
    }),
    [content, status, error, refresh, saveSection, resetSection, publishAll]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
};

export function useContentStore(): ContentContextValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContentStore must be used inside <ContentProvider>");
  return ctx;
}

/** Read one section of content. */
export function useSection<K extends SectionKey>(key: K): SiteContent[K] {
  return useContentStore().content[key];
}

/** Published businesses in display order. */
export function usePublishedBusinesses() {
  const businesses = useSection("businesses");
  return useMemo(
    () => businesses.filter((b) => b.published).sort((a, b) => a.order - b.order),
    [businesses]
  );
}
