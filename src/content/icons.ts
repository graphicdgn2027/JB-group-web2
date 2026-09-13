import {
  Car,
  Zap,
  Briefcase,
  Building2,
  Flame,
  Cpu,
  Store,
  HardHat,
  Truck,
  Factory,
  Globe,
  Leaf,
  Battery,
  Wrench,
  type LucideIcon,
} from "lucide-react";

/**
 * Content is stored as JSON in Supabase, so an icon cannot be a React component.
 * It is stored as one of these string keys and resolved back to a component at
 * render time via `resolveIcon`.
 */
export const ICON_REGISTRY = {
  Zap,
  Flame,
  Car,
  Briefcase,
  Building2,
  Cpu,
  Store,
  HardHat,
  Truck,
  Factory,
  Globe,
  Leaf,
  Battery,
  Wrench,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof ICON_REGISTRY;

export const ICON_KEYS = Object.keys(ICON_REGISTRY) as IconKey[];

/** Falls back to `Briefcase` so an unknown/removed key can never crash a page. */
export function resolveIcon(key: string | undefined | null): LucideIcon {
  if (key && key in ICON_REGISTRY) return ICON_REGISTRY[key as IconKey];
  return Briefcase;
}
