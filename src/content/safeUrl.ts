/**
 * Link targets in the CMS are free text, and React does not block dangerous
 * URL schemes — on React 18 a `javascript:` href only logs a warning and still
 * renders, so an editor could otherwise ship a link that runs script in every
 * visitor's browser. Every href that comes from content goes through here.
 *
 * Relative paths, hashes and query strings are left exactly as they are; only
 * absolute URLs are checked, and only against a small allowlist of schemes.
 */
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

export function safeUrl(raw: string | undefined | null, fallback = "#"): string {
  const value = (raw ?? "").trim();
  if (!value) return fallback;

  // Checked before the relative case below, because "//host" also starts with
  // a slash: it is scheme-relative and navigates off-site, not a local path.
  if (value.startsWith("//")) return fallback;

  // Relative to the site: a path, a fragment, or a query. Always safe.
  if (/^[/#?]/.test(value)) return value;

  // Anything with a scheme must be on the allowlist. Control characters are
  // stripped first, because "java\tscript:" is still parsed as javascript:.
  const stripped = value.replace(/[\u0000-\u001F\u007F]/g, "");
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(stripped)) {
    try {
      if (ALLOWED_PROTOCOLS.has(new URL(stripped).protocol)) return stripped;
    } catch {
      return fallback;
    }
    return fallback;
  }

  // No scheme and no leading slash — treat as a relative path.
  return value;
}
