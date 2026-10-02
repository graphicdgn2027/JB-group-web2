import type { BlogPost } from "./types";
import { htmlToText } from "./seo";

/** Published posts, newest first. */
export function publishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts
    .filter((p) => p.published && p.slug)
    .sort((a, b) => (b.publishedAt || "").localeCompare(a.publishedAt || ""));
}

export function wordCount(html: string): number {
  const text = htmlToText(html);
  return text ? text.split(" ").length : 0;
}

/** Minutes to read at roughly 220 words a minute, never less than one. */
export function readingMinutes(html: string): number {
  return Math.max(1, Math.round(wordCount(html) / 220));
}

export function formatPostDate(value: string): string {
  if (!value) return "";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** "Hello, Nepal!" becomes "hello-nepal". */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
