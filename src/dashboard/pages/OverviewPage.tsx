import React, { useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CloudUpload,
  Compass,
  Database,
  ExternalLink,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  Send,
  Sparkles,
  Trash2,
  UploadCloud,
  Users,
} from "lucide-react";
import { useContentStore } from "../../content/ContentProvider";
import { useDrafts } from "../DraftProvider";
import { usePreviewControl } from "../previewControl";
import { publicPages, SECTION_META } from "../sections";
import { Button, Notice } from "../components/ui";
import { useAccess } from "../AuthProvider";
import { SubmitForReviewDialog } from "../components/AccessScreens";
import { initials } from "../format";
import { roleStyle } from "../permissions";

const STAT_TINTS = [
  { bg: "bg-[#cb9733]/10", text: "text-[#cb9733]" },
  { bg: "bg-[#111d43]/8", text: "text-[#111d43]" },
  { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  { bg: "bg-sky-500/10", text: "text-sky-600" },
];

const STEPS = [
  { icon: FileText, title: "Edit", text: "Pick a page in the sidebar. Edits are kept as drafts, even if you close the tab." },
  { icon: Eye, title: "Preview", text: "See the real page with your drafts on desktop, tablet or mobile." },
  { icon: UploadCloud, title: "Publish", text: "Put every draft live at once with Publish or Ctrl+S." },
];

const CardHead: React.FC<{ title: string; hint?: string; action?: React.ReactNode }> = ({
  title,
  hint,
  action,
}) => (
  <div className="flex items-start justify-between gap-3 mb-4">
    <div className="min-w-0">
      <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">{title}</h3>
      {hint && <p className="text-[12.5px] text-slate-500 mt-0.5">{hint}</p>}
    </div>
    {action}
  </div>
);

const OverviewPage: React.FC = () => {
  const { status, usingDefaults, refresh, publishAll } = useContentStore();
  const { effective, dirtyKeys, publish, submit, publishing, discard, canPublish } = useDrafts();
  const access = useAccess();
  const canEdit = access.can("content.edit");
  const [submitOpen, setSubmitOpen] = useState(false);
  const sendAll = () => (canPublish ? void publish() : setSubmitOpen(true));
  const displayName = access.profile.full_name || access.profile.email.split("@")[0];
  const firstName = displayName.split(" ")[0];
  const preview = usePreviewControl();
  const [seeding, setSeeding] = useState(false);
  const reduce = useReducedMotion();

  const businesses = effective.businesses;
  const leaders = effective.leadership.leaders;
  const pages = publicPages(effective);
  const pending = dirtyKeys.length;

  const stats = [
    {
      label: "Businesses",
      value: `${businesses.filter((b) => b.published).length}/${businesses.length}`,
      hint: "published",
      icon: Building2,
      to: "/dashboard/businesses",
    },
    {
      label: "Leadership",
      value: `${leaders.filter((l) => l.published).length}/${leaders.length}`,
      hint: "profiles published",
      icon: Users,
      to: "/dashboard/leadership",
    },
    {
      label: "Hero slides",
      value: String(effective.hero.slides.length),
      hint: "on the homepage",
      icon: Sparkles,
      to: "/dashboard/hero",
    },
    {
      label: "Timeline",
      value: String(effective.timeline.items.length),
      hint: "milestones",
      icon: Compass,
      to: "/dashboard/timeline",
    },
  ];

  const connection = usingDefaults
    ? { label: "Local defaults", dot: "bg-slate-400", text: "text-slate-500" }
    : status === "error"
      ? { label: "Offline", dot: "bg-[var(--dash-danger)]", text: "text-[var(--dash-danger)]" }
      : status === "loading"
        ? { label: "Syncing", dot: "bg-slate-400 animate-pulse", text: "text-slate-500" }
        : { label: "Connected", dot: "bg-[var(--dash-success)]", text: "text-[var(--dash-success)]" };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await publishAll();
      toast.success("Database seeded", { description: "Every section was written to Supabase." });
    } catch (e) {
      toast.error("Seeding failed", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setSeeding(false);
    }
  };

  const enter = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px] items-start">
      {/* Main column */}
      <div className="min-w-0 space-y-6">
        <motion.section
          {...enter(0)}
          className="relative overflow-hidden rounded-[28px] p-7 sm:p-8 text-white bg-gradient-to-br from-[#0f172a] via-[#16213f] to-[#1e2b52] shadow-[var(--dash-shadow-md)]"
        >
          <div className="absolute -right-20 -top-24 w-80 h-80 rounded-full bg-[#cb9733]/15 blur-3xl pointer-events-none" />
          <div className="absolute right-24 -bottom-28 w-64 h-64 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold text-[#e0b458]">Welcome back, {firstName}</p>
              <h2 className="text-[26px] sm:text-[32px] font-bold tracking-tight leading-[1.15] mt-2 max-w-xl">
                {!canEdit
                  ? "You have view-only access"
                  : pending
                    ? `${pending} ${pending === 1 ? "section is" : "sections are"} waiting to ${canPublish ? "publish" : "submit"}`
                    : canPublish
                      ? "Everything is published"
                      : "Nothing waiting to submit"}
              </h2>
              <p className="text-[14px] text-white/60 mt-2 max-w-lg leading-relaxed">
                {!canEdit
                  ? "Browse the site in the live preview. Ask a Super Admin if you need to edit."
                  : pending
                    ? "Your edits are saved as drafts. Check them in the live preview before they go live."
                    : "Edit any page from the sidebar. Changes stay as drafts until you publish."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => preview.open()}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-white/10 hover:bg-white/15 ring-1 ring-white/15"
              >
                <Eye size={15} /> Live preview
              </button>
              {canEdit && pending > 0 && (
                <button
                  type="button"
                  onClick={sendAll}
                  disabled={publishing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold bg-[#cb9733] text-[#0f172a] hover:bg-[#d8a649] disabled:opacity-60 disabled:cursor-wait"
                >
                  {publishing ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : canPublish ? (
                    <UploadCloud size={15} />
                  ) : (
                    <Send size={15} />
                  )}
                  {canPublish ? `Publish ${pending}` : `Submit ${pending}`}
                </button>
              )}
              {canEdit && !pending && (
                <span className="inline-flex items-center gap-2 px-2 text-[13px] font-semibold text-white/80">
                  <CheckCircle2 size={16} className="text-emerald-400" /> Up to date
                </span>
              )}
            </div>
          </div>
        </motion.section>

        {usingDefaults && (
          <Notice tone="warn">
            Supabase is not connected. You can edit and preview, but publishing is unavailable.
            See <code className="bg-black/5 px-1 rounded">DASHBOARD.md</code> to connect it.
          </Notice>
        )}

        {/* Stats */}
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
          {stats.map((s, i) => {
            const tint = STAT_TINTS[i % STAT_TINTS.length];
            return (
              <motion.div key={s.label} {...enter(i + 1)}>
                <Link
                  to={s.to}
                  className="dash-card group flex items-center gap-4 p-4 h-full hover:-translate-y-0.5 hover:shadow-[var(--dash-shadow-md)]"
                >
                  <span className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${tint.bg}`}>
                    <s.icon size={20} className={tint.text} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-medium text-slate-500 truncate">{s.label}</span>
                    <span className="block text-[22px] font-bold text-slate-900 tracking-tight leading-tight tabular-nums">
                      {s.value}
                    </span>
                    <span className="block text-[11.5px] text-slate-400 truncate">{s.hint}</span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    className="shrink-0 self-start text-slate-300 transition group-hover:text-[#cb9733] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Website pages */}
        <section className="dash-card p-6">
          <CardHead
            title="Website pages"
            hint="Preview with your drafts, or open the published page."
            action={
              <span className="shrink-0 text-[12px] font-semibold text-slate-400 tabular-nums">
                {pages.length} pages
              </span>
            }
          />
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11.5px] font-semibold text-slate-400">
                  <th className="px-2 pb-2 font-semibold">Page</th>
                  <th className="px-2 pb-2 font-semibold hidden sm:table-cell">Address</th>
                  <th className="px-2 pb-2 font-semibold text-right">Open</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((page) => (
                  <tr key={page.path} className="group">
                    <td className="px-2 py-1.5">
                      <div className="flex items-center gap-3 rounded-2xl">
                        <span className="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#cb9733]/10 transition-colors">
                          <FileText size={15} className="text-slate-400 group-hover:text-[#cb9733] transition-colors" />
                        </span>
                        <span className="text-[13.5px] font-semibold text-slate-800 truncate">{page.label}</span>
                      </div>
                    </td>
                    <td className="px-2 py-1.5 hidden sm:table-cell">
                      <span className="inline-block max-w-[260px] truncate align-middle text-[12px] font-medium text-slate-500 bg-slate-100 rounded-full px-2.5 py-1">
                        {page.path}
                      </span>
                    </td>
                    <td className="px-2 py-1.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => preview.open(page.path)}
                          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 ring-1 ring-slate-200 px-3 py-1.5"
                        >
                          <Eye size={13} /> Preview
                        </button>
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`Open ${page.label} live`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 ring-1 ring-slate-200"
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right rail */}
      <aside className="space-y-6 min-w-0">
        <section className="dash-card p-6 text-center">
          <div className="relative mx-auto w-[92px] h-[92px] rounded-full p-[3px] bg-gradient-to-br from-[#cb9733] to-[#e9cf94]">
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-[26px] font-bold bg-gradient-to-br ring-4 ring-white ${roleStyle(access.profile.role).avatar}`}
            >
              {initials(displayName, access.profile.email)}
            </div>
          </div>
          <p className="mt-4 text-[17px] font-bold text-slate-900 truncate">{displayName}</p>
          <p className="text-[12.5px] text-slate-500">{access.profile.role_label}</p>

          <div className="mt-5 grid grid-cols-2 gap-2 text-left">
            <div className="rounded-2xl bg-slate-50 px-3.5 py-3">
              <p className="text-[11.5px] text-slate-400">Database</p>
              <p className={`mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold ${connection.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${connection.dot}`} /> {connection.label}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3.5 py-3">
              <p className="text-[11.5px] text-slate-400">Drafts</p>
              <p className="mt-0.5 text-[13px] font-semibold text-slate-800 tabular-nums">
                {pending === 0 ? "None" : `${pending} waiting`}
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/account"
            className="mt-4 inline-flex items-center justify-center gap-1.5 w-full rounded-full ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50 px-4 py-2 text-[12.5px] font-semibold text-slate-700"
          >
            My account <ArrowUpRight size={13} />
          </Link>
        </section>

        {canEdit && (
          <section className="dash-card p-6">
            <CardHead
              title={canPublish ? "Unpublished changes" : "Unsubmitted changes"}
              hint="Drafts only you can see."
            />
            {pending === 0 ? (
              <div className="flex items-center gap-3 rounded-2xl bg-emerald-50/70 px-4 py-3.5">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <p className="text-[12.5px] text-emerald-800 leading-snug">
                  You're all caught up. The website matches the dashboard.
                </p>
              </div>
            ) : (
              <>
                <ul className="space-y-1.5">
                  {dirtyKeys.map((key) => (
                    <li
                      key={key}
                      className="group flex items-center gap-2 rounded-2xl bg-slate-50 hover:bg-slate-100 pl-3.5 pr-1.5 py-1.5"
                    >
                      <Link
                        to={SECTION_META[key].route}
                        className="flex-1 min-w-0 text-[13px] font-semibold text-slate-800 hover:text-[#cb9733] truncate"
                      >
                        {SECTION_META[key].label}
                      </Link>
                      <button
                        type="button"
                        title="Preview this section"
                        onClick={() => preview.open(SECTION_META[key].previewPath(effective))}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-white"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        title={canPublish ? "Publish this section" : "Submit this section for review"}
                        disabled={publishing}
                        onClick={() => void (canPublish ? publish([key]) : submit([key]))}
                        className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-white disabled:opacity-30"
                      >
                        {canPublish ? <UploadCloud size={14} /> : <Send size={14} />}
                      </button>
                      <button
                        type="button"
                        title="Discard these changes"
                        onClick={() => discard([key])}
                        className="p-1.5 text-slate-400 hover:text-[var(--dash-danger)] hover:bg-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Button variant="primary" onClick={sendAll} disabled={publishing}>
                    {publishing ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : canPublish ? (
                      <UploadCloud size={15} />
                    ) : (
                      <Send size={15} />
                    )}
                    {canPublish ? `Publish all ${pending}` : `Submit all ${pending}`}
                  </Button>
                </div>
              </>
            )}
          </section>
        )}

        <section className="dash-card p-6">
          <CardHead title="How editing works" />
          <ol className="space-y-4">
            {STEPS.map((step) => (
              <li key={step.title} className="flex gap-3">
                <span className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center bg-[#cb9733]/10">
                  <step.icon size={16} className="text-[#cb9733]" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-bold text-slate-800">{step.title}</span>
                  <span className="block text-[12.5px] text-slate-500 leading-relaxed">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {access.isSuperAdmin && (
          <section className="dash-card p-6">
            <CardHead
              title="Database"
              hint="Seed a fresh project, or reload what's stored."
              action={<Database size={16} className="text-slate-300 shrink-0" />}
            />
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => void handleSeed()} disabled={seeding || usingDefaults}>
                {seeding ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
                Seed database
              </Button>
              <Button onClick={() => void refresh()} disabled={status === "loading" || usingDefaults}>
                <RefreshCw size={15} className={status === "loading" ? "animate-spin" : ""} /> Reload
              </Button>
            </div>
          </section>
        )}
      </aside>

      <SubmitForReviewDialog open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
};

export default OverviewPage;
