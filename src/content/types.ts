/**
 * The shape of every piece of editable site content.
 *
 * Each top-level key of `SiteContent` is stored as one row in the Supabase
 * `site_content` table (`id` = the key, `data` = the value as jsonb), so a
 * section can be saved and rolled back independently of the others.
 *
 * Every list item carries a stable `id` so the dashboard can reorder and delete
 * rows without React key churn.
 */

export interface Identified {
  id: string;
}

/* ---------------------------------------------------------------- home hero */

export interface HeroSlide extends Identified {
  image: string;
  eyebrow: string;
  label: string;
  titleTop: string;
  titleBottom: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface HeroContent {
  slideDurationMs: number;
  slides: HeroSlide[];
}

/* -------------------------------------------------------- home about block */

export interface StatItem extends Identified {
  value: string;
  label: string;
}

export interface AboutHomeContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  image: string;
  dropCap: string;
  paragraphs: string[];
  stats: StatItem[];
  ctaLabel: string;
  ctaHref: string;
}

/* ------------------------------------------------------ mission and vision */

export interface PurposeItem extends Identified {
  label: string;
  title: string;
  text: string;
}

export interface PurposeContent {
  eyebrow: string;
  items: PurposeItem[];
}

/* ----------------------------------------------------------- the portfolio */

export interface BusinessStat extends Identified {
  label: string;
  value: string;
}

export interface BusinessBrand extends Identified {
  name: string;
  logo: string;
  fallbackText?: string;
}

export interface BusinessFeature extends Identified {
  title: string;
  description: string;
  image: string;
}

export interface Business extends Identified {
  /** URL segment used by `/portfolio/:slug`. */
  slug: string;
  title: string;
  /** Key into `ICON_REGISTRY`. */
  icon: string;
  /** Card image used on the home grid. */
  cardImage: string;
  /** Wide hero image used on the detail page. */
  heroImage: string;
  logo?: string;
  description: string;
  overview: string;
  details: string[];
  stats: BusinessStat[];
  features: BusinessFeature[];
  brands: BusinessBrand[];
  gallery: string[];
  /** Unpublished businesses disappear from every public listing and route. */
  published: boolean;
  order: number;
}

export interface BusinessesSectionContent {
  subtitle: string;
  titleLine1: string;
  titleLine2: string;
  intro: string;
}

/* ----------------------------------------------------------- the leadership */

export interface Leader extends Identified {
  name: string;
  role: string;
  photo: string;
  /** Rendered as separate paragraphs; the first one gets the drop cap. */
  bio: string[];
  published: boolean;
  order: number;
}

export interface LeadershipContent {
  heroTitleTop: string;
  heroTitleBottom: string;
  heroSubtitle: string;
  heroImage: string;
  heritageHeading: string;
  heritageParagraphs: string[];
  pullQuote: string;
  boardHeading: string;
  closingQuote: string;
  closingImage: string;
  leaders: Leader[];
}

/* -------------------------------------------------------------- the journey */

export interface TimelineItem extends Identified {
  year: string;
  title: string;
  desc: string;
}

export interface TimelineContent {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  items: TimelineItem[];
}

/* ------------------------------------------------------------- about page */

export interface LabelledText extends Identified {
  title: string;
  text: string;
}

export interface AboutPageContent {
  heroTitleTop: string;
  heroTitleBottom: string;
  heroSubtitle: string;
  heroImage: string;
  heritageHeading: string;
  heritageParagraphs: string[];
  philosophyHeading: string;
  philosophyItems: LabelledText[];
  quote: string;
  visionTitle: string;
  visionText: string;
  missionTitle: string;
  missionText: string;
  coreValuesHeading: string;
  coreValuesWatermark: string;
  coreValues: LabelledText[];
}

/* ------------------------------------------------------- brand partners page */

export interface BrandPartnersContent {
  heroTitleTop: string;
  heroTitleBottom: string;
  heroSubtitle: string;
  heroImage: string;
  sectionEyebrow: string;
  sectionHeading: string;
  emptyStateText: string;
}

/* ------------------------------------------------------------- contact page */

export interface SocialLink extends Identified {
  /** One of: Linkedin, Twitter, Facebook, Instagram, Youtube. */
  platform: string;
  url: string;
}

export interface SelectOption extends Identified {
  label: string;
}

export interface ContactContent {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  phone: string;
  phoneSub: string;
  email: string;
  emailSub: string;
  addressTitle: string;
  addressSub: string;
  hoursValue: string;
  hoursSub: string;
  hoursNote: string;
  mapEmbedUrl: string;
  mapDirectionsUrl: string;
  socials: SocialLink[];
  inquiryTypes: SelectOption[];
  companies: SelectOption[];
  successTitle: string;
  successMessage: string;
  privacyNote: string;
}

/* ------------------------------------------------------------ footer / nav */

export interface LinkItem extends Identified {
  label: string;
  href: string;
}

export interface FooterContent {
  ctaEyebrow: string;
  ctaTitleTop: string;
  ctaTitleBottom: string;
  ctaButtonLabel: string;
  ctaButtonHref: string;
  tagline: string;
  blurb: string;
  socials: SocialLink[];
  companyHeading: string;
  companyLinks: LinkItem[];
  businessesHeading: string;
  contactHeading: string;
  addressLines: string[];
  contactExtraLink: LinkItem;
  copyright: string;
  watermark: string;
}

export interface NavContent {
  items: LinkItem[];
  megaMenuGroup1Heading: string;
  megaMenuGroup2Heading: string;
}

/* --------------------------------------------------------------- settings */

export interface SettingsContent {
  siteTitle: string;
  metaDescription: string;
  /** Hex. Drives the `--color-brand-blue` token. */
  brandBlue: string;
  /** Hex. Drives the `--color-brand-red` (gold accent) and `--accent` tokens. */
  brandGold: string;
  loaderEnabled: boolean;
  loaderDurationMs: number;
}

/* --------------------------------------------------------------- the whole */

export interface SiteContent {
  hero: HeroContent;
  aboutHome: AboutHomeContent;
  purpose: PurposeContent;
  businessesSection: BusinessesSectionContent;
  businesses: Business[];
  leadership: LeadershipContent;
  timeline: TimelineContent;
  aboutPage: AboutPageContent;
  brandPartners: BrandPartnersContent;
  contact: ContactContent;
  footer: FooterContent;
  nav: NavContent;
  settings: SettingsContent;
}

export type SectionKey = keyof SiteContent;
