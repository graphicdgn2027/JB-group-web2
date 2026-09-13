import React, { useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Building2,
  CloudUpload,
  Compass,
  Layers,
  Loader2,
  RefreshCw,
  Sparkles,
  Users,
} from "lucide-react";
import { useContentStore } from "../../content/ContentProvider";
import { Button, Notice, Panel } from "../components/ui";

const STAT_TINTS = [
  { bg: "bg-[#cb9733]/10", text: "text-[#cb9733]" },
  { bg: "bg-[#111d43]/8", text: "text-[#111d43]" },
  { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  { bg: "bg-violet-500/10", text: "text-violet-600" },
];

const OverviewPage: React.FC = () => {
  const { content, status, usingDefaults, refresh, publishAll } = useContentStore();
  const [busy, setBusy] = useState(false);

  const businesses = content.businesses;
  const leaders = content.leadership.leaders;

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
      value: String(content.hero.slides.length),
      hint: "on the homepage",
      icon: Sparkles,
      to: "/dashboard/hero",
    },
    {
      label: "Timeline entries",
      value: String(content.timeline.items.length),
      hint: "on the journey",
      icon: Compass,
      to: "/dashboard/timeline",
    },
  ];

  const handlePublishAll = async () => {
    setBusy(true);
    try {
      await publishAll();
      toast.success("Published", { description: "Every section was written to the database." });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error("Publish failed", { description: msg });
    } finally {
      setBusy(false);
    }
  };

  const handleRefresh = async () => {
    setBusy(true);
    try {
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Everything on the public website is editable from here. Changes go live as
          soon as you save.
        </p>
      </div>

      {usingDefaults && (
        <Notice tone="warn">
          Supabase is not connected — the site is running on its built-in default
          content and nothing you edit here can be saved yet. See{" "}
          <code className="bg-black/5 px-1 rounded">DASHBOARD.md</code> to connect it.
        </Notice>
      )}
      {!usingDefaults && status === "ready" && (
        <Notice>
          Connected to Supabase. Saved edits are visible to every visitor immediately.
        </Notice>
      )}

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

      <Panel
        title="Publish everything"
        description="Writes every section currently shown in the dashboard to the database. Use this once after setting up a fresh Supabase project to seed it with the site's existing content."
        actions={<Layers size={16} className="text-slate-300" />}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="primary" onClick={() => void handlePublishAll()} disabled={busy}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
            Publish all sections
          </Button>
          <Button onClick={() => void handleRefresh()} disabled={busy}>
            <RefreshCw size={15} /> Reload from database
          </Button>
        </div>
      </Panel>

      <Panel
        title="How editing works"
        description="A quick orientation for whoever maintains the site."
      >
        <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            Each page in the sidebar maps to one part of the public website. Edit,
            then press <strong>Save changes</strong> at the bottom.
          </li>
          <li>
            <strong>Reset to default</strong> restores that section to the original
            content the site shipped with — useful if an edit goes wrong.
          </li>
          <li>
            Images can be typed as a path or uploaded through{" "}
            <strong>Browse → Upload</strong>, which stores them in Supabase and
            returns a permanent URL.
          </li>
          <li>
            Unpublishing a business or a leadership profile hides it everywhere on
            the site without deleting it.
          </li>
        </ul>
      </Panel>
    </div>
  );
};

export default OverviewPage;
