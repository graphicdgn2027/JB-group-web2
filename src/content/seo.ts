import { useEffect } from "react";
import { useContentStore } from "./ContentProvider";

export interface SeoOptions {
  /** Public path of the page, e.g. "/about". Matches dashboard overrides. */
  path: string;
  /** The page's own title, used when the dashboard leaves it empty. */
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
  noindex?: boolean;
  /** Extra structured data for this page (Article, BreadcrumbList…). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  publishedTime?: string;
  modifiedTime?: string;
}

const JSON_LD_ID = "page-jsonld";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Turns "/assets/x.jpg" into an absolute URL; share crawlers need one. */
export function absoluteUrl(siteUrl: string, value: string): string {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl.replace(/\/+$/, "")}/${value.replace(/^\/+/, "")}`;
}

/** Plain text from editor HTML, for descriptions and word counts. */
export function htmlToText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

/**
 * Sets the page's title, description, canonical link, share tags, robots rule
 * and structured data. Dashboard overrides for the path win over the page's
 * own values, which win over the site-wide defaults.
 *
 * This runs in the browser. Google renders JavaScript and reads all of it;
 * some share-preview crawlers (Facebook, LinkedIn, WhatsApp) only read the
 * initial HTML, so they see the site-wide defaults from index.html.
 */
export function useSeo(opts: SeoOptions) {
  const { content } = useContentStore();
  const seo = content.seo;
  const override = seo.pages.find((p) => p.path === opts.path);

  const siteName = seo.siteName || content.settings.siteTitle || "JB Group";
  const pageTitle = override?.title || opts.title || "";
  const fullTitle = pageTitle ? `${pageTitle}${seo.titleSeparator || " | "}${siteName}` : siteName;
  const description = truncate(
    override?.description || opts.description || seo.defaultDescription || content.settings.metaDescription,
    300
  );
  const image = absoluteUrl(seo.siteUrl, override?.image || opts.image || seo.defaultImage);
  const canonical = absoluteUrl(seo.siteUrl, opts.path === "/" ? "/" : opts.path);
  const noindex = Boolean(opts.noindex || override?.noindex);
  const jsonLdKey = JSON.stringify(opts.jsonLd ?? null);

  useEffect(() => {
    document.title = fullTitle;
    setMeta("name", "description", description);
    setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    setCanonical(canonical);

    setMeta("property", "og:site_name", siteName);
    setMeta("property", "og:type", opts.type ?? "website");
    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:image", image);
    setMeta("property", "article:published_time", opts.publishedTime ?? "");
    setMeta("property", "article:modified_time", opts.modifiedTime ?? "");
    setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", image);
    setMeta("name", "twitter:site", seo.twitterHandle ? `@${seo.twitterHandle.replace(/^@/, "")}` : "");

    document.getElementById(JSON_LD_ID)?.remove();
    const data = jsonLdKey !== "null" ? JSON.parse(jsonLdKey) : null;
    if (data) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = JSON_LD_ID;
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
    }
    return () => document.getElementById(JSON_LD_ID)?.remove();
  }, [
    fullTitle,
    description,
    canonical,
    image,
    noindex,
    siteName,
    seo.twitterHandle,
    opts.type,
    opts.publishedTime,
    opts.modifiedTime,
    jsonLdKey,
  ]);
}

/** Organization structured data, built from the dashboard's SEO settings. */
export function useOrganizationJsonLd(): Record<string, unknown> {
  const { content } = useContentStore();
  const seo = content.seo;
  const sameAs = seo.profileLinks.map((l) => l.href).filter((h) => /^https?:\/\//i.test(h));
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seo.organizationName || seo.siteName,
    url: seo.siteUrl,
    ...(seo.organizationLogo ? { logo: absoluteUrl(seo.siteUrl, seo.organizationLogo) } : {}),
    ...(seo.organizationEmail ? { email: seo.organizationEmail } : {}),
    ...(seo.organizationPhone ? { telephone: seo.organizationPhone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
