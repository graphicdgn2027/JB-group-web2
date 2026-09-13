import { useCallback, useEffect, useMemo, useState } from "react";
import { useContentStore } from "../content/ContentProvider";
import type { SectionKey, SiteContent } from "../content/types";

/**
 * Local edit buffer for one content section.
 *
 * Editors mutate a draft copy so nothing reaches the database (or the live site)
 * until "Save" is pressed, and an unsaved draft survives navigating between
 * dashboard tabs only for as long as the editor stays mounted.
 */
export function useSectionDraft<K extends SectionKey>(key: K) {
  const { content, saveSection, resetSection } = useContentStore();
  const published = content[key];

  const [draft, setDraft] = useState<SiteContent[K]>(published);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Re-sync when the section is reloaded from the server (or reset elsewhere).
  useEffect(() => {
    setDraft(published);
  }, [published]);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(published),
    [draft, published]
  );

  /** Shallow-patch the draft; for object-shaped sections. */
  const update = useCallback((patch: Partial<SiteContent[K]>) => {
    setDraft((prev) => ({ ...prev, ...patch }) as SiteContent[K]);
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await saveSection(key, draft);
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }, [draft, key, saveSection]);

  const discard = useCallback(() => {
    setDraft(published);
    setError(null);
  }, [published]);

  const resetToDefault = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      await resetSection(key);
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSaving(false);
    }
  }, [key, resetSection]);

  return {
    draft,
    setDraft,
    update,
    dirty,
    saving,
    error,
    savedAt,
    save,
    discard,
    resetToDefault,
  };
}

/** Creates a reasonably unique id for a newly added list row. */
export function newId(prefix = "item"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
