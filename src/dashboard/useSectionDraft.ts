import { useCallback } from "react";
import { DEFAULT_CONTENT } from "../content/defaults";
import type { SectionKey, SiteContent } from "../content/types";
import { useDrafts } from "./DraftProvider";

/**
 * Edit buffer for one content section, backed by the shared DraftProvider.
 *
 * Edits stay as drafts — visible in the live preview but not on the public
 * site — until the section is published, either from this page's save bar or
 * from the Publish button in the top bar.
 */
export function useSectionDraft<K extends SectionKey>(key: K) {
  const {
    getDraft,
    setDraft: setSectionDraft,
    dirtyKeys,
    discard: discardKeys,
    publish,
    submit,
    canPublish,
    sectionState,
  } = useDrafts();

  const draft = getDraft(key);
  const dirty = dirtyKeys.includes(key);
  const { saving, error, savedAt } = sectionState(key);

  const setDraft = useCallback((value: SiteContent[K]) => setSectionDraft(key, value), [key, setSectionDraft]);

  /** Shallow-patch the draft; for object-shaped sections. */
  const update = useCallback(
    (patch: Partial<SiteContent[K]>) =>
      setSectionDraft(key, (prev) => ({ ...prev, ...patch }) as SiteContent[K]),
    [key, setSectionDraft]
  );

  /** Publishes, or sends for review when the user's role can't publish. */
  const save = useCallback(async () => {
    if (canPublish) await publish([key]);
    else await submit([key]);
  }, [key, canPublish, publish, submit]);

  const discard = useCallback(() => discardKeys([key]), [key, discardKeys]);

  /** Loads the original content into the draft; it still needs publishing. */
  const resetToDefault = useCallback(() => {
    setSectionDraft(key, DEFAULT_CONTENT[key]);
  }, [key, setSectionDraft]);

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
