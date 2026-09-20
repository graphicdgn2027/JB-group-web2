import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import type { User } from "@supabase/supabase-js";
import { Toaster } from "sonner";
import {
  AlertTriangle,
  ChevronDown,
  Eye,
  EyeOff,
  ExternalLink,
  Loader2,
  Menu,
  RefreshCw,
  Send,
  Trash2,
  UploadCloud,
} from "lucide-react";
import Sidebar, { ALL_NAV_ITEMS } from "./components/Sidebar";
import { useMediaQuery } from "./useMediaQuery";
import { useAccess, useAuth } from "./AuthProvider";
import { countPendingSubmissions } from "./adminApi";
import { ReviewQueueContext, type ReviewQueue } from "./reviewQueue";
import {
  AccessProblemScreen,
  NoAccessPage,
  SetNewPasswordScreen,
  SubmitForReviewDialog,
} from "./components/AccessScreens";
import { useContentStore } from "../content/ContentProvider";
import { DraftProvider, useDrafts } from "./DraftProvider";
import { PreviewControlContext, type PreviewControl } from "./previewControl";
import { previewPathForRoute, publicPages, SECTION_META } from "./sections";
import PreviewPane from "./components/PreviewPane";
import LoginPage from "./LoginPage";
import "./dashboard.css";

const WIDE_QUERY = "(min-width: 1280px)";
const DESKTOP_QUERY = "(min-width: 1024px)";
const PREVIEW_PREF_KEY = "jbg-dashboard-preview-open";
const COLLAPSED_PREF_KEY = "jbg-dashboard-sidebar-collapsed";

function useCurrentPageLabel(pathname: string): string {
  return useMemo(() => {
    const exact = ALL_NAV_ITEMS.find((i) => (i.end ? pathname === i.to : pathname.startsWith(i.to)));
    return exact?.label ?? "Dashboard";
  }, [pathname]);
}

function readPref(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writePref(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    // ignore
  }
}

const ConnectionPill: React.FC<{
  status: ReturnType<typeof useContentStore>["status"];
  usingDefaults: boolean;
}> = ({ status, usingDefaults }) => {
  const base =
    "hidden md:inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full";
  if (usingDefaults) {
    return (
      <span className={`${base} bg-slate-100 text-slate-500`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Local defaults
      </span>
    );
  }
  if (status === "loading") {
    return (
      <span className={`${base} bg-slate-100 text-slate-500`}>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" /> Syncing
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className={`${base} bg-[var(--dash-danger-soft)] text-[var(--dash-danger)]`}>
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--dash-danger)]" /> Offline
      </span>
    );
  }
  return (
    <span className={`${base} bg-[var(--dash-success-soft)] text-[var(--dash-success)]`}>
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--dash-success)]" /> Live
    </span>
  );
};

/** Top-bar dropdown listing every section with unpublished edits. */
const ChangesMenu: React.FC = () => {
  const { dirtyKeys, discard, publish, publishing, canPublish } = useDrafts();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (dirtyKeys.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-200"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 dash-pulse" />
        <span className="hidden sm:inline">
          {dirtyKeys.length} unpublished
        </span>
        <span className="sm:hidden">{dirtyKeys.length}</span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="dash-fade-up absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-[var(--dash-shadow-lg)] ring-1 ring-slate-900/5 z-50 overflow-hidden">
          <div className="px-4 pt-3.5 pb-2">
            <p className="text-[13px] font-bold text-slate-900">Unpublished changes</p>
            <p className="text-[11.5px] text-slate-500 mt-0.5">
              {canPublish
                ? "Visible in the preview only, until you publish."
                : "Visible in the preview only, until an editor approves them."}
            </p>
          </div>
          <ul className="max-h-72 overflow-y-auto px-2 pb-2">
            {dirtyKeys.map((key) => (
              <li
                key={key}
                className="group flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <Link
                  to={SECTION_META[key].route}
                  onClick={() => setOpen(false)}
                  className="flex-1 min-w-0 text-[13px] font-medium text-slate-700 hover:text-slate-900 truncate"
                >
                  {SECTION_META[key].label}
                </Link>
                <button
                  type="button"
                  title="Discard these changes"
                  onClick={() => discard([key])}
                  className="p-1 text-slate-300 hover:text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)] opacity-0 group-hover:opacity-100 focus:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Discard all unpublished changes? This can't be undone.")) {
                  discard();
                  setOpen(false);
                }
              }}
              className="text-[12px] font-semibold text-slate-500 hover:text-[var(--dash-danger)] px-2 py-1.5"
            >
              Discard all
            </button>
            <button
              type="button"
              disabled={publishing}
              onClick={() => {
                if (canPublish) void publish().then((ok) => ok && setOpen(false));
                else {
                  setOpen(false);
                  setSubmitting(true);
                }
              }}
              className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] px-3 py-1.5 disabled:opacity-50"
            >
              {publishing ? (
                <Loader2 size={13} className="animate-spin" />
              ) : canPublish ? (
                <UploadCloud size={13} />
              ) : (
                <Send size={13} />
              )}
              {canPublish ? "Publish all" : "Submit all"}
            </button>
          </div>
        </div>
      )}
      <SubmitForReviewDialog open={submitting} onClose={() => setSubmitting(false)} />
    </div>
  );
};

const DashboardShell: React.FC<{ user: User; onSignOut: () => void }> = ({ user, onSignOut }) => {
  const { content, status, usingDefaults, error, refresh } = useContentStore();
  const { effective, dirtyKeys, publish, publishing, canPublish } = useDrafts();
  const access = useAccess();
  const canEdit = access.can("content.edit");
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const location = useLocation();
  const pageLabel = useCurrentPageLabel(location.pathname);
  const isWide = useMediaQuery(WIDE_QUERY);
  const isDesktop = useMediaQuery(DESKTOP_QUERY);

  // Sidebar collapses to icons on desktop; the mobile drawer is always full width.
  const [collapsed, setCollapsed] = useState(() => readPref(COLLAPSED_PREF_KEY));
  const toggleCollapsed = useCallback(() => setCollapsed((c) => !c), []);
  useEffect(() => writePref(COLLAPSED_PREF_KEY, collapsed), [collapsed]);

  // Preview: docked beside the editor on wide screens, full-screen otherwise.
  const [previewOpen, setPreviewOpen] = useState(
    () => readPref(PREVIEW_PREF_KEY) && window.matchMedia(WIDE_QUERY).matches
  );
  const [manualPath, setManualPath] = useState<string | null>(null);
  useEffect(() => writePref(PREVIEW_PREF_KEY, previewOpen), [previewOpen]);

  // The preview follows the page being edited unless a page was picked by hand.
  // Published content (not drafts) drives this so typing a slug doesn't reload it.
  const autoPath = previewPathForRoute(location.pathname, content);
  useEffect(() => setManualPath(null), [location.pathname]);
  const previewPath = manualPath ?? autoPath;
  const pages = useMemo(() => publicPages(effective), [effective]);

  const previewControl = useMemo<PreviewControl>(
    () => ({
      isOpen: previewOpen,
      open: (path?: string) => {
        if (path) setManualPath(path);
        setPreviewOpen(true);
      },
      close: () => setPreviewOpen(false),
    }),
    [previewOpen]
  );

  const dirtyRoutes = useMemo(
    () => new Set(dirtyKeys.map((key) => SECTION_META[key].route)),
    [dirtyKeys]
  );

  const publishAll = useCallback(() => {
    if (!dirtyKeys.length || publishing) return;
    if (canPublish) void publish();
    else setSubmitOpen(true);
  }, [dirtyKeys.length, publishing, publish, canPublish]);

  // Pending submissions, for reviewers: polled, and refreshed on demand.
  const [pending, setPending] = useState(0);
  const reviewer = canPublish && status !== "error";
  const refreshPending = useCallback(() => {
    if (!reviewer) return setPending(0);
    countPendingSubmissions()
      .then(setPending)
      .catch(() => setPending(0));
  }, [reviewer]);
  useEffect(() => {
    refreshPending();
    const id = window.setInterval(refreshPending, 60_000);
    window.addEventListener("focus", refreshPending);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", refreshPending);
    };
  }, [refreshPending]);
  const reviewQueue = useMemo<ReviewQueue>(() => ({ pending, refresh: refreshPending }), [pending, refreshPending]);
  const badges = useMemo(() => ({ "/dashboard/review": pending }), [pending]);

  // Ctrl/Cmd+S publishes everything; Ctrl/Cmd+B toggles the sidebar.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
      const key = e.key.toLowerCase();
      if (key === "s") {
        e.preventDefault();
        publishAll();
      } else if (key === "b" && isDesktop) {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [publishAll, toggleCollapsed, isDesktop]);

  const preview = (
    <PreviewPane
      path={previewPath}
      pages={pages}
      onPathChange={setManualPath}
      onClose={() => setPreviewOpen(false)}
      dirtyCount={dirtyKeys.length}
    />
  );

  return (
    <PreviewControlContext.Provider value={previewControl}>
      <ReviewQueueContext.Provider value={reviewQueue}>
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

        <Sidebar
          collapsed={collapsed && isDesktop}
          onToggleCollapse={toggleCollapsed}
          mobileOpen={menuOpen}
          onCloseMobile={() => setMenuOpen(false)}
          dirtyRoutes={dirtyRoutes}
          canOpen={access.canOpenRoute}
          badges={badges}
          user={user}
          displayName={access.profile.full_name}
          role={access.profile.role}
          roleLabel={access.profile.role_label}
          onSignOut={onSignOut}
        />

        {menuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main */}
        <div className="flex-1 min-w-0 flex flex-col">
          <header className="sticky top-0 z-30 h-16 flex items-center gap-2 sm:gap-3 px-4 lg:px-8 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-[17px] font-bold text-slate-900 tracking-tight truncate leading-tight">
                {pageLabel}
              </h1>
              <p className="hidden sm:block text-[11.5px] text-slate-400 leading-tight mt-0.5 truncate">
                {!canEdit
                  ? "View only"
                  : dirtyKeys.length
                    ? canPublish
                      ? "Edits are drafts until you publish · Ctrl+S"
                      : "Edits are drafts until you submit them for review"
                    : canPublish
                      ? "All changes published"
                      : "No unsubmitted changes"}
              </p>
            </div>

            <ConnectionPill status={status} usingDefaults={usingDefaults} />
            <ChangesMenu />

            <button
              type="button"
              onClick={() => setPreviewOpen((o) => !o)}
              aria-pressed={previewOpen}
              title={previewOpen ? "Hide live preview" : "Show live preview"}
              className={`inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-2 ring-1 ${
                previewOpen
                  ? "bg-slate-900 text-white ring-slate-900"
                  : "bg-white text-slate-700 ring-slate-200 hover:ring-slate-300 hover:text-slate-900"
              }`}
            >
              {previewOpen ? <EyeOff size={14} /> : <Eye size={14} />}
              <span className="hidden sm:inline">Preview</span>
            </button>

            <a
              href={autoPath}
              target="_blank"
              rel="noreferrer"
              title="Open the published page in a new tab"
              className="hidden md:inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-700 hover:text-slate-900 ring-1 ring-slate-200 hover:ring-slate-300 bg-white rounded-[10px] px-3 py-2 transition"
            >
              <ExternalLink size={14} /> View live
            </a>

            {canEdit && (
            <button
              type="button"
              onClick={publishAll}
              disabled={dirtyKeys.length === 0 || publishing}
              title={
                !dirtyKeys.length
                  ? "Nothing to send"
                  : canPublish
                    ? "Publish all changes (Ctrl+S)"
                    : "Send your changes to an editor (Ctrl+S)"
              }
              className="inline-flex items-center gap-2 text-[12.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] px-3.5 py-2 shadow-sm disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {publishing ? (
                <Loader2 size={14} className="animate-spin" />
              ) : canPublish ? (
                <UploadCloud size={14} />
              ) : (
                <Send size={14} />
              )}
              <span className="hidden sm:inline">
                {publishing ? (canPublish ? "Publishing…" : "Sending…") : canPublish ? "Publish" : "Submit for review"}
              </span>
              {dirtyKeys.length > 0 && !publishing && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--dash-gold)] text-[10.5px] font-bold leading-[18px] text-center">
                  {dirtyKeys.length}
                </span>
              )}
            </button>
            )}
          </header>

          <div className="flex-1 flex min-w-0">
            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8">
              <div className="max-w-4xl mx-auto">
                {status === "error" && (
                  <div className="text-[12.5px] leading-relaxed rounded-xl px-4 py-3 mb-5 border flex items-start gap-2.5 bg-[var(--dash-danger-soft)] border-[var(--dash-danger-border)] text-[#991b1b]">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">Could not reach the database</p>
                      <p className="mt-0.5 text-[#b91c1c] break-words">
                        You can keep editing and previewing — publishing will fail until this
                        is resolved.
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
                {access.canOpenRoute(location.pathname) ? <Outlet /> : <NoAccessPage />}
              </div>
            </main>

            {previewOpen && isWide && (
              <aside className="sticky top-16 self-start h-[calc(100vh-4rem)] w-[46%] max-w-[780px] shrink-0 border-l border-slate-200">
                {preview}
              </aside>
            )}
          </div>
        </div>

        {previewOpen && !isWide && (
          <div className="fixed inset-0 z-[60] flex flex-col bg-white dash-fade-up">{preview}</div>
        )}
        <SubmitForReviewDialog open={submitOpen} onClose={() => setSubmitOpen(false)} />
      </div>
      </ReviewQueueContext.Provider>
    </PreviewControlContext.Provider>
  );
};

const DashboardLayout: React.FC = () => {
  const { user, loading, signOut, configured, accessStatus, passwordRecovery } = useAuth();

  if (loading) {
    return (
      <div className="dash min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    );
  }

  // Unauthenticated (or unconfigured) visitors never see the editors.
  if (!configured || !user) return <LoginPage />;
  if (passwordRecovery) return <SetNewPasswordScreen />;
  if (accessStatus !== "ready") return <AccessProblemScreen status={accessStatus} />;

  return (
    <DraftProvider>
      <DashboardShell user={user} onSignOut={() => void signOut()} />
    </DraftProvider>
  );
};

export default DashboardLayout;
