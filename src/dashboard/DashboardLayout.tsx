import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { Toaster } from "sonner";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  ExternalLink,
  FileText,
  Handshake,
  Image as ImageIcon,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Mail,
  Menu,
  PanelBottom,
  RefreshCw,
  Settings as SettingsIcon,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useContentStore } from "../content/ContentProvider";
import LoginPage from "./LoginPage";
import "./dashboard.css";

interface NavItem {
  to: string;
  end?: boolean;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}

interface NavGroup {
  heading: string | null;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: null,
    items: [{ to: "/dashboard", end: true, label: "Overview", icon: LayoutDashboard }],
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
];

const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

function useCurrentPageLabel(pathname: string): string {
  return useMemo(() => {
    const exact = ALL_ITEMS.find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to)));
    return exact?.label ?? "Dashboard";
  }, [pathname]);
}

const ConnectionPill: React.FC<{
  status: ReturnType<typeof useContentStore>["status"];
  usingDefaults: boolean;
}> = ({ status, usingDefaults }) => {
  if (usingDefaults) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Local defaults
      </span>
    );
  }
  if (status === "loading") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" /> Syncing
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[var(--dash-danger-soft)] text-[var(--dash-danger)]">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--dash-danger)]" /> Connection issue
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full bg-[var(--dash-success-soft)] text-[var(--dash-success)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--dash-success)]" /> Live
    </span>
  );
};

const DashboardLayout: React.FC = () => {
  const { user, loading, signOut, configured } = useAuth();
  const { status, usingDefaults, error, refresh } = useContentStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const pageLabel = useCurrentPageLabel(location.pathname);

  if (loading) {
    return (
      <div className="dash min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  // Unauthenticated (or unconfigured) visitors never see the editors.
  if (!configured || !user) return <LoginPage />;

  return (
    <div className="dash min-h-screen flex">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: 12,
            fontSize: 13,
            fontFamily: "inherit",
          },
        }}
      />

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 shrink-0 bg-[var(--dash-brand)] text-white flex flex-col transition-transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-6 py-6 border-b border-white/5 flex items-center gap-3">
          <div
            className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#cb9733] to-[#a97a20] flex items-center justify-center font-bold text-[14px] text-[var(--dash-brand)] shadow-sm"
            style={{ borderRadius: 12 }}
          >
            JB
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[14px] font-bold tracking-tight">JB Group</p>
            <p className="text-[11.5px] text-white/40 font-medium truncate mt-0.5">Content dashboard</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="lg:hidden p-1.5 text-white/60 hover:text-white shrink-0 bg-white/5 rounded-lg"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_GROUPS.map((group, gi) => (
            <div key={gi} className={gi > 0 ? "mt-5" : undefined}>
              {group.heading && (
                <p className="px-6 mt-6 mb-2 text-[10.5px] font-bold uppercase tracking-widest text-white/30">
                  {group.heading}
                </p>
              )}
              {group.items.map(({ to, end, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `dash-sidebar-link flex items-center gap-3 px-3 py-2.5 mx-3 mb-1 text-[13.5px] transition-all duration-200 ${
                      isActive
                        ? "font-medium shadow-sm"
                        : "text-white/60 hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <span
                      className="flex items-center gap-3 w-full"
                      data-active={isActive}
                    >
                      <Icon size={16} className={isActive ? "text-[var(--dash-gold)]" : ""} />
                      {label}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 space-y-2.5">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[12px] font-medium text-white/60 hover:text-white transition"
          >
            <ExternalLink size={14} /> View website
          </a>
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-2 text-[12px] font-medium text-white/60 hover:text-white transition"
          >
            <LogOut size={14} /> Sign out
          </button>
          <div className="flex items-center gap-2 pt-2 mt-1 border-t border-white/5">
            <span
              className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-white/70 shrink-0"
              style={{ borderRadius: 9999 }}
            >
              {(user.email ?? "?").slice(0, 1).toUpperCase()}
            </span>
            <p className="text-[11px] text-white/40 truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 px-6 lg:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
          <button
            onClick={() => setMenuOpen(true)}
            className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight truncate leading-tight">
              {pageLabel}
            </h1>
          </div>
          <ConnectionPill status={status} usingDefaults={usingDefaults} />
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition"
          >
            <ExternalLink size={13} /> View site
          </a>
        </header>

        <main className="flex-1 px-6 lg:px-10 py-8 max-w-5xl w-full mx-auto">
          {status === "error" && (
            <div className="text-[12.5px] leading-relaxed rounded-xl px-4 py-3 mb-5 border flex items-start gap-2.5 bg-[var(--dash-danger-soft)] border-[var(--dash-danger-border)] text-[#991b1b]">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Could not reach the database</p>
                <p className="mt-0.5 text-[#b91c1c]">
                  Showing built-in defaults — saving may fail until this is resolved.
                  {error ? ` (${error})` : ""}
                </p>
              </div>
              <button
                onClick={() => void refresh()}
                className="shrink-0 inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 rounded-lg bg-white/70 hover:bg-white transition"
              >
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
