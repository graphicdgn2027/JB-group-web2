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
import { isPreviewMode, PREVIEW_STORAGE_KEY, readPreviewDrafts } from "./preview";
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
  /** True when this window renders unpublished dashboard drafts. */
  preview: boolean;
  refresh: () => Promise<void>;
  /** Persists one section, then updates local state once the write succeeds. */
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
      // A not-yet-created table is an expected state (the site ships with its
      // built-in content), so it is a warning rather than an error.
      const notSetUp = /schema cache|does not exist|relation .* not found/i.test(err.message);
      const log = notSetUp ? console.warn : console.error;
      log("[content] falling back to built-in content:", err.message);
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
      if (!supabase) {
        throw new Error(
          "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
        );
      }
      const { error: err } = await supabase
        .from(CONTENT_TABLE)
        .upsert({ id: key, data: value, updated_at: new Date().toISOString() });
      if (err) throw new Error(err.message);
      // Only a confirmed write changes what counts as published.
      setContent((prev) => ({ ...prev, [key]: value }));
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

  // Preview windows overlay the dashboard's unpublished drafts and follow them
  // live through `storage` events fired by the dashboard window.
  const [preview] = useState(isPreviewMode);
  const [previewDrafts, setPreviewDrafts] = useState<Partial<SiteContent>>(() =>
    preview ? readPreviewDrafts() : {}
  );

  useEffect(() => {
    if (!preview) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === null || e.key === PREVIEW_STORAGE_KEY) setPreviewDrafts(readPreviewDrafts());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [preview]);

  const effective = useMemo<SiteContent>(
    () => (preview ? { ...content, ...previewDrafts } : content),
    [preview, content, previewDrafts]
  );

  // Brand colours are editable, so push them into the CSS custom properties the
  // Tailwind theme already reads from.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-brand-blue", effective.settings.brandBlue);
    root.style.setProperty("--color-brand-red", effective.settings.brandGold);
    root.style.setProperty("--accent", effective.settings.brandGold);
  }, [effective.settings.brandBlue, effective.settings.brandGold]);

  useEffect(() => {
    if (effective.settings.siteTitle) document.title = effective.settings.siteTitle;
  }, [effective.settings.siteTitle]);

  const value = useMemo<ContentContextValue>(
    () => ({
      content: effective,
      status,
      error,
      usingDefaults: !isSupabaseConfigured,
      preview,
      refresh,
      saveSection,
      resetSection,
      publishAll,
    }),
    [effective, status, error, preview, refresh, saveSection, resetSection, publishAll]
  );

  const draftCount = Object.keys(previewDrafts).length;

  return (
    <ContentContext.Provider value={value}>
      {children}
      {preview && (
        <div
          style={{
            position: "fixed",
            left: 12,
            bottom: 12,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 12px",
            borderRadius: 9999,
            background: "rgba(15,23,42,0.88)",
            color: "#fff",
            font: "600 11px/1.4 Inter, system-ui, sans-serif",
            letterSpacing: "0.02em",
            boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
            pointerEvents: "none",
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 9999,
              background: draftCount ? "#f59e0b" : "#10b981",
            }}
          />
          {draftCount
            ? `Preview · ${draftCount} unpublished ${draftCount === 1 ? "section" : "sections"}`
            : "Preview · matches live site"}
        </div>
      )}
    </ContentContext.Provider>
  );
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
