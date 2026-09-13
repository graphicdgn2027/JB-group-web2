import React, { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
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

const NAV = [
  { to: "/dashboard", end: true, label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/hero", label: "Home hero", icon: Sparkles },
  { to: "/dashboard/about-home", label: "Home — about", icon: LayoutTemplate },
  { to: "/dashboard/purpose", label: "Mission & vision", icon: Target },
  { to: "/dashboard/businesses", label: "Businesses", icon: Building2 },
  { to: "/dashboard/leadership", label: "Leadership", icon: Users },
  { to: "/dashboard/about-page", label: "About page", icon: FileText },
  { to: "/dashboard/timeline", label: "Journey timeline", icon: CalendarClock },
  { to: "/dashboard/brand-partners", label: "Brand partners", icon: Handshake },
  { to: "/dashboard/contact", label: "Contact page", icon: Mail },
  { to: "/dashboard/footer", label: "Footer & nav", icon: PanelBottom },
  { to: "/dashboard/media", label: "Media library", icon: ImageIcon },
  { to: "/dashboard/settings", label: "Settings", icon: SettingsIcon },
];

const DashboardLayout: React.FC = () => {
  const { user, loading, signOut, configured } = useAuth();
  const { status } = useContentStore();
  const [menuOpen, setMenuOpen] = useState(false);

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
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#111d43] text-white flex flex-col transition-transform ${
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">JB Group</p>
            <p className="text-[11px] text-white/50">Content dashboard</p>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="lg:hidden p-1.5 text-white/60 hover:text-white"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-2.5 text-[13px] transition ${
                  isActive
                    ? "bg-white/10 text-white border-l-2 border-[#cb9733]"
                    : "text-white/65 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-[12px] text-white/60 hover:text-white transition"
          >
            <ExternalLink size={14} /> View website
          </a>
          <button
            onClick={() => void signOut()}
            className="flex items-center gap-2 text-[12px] text-white/60 hover:text-white transition"
          >
            <LogOut size={14} /> Sign out
          </button>
          <p className="text-[10px] text-white/35 truncate pt-1">{user.email}</p>
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
        <header className="lg:hidden flex items-center gap-3 px-5 py-3 bg-white border-b border-slate-200">
          <button onClick={() => setMenuOpen(true)} className="p-1.5 text-slate-600">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-slate-900">Dashboard</span>
        </header>

        <main className="flex-1 px-6 py-6 max-w-5xl w-full">
          {status === "error" && (
            <div className="text-xs rounded-lg px-4 py-3 mb-5 border bg-red-50 border-red-200 text-red-700">
              Could not reach the database — showing built-in defaults. Saving may fail.
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
