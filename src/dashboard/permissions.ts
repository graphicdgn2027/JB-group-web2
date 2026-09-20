import type { SectionKey } from "../content/types";
import { WORK_AREAS } from "./sections";

/**
 * Mirrors the permission model in supabase/schema.sql. The database is the
 * real gatekeeper; this only decides what the dashboard shows.
 */
export const PERMISSIONS = [
  {
    key: "content.edit",
    label: "Edit content",
    description: "Change text, images and lists on the pages they have access to.",
    group: "Content",
  },
  {
    key: "content.publish",
    label: "Publish & approve",
    description: "Put changes live, and approve or reject work submitted for review.",
    group: "Content",
  },
  {
    key: "media.upload",
    label: "Upload media",
    description: "Add new images to the media library.",
    group: "Media",
  },
  {
    key: "media.delete",
    label: "Delete media",
    description: "Permanently remove images from the media library.",
    group: "Media",
  },
  {
    key: "settings.manage",
    label: "Site settings",
    description: "Change the site title, brand colours and loading screen.",
    group: "Site",
  },
  {
    key: "activity.view",
    label: "Activity log",
    description: "See who changed what, and when.",
    group: "Site",
  },
  {
    key: "users.manage",
    label: "Manage users",
    description: "Add, edit, disable and remove dashboard accounts.",
    group: "Administration",
  },
] as const;

export type Permission = (typeof PERMISSIONS)[number]["key"];

export const ROLE_KEYS = ["super_admin", "admin", "editor", "content_creator", "viewer"] as const;
export type RoleKey = (typeof ROLE_KEYS)[number];

export interface RoleDef {
  key: string;
  label: string;
  description: string;
  permissions: Partial<Record<Permission, boolean>>;
  rank: number;
  locked: boolean;
}

/** Visual identity per role, used for badges and avatars. */
const ROLE_STYLES: Record<string, { badge: string; dot: string; avatar: string }> = {
  super_admin: {
    badge: "bg-amber-50 text-amber-800 ring-amber-200",
    dot: "bg-amber-500",
    avatar: "from-[#e0b458] to-[#a97a20] text-[#0f172a]",
  },
  admin: {
    badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    dot: "bg-indigo-500",
    avatar: "from-indigo-400 to-indigo-600 text-white",
  },
  editor: {
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    dot: "bg-sky-500",
    avatar: "from-sky-400 to-sky-600 text-white",
  },
  content_creator: {
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
    avatar: "from-emerald-400 to-emerald-600 text-white",
  },
  viewer: {
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
    avatar: "from-slate-300 to-slate-500 text-white",
  },
};

export function roleStyle(key: string) {
  return ROLE_STYLES[key] ?? ROLE_STYLES.viewer;
}

export interface AccessProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  role_label: string;
  sections: string[] | null;
  active: boolean;
  permissions: Partial<Record<Permission, boolean>>;
}

export interface Access {
  profile: AccessProfile;
  isSuperAdmin: boolean;
  can: (permission: Permission) => boolean;
  /** May edit (and, with content.publish, publish) this section. */
  canEditSection: (key: SectionKey) => boolean;
  canPublish: boolean;
  /** Can open this dashboard route at all. */
  canOpenRoute: (pathname: string) => boolean;
}

export function buildAccess(profile: AccessProfile): Access {
  const isSuperAdmin = profile.active && profile.role === "super_admin";
  const can = (p: Permission) => profile.active && (isSuperAdmin || profile.permissions[p] === true);

  const canEditSection = (key: SectionKey) =>
    can("content.edit") &&
    (key !== "settings" || can("settings.manage")) &&
    (isSuperAdmin || profile.sections === null || profile.sections.includes(key));

  const canOpenRoute = (pathname: string) => {
    const path = pathname.replace(/\/+$/, "") || "/dashboard";
    if (path === "/dashboard" || path === "/dashboard/account") return true;
    const area = WORK_AREAS.find((a) => a.route === path);
    if (area) return area.keys.every(canEditSection);
    switch (path) {
      case "/dashboard/media":
        return can("media.upload") || can("media.delete") || can("content.edit");
      case "/dashboard/review":
        return can("content.publish") || can("content.edit");
      case "/dashboard/users":
        return can("users.manage");
      case "/dashboard/roles":
        return isSuperAdmin;
      case "/dashboard/activity":
        return can("activity.view");
      default:
        return false;
    }
  };

  return {
    profile,
    isSuperAdmin,
    can,
    canEditSection,
    canPublish: can("content.publish"),
    canOpenRoute,
  };
}

/** Plain-language summary of a role's reach, for cards and tooltips. */
export function describePermissions(perms: Partial<Record<Permission, boolean>>, isSuper = false): string[] {
  if (isSuper) return ["Everything, including users and roles"];
  const out: string[] = [];
  if (perms["content.edit"]) out.push(perms["content.publish"] ? "Edit & publish content" : "Edit content (needs review)");
  else if (perms["content.publish"]) out.push("Publish content");
  if (perms["media.upload"] || perms["media.delete"]) {
    out.push(perms["media.delete"] ? "Upload & delete media" : "Upload media");
  }
  if (perms["settings.manage"]) out.push("Site settings");
  if (perms["activity.view"]) out.push("Activity log");
  if (perms["users.manage"]) out.push("Manage users");
  return out.length ? out : ["View only"];
}

/** Expands chosen work areas into stored section keys. */
export function areasToSections(areaIds: string[]): SectionKey[] {
  return WORK_AREAS.filter((a) => areaIds.includes(a.id)).flatMap((a) => a.keys);
}

/** Work areas fully covered by a stored section list. */
export function sectionsToAreas(sections: string[] | null): string[] | null {
  if (sections === null) return null;
  return WORK_AREAS.filter((a) => a.keys.every((k) => sections.includes(k))).map((a) => a.id);
}
