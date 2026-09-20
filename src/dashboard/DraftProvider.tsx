import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useContentStore } from "../content/ContentProvider";
import { readPreviewDrafts, writePreviewDrafts } from "../content/preview";
import type { SectionKey, SiteContent } from "../content/types";
import { SECTION_META } from "./sections";
import { useAuth } from "./AuthProvider";
import { submitSections } from "./adminApi";

export interface SectionState {
  saving: boolean;
  error: string | null;
  savedAt: number | null;
}

type Updater<K extends SectionKey> = SiteContent[K] | ((prev: SiteContent[K]) => SiteContent[K]);

interface DraftContextValue {
  /** Published content with every pending draft applied. */
  effective: SiteContent;
  /** Sections whose draft differs from what is published, in sidebar order. */
  dirtyKeys: SectionKey[];
  publishing: boolean;
  /** Whether this user publishes directly, or submits for review. */
  canPublish: boolean;
  getDraft: <K extends SectionKey>(key: K) => SiteContent[K];
  setDraft: <K extends SectionKey>(key: K, value: Updater<K>) => void;
  discard: (keys?: SectionKey[]) => void;
  /** Publishes the given sections (default: all dirty ones). Resolves true when all succeed. */
  publish: (keys?: SectionKey[]) => Promise<boolean>;
  /** Sends the given sections (default: all dirty ones) for review, then clears those drafts. */
  submit: (keys?: SectionKey[], note?: string) => Promise<boolean>;
  sectionState: (key: SectionKey) => SectionState;
}

const DraftContext = createContext<DraftContextValue | null>(null);

const IDLE: SectionState = { saving: false, error: null, savedAt: null };

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Holds unpublished edits for every section in one place, so the top bar can
 * publish everything at once and the live preview can show all of it.
 *
 * Drafts are mirrored to localStorage: that keeps unsaved work across a reload
 * and is what preview windows read from.
 */
export const DraftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { content, status, saveSection } = useContentStore();
  const { access } = useAuth();
  const canPublish = access?.canPublish ?? false;
  const [drafts, setDrafts] = useState<Partial<SiteContent>>(() => readPreviewDrafts());
  const [states, setStates] = useState<Partial<Record<SectionKey, SectionState>>>({});
  const [publishing, setPublishing] = useState(false);

  const contentRef = useRef(content);
  contentRef.current = content;
  const draftsRef = useRef(drafts);
  draftsRef.current = drafts;
  const accessRef = useRef(access);
  accessRef.current = access;

  /** Changed sections this user may act on, from a snapshot of the drafts. */
  const pendingTargets = (current: Partial<SiteContent>, keys?: SectionKey[]) =>
    (keys ?? (Object.keys(current) as SectionKey[])).filter(
      (key) =>
        key in current &&
        !same(current[key], contentRef.current[key]) &&
        (!accessRef.current || accessRef.current.canEditSection(key))
    );

  const dirtyKeys = useMemo(
    () =>
      (Object.keys(SECTION_META) as SectionKey[]).filter(
        (key) =>
          key in drafts &&
          !same(drafts[key], content[key]) &&
          // Ignore leftovers from another account on this browser.
          (!access || access.canEditSection(key))
      ),
    [drafts, content, access]
  );

  const effective = useMemo<SiteContent>(() => {
    const out = { ...content };
    for (const key of dirtyKeys) (out as Record<string, unknown>)[key] = drafts[key];
    return out;
  }, [content, drafts, dirtyKeys]);

  // Mirror only real changes; debounced so typing doesn't thrash storage.
  useEffect(() => {
    const t = window.setTimeout(() => {
      const pending: Partial<SiteContent> = {};
      for (const key of dirtyKeys) (pending as Record<string, unknown>)[key] = drafts[key];
      writePreviewDrafts(pending);
    }, 200);
    return () => window.clearTimeout(t);
  }, [drafts, dirtyKeys]);

  // Once published content has loaded, say so if work from a previous visit
  // was restored. Checked once only, so ordinary editing never triggers it.
  const restoreChecked = useRef(false);
  useEffect(() => {
    if (restoreChecked.current || status === "loading") return;
    restoreChecked.current = true;
    if (dirtyKeys.length === 0) return;
    toast.info("Unpublished changes restored", {
      description: `${dirtyKeys.length} ${dirtyKeys.length === 1 ? "section has" : "sections have"} edits from your last visit.`,
    });
  }, [status, dirtyKeys]);

  const getDraft = useCallback(
    <K extends SectionKey>(key: K): SiteContent[K] =>
      (key in drafts ? drafts[key] : content[key]) as SiteContent[K],
    [drafts, content]
  );

  const setDraft = useCallback(<K extends SectionKey>(key: K, value: Updater<K>) => {
    setDrafts((prev) => {
      const current = (key in prev ? prev[key] : contentRef.current[key]) as SiteContent[K];
      const next =
        typeof value === "function"
          ? (value as (p: SiteContent[K]) => SiteContent[K])(current)
          : value;
      return { ...prev, [key]: next };
    });
    setStates((prev) => (prev[key]?.error ? { ...prev, [key]: { ...prev[key]!, error: null } } : prev));
  }, []);

  const discard = useCallback((keys?: SectionKey[]) => {
    setDrafts((prev) => {
      if (!keys) return {};
      const next = { ...prev };
      for (const key of keys) delete next[key];
      return next;
    });
    setStates((prev) => {
      const next = { ...prev };
      for (const key of keys ?? (Object.keys(prev) as SectionKey[])) {
        if (next[key]) next[key] = { ...next[key]!, error: null };
      }
      return next;
    });
  }, []);

  const publish = useCallback(
    async (keys?: SectionKey[]): Promise<boolean> => {
      const current = draftsRef.current;
      const targets = pendingTargets(current, keys);
      if (targets.length === 0) return true;
      if (!accessRef.current?.canPublish) {
        toast.error("You can’t publish", { description: "Your role submits changes for review instead." });
        return false;
      }

      setPublishing(true);
      const failed: { key: SectionKey; message: string }[] = [];

      for (const key of targets) {
        setStates((prev) => ({ ...prev, [key]: { ...(prev[key] ?? IDLE), saving: true, error: null } }));
        const value = current[key] as SiteContent[typeof key];
        try {
          await saveSection(key, value);
          setDrafts((prev) => {
            // Keep the draft if it was edited again while this write was in flight.
            if (!same(prev[key], value)) return prev;
            const next = { ...prev };
            delete next[key];
            return next;
          });
          setStates((prev) => ({ ...prev, [key]: { saving: false, error: null, savedAt: Date.now() } }));
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);
          failed.push({ key, message });
          setStates((prev) => ({ ...prev, [key]: { ...(prev[key] ?? IDLE), saving: false, error: message } }));
        }
      }

      setPublishing(false);

      const ok = targets.length - failed.length;
      if (failed.length === 0) {
        toast.success(ok === 1 ? `${SECTION_META[targets[0]].label} published` : `${ok} sections published`, {
          description: "Your changes are now live on the website.",
        });
      } else {
        toast.error(
          ok > 0 ? `${ok} published, ${failed.length} failed` : "Couldn't publish",
          { description: `${SECTION_META[failed[0].key].label}: ${failed[0].message}` }
        );
      }
      return failed.length === 0;
    },
    [saveSection]
  );

  const submit = useCallback(async (keys?: SectionKey[], note = ""): Promise<boolean> => {
    const current = draftsRef.current;
    const targets = pendingTargets(current, keys);
    if (targets.length === 0) return true;

    setPublishing(true);
    setStates((prev) => {
      const next = { ...prev };
      for (const key of targets) next[key] = { ...(prev[key] ?? IDLE), saving: true, error: null };
      return next;
    });
    try {
      await submitSections(
        targets.map((key) => ({ section_id: key, data: current[key], note: note.trim() }))
      );
      setDrafts((prev) => {
        const next = { ...prev };
        for (const key of targets) if (same(prev[key], current[key])) delete next[key];
        return next;
      });
      setStates((prev) => {
        const next = { ...prev };
        for (const key of targets) next[key] = { saving: false, error: null, savedAt: Date.now() };
        return next;
      });
      toast.success(
        targets.length === 1
          ? `${SECTION_META[targets[0]].label} sent for review`
          : `${targets.length} sections sent for review`,
        { description: "An editor will review and publish your changes. Track them under Review." }
      );
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      setStates((prev) => {
        const next = { ...prev };
        for (const key of targets) next[key] = { ...(prev[key] ?? IDLE), saving: false, error: message };
        return next;
      });
      toast.error("Couldn't submit for review", { description: message });
      return false;
    } finally {
      setPublishing(false);
    }
  }, []); // pendingTargets only reads refs

  const sectionState = useCallback((key: SectionKey) => states[key] ?? IDLE, [states]);

  const value = useMemo<DraftContextValue>(
    () => ({ effective, dirtyKeys, publishing, canPublish, getDraft, setDraft, discard, publish, submit, sectionState }),
    [effective, dirtyKeys, publishing, canPublish, getDraft, setDraft, discard, publish, submit, sectionState]
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
};

export function useDrafts(): DraftContextValue {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDrafts must be used inside <DraftProvider>");
  return ctx;
}
