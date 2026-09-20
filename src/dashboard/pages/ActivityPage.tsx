import React, { useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  FileText,
  History,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
  Trash2,
  Undo2,
  UploadCloud,
  UserCog,
  UserPlus,
  XCircle,
} from "lucide-react";
import { listActivity, type ActivityEntry } from "../adminApi";
import { SECTION_META } from "../sections";
import { formatDateTime, timeAgo } from "../format";
import type { SectionKey } from "../../content/types";

const FILTERS = [
  { id: "", label: "Everything" },
  { id: "content", label: "Publishing" },
  { id: "submission", label: "Reviews" },
  { id: "user", label: "Users" },
  { id: "role", label: "Roles" },
];

const ROLE_NAMES: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  editor: "Editor",
  content_creator: "Content Creator",
  viewer: "Viewer",
};

const section = (key: string) => SECTION_META[key as SectionKey]?.label ?? key;

function describe(e: ActivityEntry): { icon: React.ElementType; tone: string; text: React.ReactNode } {
  const b = (s: React.ReactNode) => <strong className="font-semibold text-slate-900">{s}</strong>;
  const d = e.details as Record<string, any>;
  switch (e.action) {
    case "content.published":
      return { icon: UploadCloud, tone: "bg-emerald-50 text-emerald-600", text: <>published {b(section(e.target))}</> };
    case "submission.created":
      return { icon: Send, tone: "bg-sky-50 text-sky-600", text: <>submitted {b(section(e.target))} for review</> };
    case "submission.approved":
      return {
        icon: CheckCircle2,
        tone: "bg-emerald-50 text-emerald-600",
        text: <>approved {b(section(e.target))}{d.submitted_by ? <> from {d.submitted_by}</> : null}</>,
      };
    case "submission.rejected":
      return {
        icon: XCircle,
        tone: "bg-rose-50 text-rose-600",
        text: <>requested changes to {b(section(e.target))}{d.submitted_by ? <> from {d.submitted_by}</> : null}</>,
      };
    case "submission.withdrawn":
      return { icon: Undo2, tone: "bg-slate-100 text-slate-500", text: <>withdrew {b(section(e.target))}</> };
    case "user.created":
      return {
        icon: UserPlus,
        tone: "bg-indigo-50 text-indigo-600",
        text: <>added {b(e.target)} as {ROLE_NAMES[d.role] ?? d.role}</>,
      };
    case "user.deleted":
      return { icon: Trash2, tone: "bg-rose-50 text-rose-600", text: <>deleted user {b(e.target)}</> };
    case "user.email_changed":
      return { icon: Mail, tone: "bg-indigo-50 text-indigo-600", text: <>changed {d.from}'s email to {b(e.target)}</> };
    case "user.password_changed":
      return { icon: KeyRound, tone: "bg-indigo-50 text-indigo-600", text: <>set a new password for {b(e.target)}</> };
    case "user.updated": {
      const c = (d.changes ?? {}) as Record<string, [unknown, unknown]>;
      const parts: string[] = [];
      if (c.role) parts.push(`role ${ROLE_NAMES[String(c.role[0])] ?? c.role[0]} → ${ROLE_NAMES[String(c.role[1])] ?? c.role[1]}`);
      if (c.active) parts.push(c.active[1] ? "enabled the account" : "disabled the account");
      if (c.sections) parts.push("changed page access");
      if (c.full_name) parts.push(`renamed to “${c.full_name[1]}”`);
      return {
        icon: UserCog,
        tone: "bg-indigo-50 text-indigo-600",
        text: <>updated {b(e.target)}{parts.length ? <>: {parts.join(", ")}</> : null}</>,
      };
    }
    case "role.updated":
      return {
        icon: ShieldCheck,
        tone: "bg-amber-50 text-amber-600",
        text: <>changed permissions for {b(ROLE_NAMES[e.target] ?? e.target)}</>,
      };
    default:
      return { icon: FileText, tone: "bg-slate-100 text-slate-500", text: <>{e.action} {e.target}</> };
  }
}

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const PAGE = 50;

const ActivityPage: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (append: boolean, before?: number) => {
      setLoading(true);
      try {
        const rows = await listActivity({ prefix: filter || undefined, before, limit: PAGE });
        setEntries((prev) => (append ? [...prev, ...rows] : rows));
        setMore(rows.length === PAGE);
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    },
    [filter]
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  let lastDay = "";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Activity</h2>
          <p className="text-[13.5px] text-slate-500 mt-1">A record of who published, reviewed and changed what.</p>
        </div>
        <button
          type="button"
          onClick={() => void load(false)}
          title="Refresh"
          className="p-2.5 text-slate-500 hover:text-slate-900 bg-white ring-1 ring-slate-200 hover:ring-slate-300"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 text-[12.5px] font-semibold ring-1 ${
              filter === f.id ? "bg-slate-900 text-white ring-slate-900" : "bg-white text-slate-600 ring-slate-200 hover:ring-slate-300"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="mb-4 text-[13px] text-rose-600">{error}</p>}

      <div className="dash-card p-2 sm:p-4">
        {entries.length === 0 && !loading ? (
          <div className="p-10 text-center">
            <History size={24} className="mx-auto text-slate-300 mb-2" />
            <p className="text-[14px] font-semibold text-slate-800">No activity yet</p>
            <p className="text-[12.5px] text-slate-500 mt-1">Publishing, reviews and user changes will be listed here.</p>
          </div>
        ) : (
          <ol>
            {entries.map((e) => {
              const day = dayLabel(e.created_at);
              const showDay = day !== lastDay;
              lastDay = day;
              const { icon: Icon, tone, text } = describe(e);
              return (
                <React.Fragment key={e.id}>
                  {showDay && (
                    <li className="px-2 pt-4 pb-2 first:pt-1 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                      {day}
                    </li>
                  )}
                  <li className="flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50">
                    <span className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${tone}`}>
                      <Icon size={15} />
                    </span>
                    <p className="flex-1 min-w-0 text-[13.5px] text-slate-600 leading-relaxed pt-1">
                      <span className="font-semibold text-slate-900">{e.actor_email || "System"}</span> {text}
                    </p>
                    <time
                      className="shrink-0 text-[12px] text-slate-400 pt-1.5 whitespace-nowrap"
                      title={formatDateTime(e.created_at)}
                    >
                      {timeAgo(e.created_at)}
                    </time>
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        )}

        {(more || (loading && entries.length > 0)) && (
          <div className="pt-3 flex justify-center">
            <button
              type="button"
              disabled={loading}
              onClick={() => void load(true, entries[entries.length - 1]?.id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-slate-600 bg-white ring-1 ring-slate-200 hover:ring-slate-300 disabled:opacity-50"
            >
              {loading && <Loader2 size={14} className="animate-spin" />} Load older activity
            </button>
          </div>
        )}
        {loading && entries.length === 0 && (
          <div className="p-10 flex justify-center text-slate-400">
            <Loader2 size={18} className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityPage;
