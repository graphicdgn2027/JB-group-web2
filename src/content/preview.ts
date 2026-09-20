import type { SectionKey, SiteContent } from "./types";
import { DEFAULT_CONTENT } from "./defaults";

/**
 * Draft preview plumbing shared by the dashboard and the public site.
 *
 * The dashboard mirrors unpublished drafts into localStorage under this key.
 * A public page opened in preview mode reads them and re-reads on every
 * `storage` event, so the preview updates live while an editor types — without
 * anything reaching the database.
 */
export const PREVIEW_STORAGE_KEY = "jbg-dashboard-drafts";

/**
 * Preview mode is carried on `window.name` rather than sessionStorage: a
 * same-origin iframe shares sessionStorage with the dashboard hosting it, which
 * would put the dashboard itself into preview mode. `window.name` belongs to one
 * browsing context and survives full-page navigations inside it.
 */
export const PREVIEW_WINDOW_NAME = "jbg-preview";

export function isPreviewMode(): boolean {
  if (typeof window === "undefined") return false;
  if (window.location.pathname.startsWith("/dashboard")) return false;
  if (new URLSearchParams(window.location.search).has("preview")) {
    window.name = PREVIEW_WINDOW_NAME;
    return true;
  }
  return window.name.startsWith(PREVIEW_WINDOW_NAME);
}

/** Appends the preview flag to a site path, keeping any #hash at the end. */
export function withPreviewFlag(path: string): string {
  const [pathname, hash] = path.split("#");
  const sep = pathname.includes("?") ? "&" : "?";
  return `${pathname}${sep}preview=1${hash ? `#${hash}` : ""}`;
}

export function readPreviewDrafts(): Partial<SiteContent> {
  try {
    const raw = window.localStorage.getItem(PREVIEW_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Partial<SiteContent> = {};
    for (const key of Object.keys(parsed)) {
      if (key in DEFAULT_CONTENT) {
        (out as Record<string, unknown>)[key as SectionKey] = parsed[key];
      }
    }
    return out;
  } catch {
    return {};
  }
}

export function writePreviewDrafts(drafts: Partial<SiteContent>): void {
  try {
    if (Object.keys(drafts).length === 0) {
      window.localStorage.removeItem(PREVIEW_STORAGE_KEY);
    } else {
      window.localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(drafts));
    }
  } catch {
    // Storage full or blocked: preview simply won't reflect drafts.
  }
}
