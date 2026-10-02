import DOMPurify from "dompurify";

/** Inline styles the editor produces; anything else is stripped. */
const ALLOWED_STYLE = /^\s*(text-align|color|background-color)\s*:\s*[#a-z0-9(),.%\s-]+$/i;

let configured = false;
function configure() {
  if (configured) return;
  configured = true;
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node instanceof HTMLAnchorElement && node.getAttribute("href")) {
      const external = /^https?:\/\//i.test(node.getAttribute("href") ?? "");
      if (external) {
        node.setAttribute("target", "_blank");
        node.setAttribute("rel", "noopener noreferrer");
      }
    }
    if (node instanceof HTMLImageElement) {
      node.setAttribute("loading", "lazy");
      node.setAttribute("decoding", "async");
    }
    const style = node.getAttribute?.("style");
    if (style) {
      const kept = style
        .split(";")
        .filter((rule) => ALLOWED_STYLE.test(rule))
        .join(";");
      if (kept) node.setAttribute("style", kept);
      else node.removeAttribute("style");
    }
  });
}

/**
 * Cleans blog HTML before it is rendered on the public site. Posts are written
 * by trusted editors, but a sanitiser means a pasted snippet or a compromised
 * account still can't run script in a visitor's browser.
 */
export function sanitizeHtml(html: string): string {
  configure();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "mark", "span",
      "a", "ul", "ol", "li", "blockquote", "hr", "code", "pre", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td", "colgroup", "col",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title", "style", "colspan", "rowspan", "data-color"],
    ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|tel:|\/|#)/i,
  });
}
