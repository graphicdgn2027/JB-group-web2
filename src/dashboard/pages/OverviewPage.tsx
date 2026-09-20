import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  ArrowRight,
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
import { Button, Notice, Panel } from "../components/ui";
import { useAccess } from "../AuthProvider";
import { SubmitForReviewDialog } from "../components/AccessScreens";

const STAT_TINTS = [
  { bg: "bg-[#cb9733]/10", text: "text-[#cb9733]" },
  { bg: "bg-[#111d43]/8", text: "text-[#111d43]" },
  { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  { bg: "bg-violet-500/10", text: "text-violet-600" },
];

const OverviewPage: React.FC = () => {
  const { status, usingDefaults, refresh, publishAll } = useContentStore();
  const { effective, dirtyKeys, publish, submit, publishing, discard, canPublish } = useDrafts();
  const access = useAccess();
  const canEdit = access.can("content.edit");
  const [submitOpen, setSubmitOpen] = useState(false);
  const sendAll = () => (canPublish ? void publish() : setSubmitOpen(true));
  const firstName = (access.profile.full_name || access.profile.email.split("@")[0]).split(" ")[0];
  const preview = usePreviewControl();
  const [seeding, setSeeding] = useState(false);

  const businesses = effective.businesses;
  const leaders = effective.leadership.leaders;
  const pages = publicPages(effective);

  const stats = [
    {
      label: "Businesses",
      value: `${businesses.filter((b) => b.published).length} / ${businesses.length}`,
      hint: "published / total",
      icon: Building2,
      to: "/dashboard/businesses",
    },
    {
      label: "Leadership profiles",
      value: `${leaders.filter((l) => l.published).length} / ${leaders.length}`,
      hint: "published / total",
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
      label: "Timeline entries",
      value: String(effective.timeline.items.length),
      hint: "on the journey",
      icon: Compass,
      to: "/dashboard/timeline",
    },
  ];

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

  const pending = dirtyKeys.length;

  return (
    <div>
      {/* Publish status */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-[20px] mb-6 p-6 sm:p-7 text-white bg-gradient-to-br from-[#0f172a] via-[#16213f] to-[#1e2b52] shadow-[var(--dash-shadow-md)]"
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#cb9733]/15 blur-3xl pointer-events-none" />
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#cb9733]">
              Welcome, {firstName} · {access.profile.role_label}
            </p>
            <h2 className="text-[22px] sm:text-[26px] font-bold tracking-tight mt-1.5">
              {!canEdit
                ? "You have view-only access"
                : pending
                  ? `${pending} ${pending === 1 ? "section is" : "sections are"} waiting to ${canPublish ? "publish" : "submit"}`
                  : canPublish
                    ? "Everything is published"
                    : "Nothing waiting to submit"}
            </h2>
            <p className="text-[13.5px] text-white/60 mt-1.5 max-w-xl leading-relaxed">
              {!canEdit
                ? "Browse the site in the live preview. Ask a Super Admin if you need to edit."
                : canPublish
                  ? pending
                    ? "Your edits are saved as drafts. Check them in the live preview, then publish to put them on the website."
                    : "Edit any page from the sidebar. Changes stay as drafts you can preview until you publish them."
                  : "Edit your pages, check them in the live preview, then submit them. An editor reviews and publishes them."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => preview.open()}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold bg-white/10 hover:bg-white/15 ring-1 ring-white/15"
            >
              <Eye size={15} /> Live preview
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={sendAll}
                disabled={!pending || publishing}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold bg-[#cb9733] text-[#0f172a] hover:bg-[#d8a649] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {publishing ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : canPublish ? (
                  <UploadCloud size={15} />
                ) : (
                  <Send size={15} />
                )}
                {canPublish
                  ? pending
                    ? `Publish ${pending}`
                    : "Published"
                  : pending
                    ? `Submit ${pending} for review`
                    : "Up to date"}
              </button>
            )}
          </div>
        </div>
      </motion.section>

      {usingDefaults && (
        <Notice tone="warn">
          Supabase is not connected — you can edit and preview, but publishing is
          unavailable. See <code className="bg-black/5 px-1 rounded">DASHBOARD.md</code>{" "}
          to connect it.
        </Notice>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => {
          const tint = STAT_TINTS[i % STAT_TINTS.length];
          return (
            <Link key={s.label} to={s.to} className="block group">
              <motion.div
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="dash-card p-5 h-full relative overflow-hidden flex flex-col justify-between border border-slate-100 hover:border-slate-200"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <s.icon size={64} className={tint.text} />
                </div>

                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${tint.bg} shadow-sm`}>
                    <s.icon size={18} className={tint.text} />
                  </div>
                  <p className="text-[14px] font-semibold text-slate-700">{s.label}</p>
                  <p className="text-[12px] text-slate-400 mb-2">{s.hint}</p>
                </div>

                <p className="text-3xl font-black text-slate-900 tracking-tight mt-2">{s.value}</p>
              </motion.div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-x-6">
        {/* Pending changes */}
        {canEdit && (
        <Panel
          title={canPublish ? "Unpublished changes" : "Unsubmitted changes"}
          description="Drafts that only you can see, in the preview."
        >
          {pending === 0 ? (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                <CheckCircle2 size={20} className="text-emerald-600" />
              </div>
              <p className="text-[13.5px] font-semibold text-slate-800">You're all caught up</p>
              <p className="text-[12px] text-slate-400 mt-0.5">
                The website matches what's in the dashboard.
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-slate-100 -my-1">
                {dirtyKeys.map((key) => (
                  <li key={key} className="group flex items-center gap-3 py-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <Link
                      to={SECTION_META[key].route}
                      className="flex-1 min-w-0 text-[13.5px] font-medium text-slate-800 hover:text-[#cb9733] truncate"
                    >
                      {SECTION_META[key].label}
                    </Link>
                    <button
                      type="button"
                      title="Preview this section"
                      onClick={() => preview.open(SECTION_META[key].previewPath(effective))}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      type="button"
                      title={canPublish ? "Publish this section" : "Submit this section for review"}
                      disabled={publishing}
                      onClick={() => void (canPublish ? publish([key]) : submit([key]))}
                      className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30"
                    >
                      {canPublish ? <UploadCloud size={14} /> : <Send size={14} />}
                    </button>
                    <button
                      type="button"
                      title="Discard these changes"
                      onClick={() => discard([key])}
                      className="p-1.5 text-slate-400 hover:text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)]"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <div className="pt-2">
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
        </Panel>
        )}

        {/* Public pages */}
        <Panel title="Website pages" description="Preview with your drafts, or open the live page.">
          <ul className="divide-y divide-slate-100 -my-1">
            {pages.map((page) => (
              <li key={page.path} className="flex items-center gap-3 py-2">
                <FileText size={15} className="text-slate-300 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-slate-800 truncate">{page.label}</p>
                  <p className="text-[11px] text-slate-400 truncate">{page.path}</p>
                </div>
                <button
                  type="button"
                  onClick={() => preview.open(page.path)}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2 py-1"
                >
                  <Eye size={13} /> Preview
                </button>
                <a
                  href={page.path}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-[10px] px-2 py-1"
                >
                  <ExternalLink size={13} /> Live
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="How editing works"
        description="A quick orientation for whoever maintains the site."
      >
        <ol className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: FileText,
              title: "1 · Edit",
              text: "Pick a page in the sidebar and change anything. Edits are kept as drafts — even if you close the tab.",
            },
            {
              icon: Eye,
              title: "2 · Preview",
              text: "Press Preview to see the real page with your drafts, on desktop, tablet or mobile. It updates as you type.",
            },
            {
              icon: UploadCloud,
              title: "3 · Publish",
              text: "Press Publish (or Ctrl+S) to put every draft live at once, or publish one section from its own page.",
            },
          ].map((step) => (
            <li key={step.title} className="rounded-xl bg-slate-50 p-4">
              <step.icon size={17} className="text-[#cb9733] mb-2.5" />
              <p className="text-[13px] font-bold text-slate-800">{step.title}</p>
              <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-[12px] text-slate-400 flex items-center gap-1.5">
          <ArrowRight size={12} /> Unpublishing a business or leadership profile hides it
          everywhere without deleting it. "Restore original" loads the site's original
          content as a draft.
        </p>
      </Panel>

      {access.isSuperAdmin && (
      <Panel
        title="Database"
        description="Seed a fresh Supabase project with the content currently live on the site, or reload it from the database."
        actions={<Database size={16} className="text-slate-300" />}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Button onClick={() => void handleSeed()} disabled={seeding || usingDefaults}>
            {seeding ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
            Seed database
          </Button>
          <Button onClick={() => void refresh()} disabled={status === "loading" || usingDefaults}>
            <RefreshCw size={15} className={status === "loading" ? "animate-spin" : ""} /> Reload
            from database
          </Button>
        </div>
      </Panel>
      )}

      <SubmitForReviewDialog open={submitOpen} onClose={() => setSubmitOpen(false)} />
    </div>
  );
};

export default OverviewPage;
