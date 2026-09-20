import React, { useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import type { User } from "@supabase/supabase-js";
import {
  Building2,
  CalendarClock,
  ChevronLeft,
  ClipboardCheck,
  ExternalLink,
  FileText,
  Handshake,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  PanelBottom,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Target,
  UserCog,
  Users,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { initials } from "../format";
import { roleStyle } from "../permissions";
import whiteLogo from "@/assets/reliance_logo.png";

interface NavItem {
  to: string;
  end?: boolean;
  label: string;
  icon: LucideIcon;
}

interface NavGroup {
  heading: string | null;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    heading: null,
    items: [
      { to: "/dashboard", end: true, label: "Overview", icon: LayoutDashboard },
      { to: "/dashboard/review", label: "Review", icon: ClipboardCheck },
    ],
  },
  {
    heading: "Pages",
    items: [
      { to: "/dashboard/hero", label: "Home hero", icon: Sparkles },
      { to: "/dashboard/about-home", label: "Home — about", icon: LayoutTemplate },
      { to: "/dashboard/purpose", label: "Mission & vision", icon: Target },
      { to: "/dashboard/businesses", label: "Businesses", icon: Building2 },
      { to: "/dashboard/leadership", label: "Leadership", icon: Users },
      { to: "/dashboard/about-page", label: "About page", icon: FileText },
      { to: "/dashboard/timeline", label: "Journey timeline", icon: CalendarClock },
      { to: "/dashboard/brand-partners", label: "Brand partners", icon: Handshake },
      { to: "/dashboard/contact", label: "Contact page", icon: Mail },
    ],
  },
  {
    heading: "Site",
    items: [
      { to: "/dashboard/footer", label: "Footer & nav", icon: PanelBottom },
      { to: "/dashboard/media", label: "Media library", icon: ImageIcon },
      { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
  {
    heading: "Administration",
    items: [
      { to: "/dashboard/users", label: "Users", icon: UserCog },
      { to: "/dashboard/roles", label: "Roles & permissions", icon: ShieldCheck },
      { to: "/dashboard/activity", label: "Activity", icon: History },
    ],
  },
];

export const ACCOUNT_NAV_ITEM: NavItem = { to: "/dashboard/account", label: "My account", icon: UserCog };

export const ALL_NAV_ITEMS = [...NAV_GROUPS.flatMap((g) => g.items), ACCOUNT_NAV_ITEM];

const EXPANDED_WIDTH = 264;
const COLLAPSED_WIDTH = 76;

/** The white logo, or just its JB mark when collapsed. */
const Brand: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
  <div
    className="relative h-9 overflow-hidden transition-[width] duration-300 ease-out"
    style={{ width: collapsed ? 30 : 164 }}
  >
    <img
      src={whiteLogo}
      alt="JB Group"
      draggable={false}
      className="absolute top-0 h-9 w-auto max-w-none select-none transition-[left] duration-300 ease-out"
      // The mark sits ~150px into the 1340×294 artwork; shift it flush left when collapsed.
      style={{ left: collapsed ? -18 : 0 }}
    />
  </div>
);

interface Tip {
  label: string;
  top: number;
  left: number;
}

const Sidebar: React.FC<{
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  dirtyRoutes: Set<string>;
  /** Hides pages this person can't open. */
  canOpen: (route: string) => boolean;
  /** Counters shown beside nav items, keyed by route. */
  badges: Record<string, number>;
  user: User;
  displayName: string;
  role: string;
  roleLabel: string;
  onSignOut: () => void;
}> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  dirtyRoutes,
  canOpen,
  badges,
  user,
  displayName,
  role,
  roleLabel,
  onSignOut,
}) => {
  const [tip, setTip] = useState<Tip | null>(null);
  const asideRef = useRef<HTMLElement>(null);

  // Tooltips render in a fixed layer so the scrolling nav can't clip them.
  const tipProps = (label: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => showTip(e.currentTarget, label),
    onFocus: (e: React.FocusEvent<HTMLElement>) => showTip(e.currentTarget, label),
    onMouseLeave: () => setTip(null),
    onBlur: () => setTip(null),
  });

  const showTip = (el: HTMLElement, label: string) => {
    if (!collapsed) return;
    const r = el.getBoundingClientRect();
    const right = asideRef.current?.getBoundingClientRect().right ?? r.right;
    setTip({ label, top: r.top + r.height / 2, left: right + 10 });
  };

  const groups = NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => canOpen(i.to)) })).filter(
    (g) => g.items.length > 0
  );

  return (
    <>
      <aside
        ref={asideRef}
        style={{ ["--sidebar-w" as string]: `${collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH}px` }}
        className={`dash-sidebar group/sidebar fixed lg:sticky lg:top-0 inset-y-0 left-0 z-50 h-screen shrink-0 flex flex-col text-white w-72 lg:w-[var(--sidebar-w)] transition-[width,transform] duration-300 ease-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand */}
        <div
          className={`relative h-[72px] shrink-0 flex items-center border-b border-white/[0.06] ${
            collapsed ? "lg:justify-center lg:px-0 px-6" : "px-6"
          }`}
        >
          <a href="/dashboard" className="flex items-center" aria-label="Dashboard home">
            <Brand collapsed={collapsed} />
          </a>

          <button
            onClick={onCloseMobile}
            className="lg:hidden ml-auto p-1.5 text-white/60 hover:text-white bg-white/5"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>

          {/* Collapse toggle, docked on the sidebar edge */}
          <button
            type="button"
            onClick={onToggleCollapse}
            {...tipProps("Expand sidebar")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? undefined : "Collapse sidebar (Ctrl+B)"}
            className="dash-collapse-btn hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center bg-white text-slate-500 hover:text-slate-900 ring-1 ring-slate-200 shadow-md opacity-0 group-hover/sidebar:opacity-100 focus-visible:opacity-100"
            style={{ borderRadius: 9999 }}
          >
            <ChevronLeft
              size={14}
              strokeWidth={2.5}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="dash-nav-scroll flex-1 overflow-y-auto overflow-x-hidden py-4" onScroll={() => setTip(null)}>
          {groups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-4" : undefined}>
              {group.heading && (
                <div className="relative h-7 flex items-center px-6 mb-1">
                  <p
                    className={`text-[10.5px] font-bold uppercase tracking-[0.14em] text-white/30 whitespace-nowrap transition-opacity duration-200 ${
                      collapsed ? "lg:opacity-0" : ""
                    }`}
                  >
                    {group.heading}
                  </p>
                  <span
                    className={`absolute left-1/2 -translate-x-1/2 w-6 h-px bg-white/10 transition-opacity duration-200 hidden lg:block ${
                      collapsed ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </div>
              )}

              <ul className="space-y-0.5 px-3">
                {group.items.map(({ to, end, label, icon: Icon }) => {
                  const dirty = dirtyRoutes.has(to);
                  const badge = badges[to] ?? 0;
                  return (
                    <li key={to} className="relative">
                      <NavLink
                        to={to}
                        end={end}
                        onClick={() => {
                          setTip(null);
                          onCloseMobile();
                        }}
                        {...tipProps(badge ? `${label} · ${badge} waiting` : dirty ? `${label} · unpublished` : label)}
                        className={({ isActive }) =>
                          `group/item relative flex items-center h-10 rounded-[10px] outline-none transition-colors duration-200 ${
                            collapsed ? "lg:justify-center lg:px-0 px-3 gap-3" : "px-3 gap-3"
                          } ${isActive ? "text-white" : "text-white/55 hover:text-white hover:bg-white/[0.05]"}`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <motion.span
                                layoutId="dash-nav-active"
                                className="absolute inset-0 rounded-[10px] bg-gradient-to-r from-white/[0.12] to-white/[0.05] ring-1 ring-inset ring-white/[0.08]"
                                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                              />
                            )}
                            {isActive && (
                              <motion.span
                                layoutId="dash-nav-bar"
                                className="absolute -left-3 top-2 bottom-2 w-[3px] rounded-r-full bg-[var(--dash-gold)] shadow-[0_0_12px_rgba(203,151,51,0.6)]"
                                transition={{ type: "spring", stiffness: 500, damping: 40 }}
                              />
                            )}
                            <span className="relative shrink-0">
                              <Icon
                                size={18}
                                strokeWidth={isActive ? 2.25 : 1.9}
                                className={`transition-transform duration-200 group-hover/item:scale-110 ${
                                  isActive ? "text-[var(--dash-gold)]" : ""
                                }`}
                              />
                              {badge > 0 && collapsed && (
                                <span className="hidden lg:flex absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-500 text-[9.5px] font-bold text-white items-center justify-center ring-2 ring-[var(--dash-brand)]">
                                  {badge}
                                </span>
                              )}
                              {dirty && !badge && collapsed && (
                                <span className="hidden lg:block absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[var(--dash-brand)]" />
                              )}
                            </span>
                            <span
                              className={`relative flex-1 truncate text-[13.5px] whitespace-nowrap transition-opacity duration-200 ${
                                isActive ? "font-semibold" : "font-medium"
                              } ${collapsed ? "lg:hidden" : ""}`}
                            >
                              {label}
                            </span>
                            {badge > 0 ? (
                              <span
                                className={`relative min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500 text-[11px] font-bold text-white flex items-center justify-center shrink-0 ${
                                  collapsed ? "lg:hidden" : ""
                                }`}
                              >
                                {badge}
                              </span>
                            ) : (
                              dirty && (
                                <span
                                  className={`relative w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 ${
                                    collapsed ? "lg:hidden" : ""
                                  }`}
                                />
                              )
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Account */}
        <div className="shrink-0 p-3 border-t border-white/[0.06]">
          <div
            className={`flex items-center gap-2.5 rounded-xl bg-white/[0.04] ring-1 ring-inset ring-white/[0.05] ${
              collapsed ? "lg:flex-col lg:bg-transparent lg:ring-0 lg:p-0 p-2" : "p-2"
            }`}
          >
            <Link
              to="/dashboard/account"
              onClick={onCloseMobile}
              {...tipProps(`My account · ${roleLabel}`)}
              className={`group/acct flex items-center gap-2.5 min-w-0 rounded-lg ${collapsed ? "lg:flex-none" : "flex-1"}`}
            >
              <span
                className={`w-9 h-9 shrink-0 flex items-center justify-center text-[12.5px] font-bold bg-gradient-to-br shadow-sm transition-transform group-hover/acct:scale-105 ${
                  roleStyle(role).avatar
                }`}
                style={{ borderRadius: 10 }}
              >
                {initials(displayName, user.email ?? "")}
              </span>
              <span className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
                <span className="block text-[12.5px] font-semibold text-white truncate group-hover/acct:text-[#e0b458]">
                  {displayName || user.email}
                </span>
                <span className="block text-[11px] text-white/40 truncate">{roleLabel}</span>
              </span>
            </Link>
            <div className={`flex items-center gap-0.5 ${collapsed ? "lg:flex-col" : ""}`}>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                {...tipProps("View website")}
                title={collapsed ? undefined : "View website"}
                aria-label="View website"
                className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition"
              >
                <ExternalLink size={16} />
              </a>
              <button
                type="button"
                onClick={onSignOut}
                {...tipProps("Sign out")}
                title={collapsed ? undefined : "Sign out"}
                aria-label="Sign out"
                className="p-2 text-white/50 hover:text-rose-300 hover:bg-rose-400/10"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <AnimatePresence>
        {tip && collapsed && (
          <motion.div
            key={tip.label}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="hidden lg:block fixed z-[70] pointer-events-none"
            style={{ top: tip.top, left: tip.left }}
          >
            <div className="-translate-y-1/2 relative whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[12px] font-semibold text-white shadow-lg ring-1 ring-white/10">
              <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 rotate-45 bg-slate-900" />
              <span className="relative">{tip.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
