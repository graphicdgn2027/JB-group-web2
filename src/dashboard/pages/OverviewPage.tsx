import React, { useState } from "react";
import { Link } from "react-router";
import {
  Building2,
  CheckCircle2,
  CloudUpload,
  Loader2,
  RefreshCw,
  Users,
} from "lucide-react";
import { useContentStore } from "../../content/ContentProvider";
import { Button, Notice, Panel } from "../components/ui";

const OverviewPage: React.FC = () => {
  const { content, status, error, refresh, publishAll } = useContentStore();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
      icon: CloudUpload,
      to: "/dashboard/hero",
    },
    {
      label: "Timeline entries",
      value: String(content.timeline.items.length),
      hint: "on the journey",
      icon: CheckCircle2,
      to: "/dashboard/timeline",
    },
  ];

  const handlePublishAll = async () => {
    setBusy(true);
    setResult(null);
    try {
      await publishAll();
      setResult("All sections written to the database.");
    } catch (e) {
      setResult(e instanceof Error ? e.message : String(e));
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

      {status === "ready" && (
        <Notice>
          Connected to Supabase. Saved edits are visible to every visitor immediately.
        </Notice>
      )}
      {status === "error" && (
        <Notice tone="warn">
          Database error: {error}. The site is serving its built-in defaults.
        </Notice>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {stats.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-[#cb9733]/60 transition"
          >
            <s.icon size={16} className="text-[#cb9733] mb-2" />
            <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
            <p className="text-xs font-medium text-slate-700 mt-0.5">{s.label}</p>
            <p className="text-[11px] text-slate-400">{s.hint}</p>
          </Link>
        ))}
      </div>

      <Panel
        title="Publish everything"
        description="Writes every section currently shown in the dashboard to the database. Use this once after setting up a fresh Supabase project to seed it with the site's existing content."
      >
        <div className="flex items-center gap-3 flex-wrap">
          <Button variant="primary" onClick={handlePublishAll} disabled={busy}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : <CloudUpload size={15} />}
            Publish all sections
          </Button>
          <Button onClick={() => void refresh()} disabled={busy}>
            <RefreshCw size={15} /> Reload from database
          </Button>
          {result && <span className="text-xs text-slate-600">{result}</span>}
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
