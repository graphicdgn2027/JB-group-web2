import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  type LucideIcon,
} from "lucide-react";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
};

/** Falls back to a generic globe so an unknown platform never breaks a render. */
export function resolveSocialIcon(platform: string): LucideIcon {
  return SOCIAL_ICONS[platform] ?? Globe;
}
