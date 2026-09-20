import type { SectionKey, SiteContent } from "../content/types";

export interface SectionMeta {
  label: string;
  /** Dashboard page that edits this section. */
  route: string;
  /** Public page where this section is visible. */
  previewPath: (content: SiteContent) => string;
}

const firstBusinessPath = (content: SiteContent) => {
  const first = [...content.businesses]
    .filter((b) => b.published && b.slug)
    .sort((a, b) => a.order - b.order)[0];
  return first ? `/portfolio/${first.slug}` : "/";
};

export const SECTION_META: Record<SectionKey, SectionMeta> = {
  hero: { label: "Home hero", route: "/dashboard/hero", previewPath: () => "/" },
  aboutHome: { label: "Home — about", route: "/dashboard/about-home", previewPath: () => "/#about" },
  purpose: { label: "Mission & vision", route: "/dashboard/purpose", previewPath: () => "/#brands" },
  businessesSection: {
    label: "Businesses heading",
    route: "/dashboard/businesses",
    previewPath: () => "/",
  },
  businesses: { label: "Businesses", route: "/dashboard/businesses", previewPath: firstBusinessPath },
  leadership: { label: "Leadership", route: "/dashboard/leadership", previewPath: () => "/leadership" },
  aboutPage: { label: "About page", route: "/dashboard/about-page", previewPath: () => "/about" },
  timeline: { label: "Journey timeline", route: "/dashboard/timeline", previewPath: () => "/about#journey" },
  brandPartners: {
    label: "Brand partners",
    route: "/dashboard/brand-partners",
    previewPath: () => "/brand-partners",
  },
  contact: { label: "Contact page", route: "/dashboard/contact", previewPath: () => "/contact" },
  footer: { label: "Footer", route: "/dashboard/footer", previewPath: () => "/contact" },
  nav: { label: "Navigation", route: "/dashboard/footer", previewPath: () => "/" },
  settings: { label: "Settings", route: "/dashboard/settings", previewPath: () => "/" },
};

/**
 * Dashboard pages as people think of them. A user's page access is chosen from
 * these, and stored as the underlying section keys.
 */
export interface WorkArea {
  id: string;
  label: string;
  route: string;
  keys: SectionKey[];
}

export const WORK_AREAS: WorkArea[] = [
  { id: "hero", label: "Home hero", route: "/dashboard/hero", keys: ["hero"] },
  { id: "about-home", label: "Home — about", route: "/dashboard/about-home", keys: ["aboutHome"] },
  { id: "purpose", label: "Mission & vision", route: "/dashboard/purpose", keys: ["purpose"] },
  {
    id: "businesses",
    label: "Businesses",
    route: "/dashboard/businesses",
    keys: ["businessesSection", "businesses"],
  },
  { id: "leadership", label: "Leadership", route: "/dashboard/leadership", keys: ["leadership"] },
  { id: "about-page", label: "About page", route: "/dashboard/about-page", keys: ["aboutPage"] },
  { id: "timeline", label: "Journey timeline", route: "/dashboard/timeline", keys: ["timeline"] },
  { id: "brand-partners", label: "Brand partners", route: "/dashboard/brand-partners", keys: ["brandPartners"] },
  { id: "contact", label: "Contact page", route: "/dashboard/contact", keys: ["contact"] },
  { id: "footer", label: "Footer & nav", route: "/dashboard/footer", keys: ["footer", "nav"] },
  { id: "settings", label: "Settings", route: "/dashboard/settings", keys: ["settings"] },
];

/** Which section a dashboard page primarily previews. */
const ROUTE_SECTION: Record<string, SectionKey> = {
  "/dashboard/hero": "hero",
  "/dashboard/about-home": "aboutHome",
  "/dashboard/purpose": "purpose",
  "/dashboard/businesses": "businesses",
  "/dashboard/leadership": "leadership",
  "/dashboard/about-page": "aboutPage",
  "/dashboard/timeline": "timeline",
  "/dashboard/brand-partners": "brandPartners",
  "/dashboard/contact": "contact",
  "/dashboard/footer": "footer",
  "/dashboard/settings": "settings",
};

export function previewPathForRoute(pathname: string, content: SiteContent): string {
  const key = ROUTE_SECTION[pathname.replace(/\/+$/, "")];
  return key ? SECTION_META[key].previewPath(content) : "/";
}

/** Public pages offered in the preview page picker and on the Overview. */
export function publicPages(content: SiteContent): { label: string; path: string }[] {
  const pages = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Leadership", path: "/leadership" },
    { label: "Brand partners", path: "/brand-partners" },
    { label: "Contact", path: "/contact" },
  ];
  const businesses = [...content.businesses]
    .filter((b) => b.published && b.slug)
    .sort((a, b) => a.order - b.order)
    .map((b) => ({ label: b.title || b.slug, path: `/portfolio/${b.slug}` }));
  return [...pages, ...businesses];
}
