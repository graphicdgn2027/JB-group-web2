import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  CheckCircle2,
  ClipboardCheck,
  Eye,
  Inbox,
  Loader2,
  MessageSquareText,
  PenLine,
  RefreshCw,
  Undo2,
  XCircle,
} from "lucide-react";
import { useAccess } from "../AuthProvider";
import { useContentStore } from "../../content/ContentProvider";
import { useDrafts } from "../DraftProvider";
import { usePreviewControl } from "../previewControl";
import { useReviewQueue } from "../reviewQueue";
import { SECTION_META } from "../sections";
import {
  approveSubmission,
  listSubmissions,
  rejectSubmission,
  withdrawSubmission,
  type Submission,
  type SubmissionStatus,
} from "../adminApi";
import { formatDateTime, timeAgo } from "../format";
import Modal from "../components/Modal";
import { Avatar, FormRow } from "../components/people";
import type { SiteContent } from "../../content/types";

type Tab = "pending" | "history" | "mine";

const STATUS_STYLE: Record<SubmissionStatus, { label: string; cls: string }> = {
  pending: { label: "Waiting for review", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  approved: { label: "Approved & live", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  rejected: { label: "Changes requested", cls: "bg-rose-50 text-rose-700 ring-rose-200" },
  withdrawn: { label: "Withdrawn", cls: "bg-slate-100 text-slate-500 ring-slate-200" },
};

const humanize = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase()).toLowerCase().replace(/^./, (c) => c.toUpperCase());

/** Plain-language list of what a submission changes compared with the live site. */
function describeChanges(next: unknown, live: unknown): string[] {
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  if (same(next, live)) return ["No differences from the live site"];
  if (Array.isArray(next)) {
    const before = Array.isArray(live) ? live.length : 0;
    return next.length === before ? [`${next.length} items updated`] : [`${before} → ${next.length} items`];
  }
  if (next && typeof next === "object" && live && typeof live === "object") {
    const changed = Object.keys(next as object).filter(
      (k) => !same((next as Record<string, unknown>)[k], (live as Record<string, unknown>)[k])
    );
    return changed.map((k) => {
      const value = (next as Record<string, unknown>)[k];
      const old = (live as Record<string, unknown>)[k];
      if (Array.isArray(value)) {
        const was = Array.isArray(old) ? old.length : 0;
        return value.length === was ? `${humanize(k)} (edited)` : `${humanize(k)} (${was} → ${value.length})`;
      }
      return humanize(k);
    });
  }
  return ["Content updated"];
}

const ReviewDialog: React.FC<{
  mode: "approve" | "reject" | null;
  submission: Submission | null;
  onClose: () => void;
  onDone: () => void;
}> = ({ mode, submission, onClose, onDone }) => {
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNote("");
    setError(null);
  }, [mode, submission]);

  const approve = mode === "approve";

  const run = async () => {
    if (!submission) return;
    if (!approve && !note.trim()) return setError("Tell the author what needs to change.");
    setBusy(true);
    setError(null);
    try {
      if (approve) await approveSubmission(submission.id, note);
      else await rejectSubmission(submission.id, note);
      toast.success(approve ? "Approved and published" : "Sent back with your notes", {
        description: SECTION_META[submission.section_id]?.label,
      });
      onDone();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={!!mode && !!submission}
      onClose={onClose}
      locked={busy}
      width="sm"
      title={approve ? "Approve and publish?" : "Request changes"}
      description={
        approve
          ? "These changes go live on the website immediately."
          : "The author will see your note and can revise and resubmit."
      }
      icon={
        <span
          className={`w-10 h-10 rounded-xl flex items-center justify-center ring-1 ${
            approve ? "bg-emerald-50 ring-emerald-200" : "bg-rose-50 ring-rose-200"
          }`}
        >
          {approve ? <CheckCircle2 size={19} className="text-emerald-600" /> : <XCircle size={19} className="text-rose-600" />}
        </span>
      }
      footer={
        <>
          <button type="button" onClick={onClose} disabled={busy} className="px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void run()}
            disabled={busy}
            className={`inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white shadow-sm disabled:opacity-50 ${
              approve ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {busy && <Loader2 size={15} className="animate-spin" />}
            {approve ? "Approve & publish" : "Send back"}
          </button>
        </>
      }
    >
      <FormRow label={approve ? "Note for the author (optional)" : "What needs to change?"}>
        <textarea
          rows={4}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={approve ? "Great work!" : "e.g. Please shorten the second paragraph and use the new team photo."}
          className="w-full rounded-xl px-3.5 py-3 outline-none resize-y"
          autoFocus
        />
      </FormRow>
      {error && <p className="mt-3 text-[13px] text-rose-600">{error}</p>}
    </Modal>
  );
};

const ReviewPage: React.FC = () => {
  const access = useAccess();
  const reviewer = access.canPublish;
  const { content, refresh: refreshContent } = useContentStore();
  const { dirtyKeys, setDraft } = useDrafts();
  const preview = usePreviewControl();
  const queue = useReviewQueue();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>(reviewer ? "pending" : "mine");
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialog, setDialog] = useState<{ mode: "approve" | "reject"; sub: Submission } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        tab === "pending"
          ? await listSubmissions({ status: ["pending"] })
          : tab === "history"
            ? await listSubmissions({ status: ["approved", "rejected", "withdrawn"], limit: 60 })
            : await listSubmissions({ mine: access.profile.id });
      setItems(data);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [tab, access.profile.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const afterChange = () => {
    void load();
    queue.refresh();
    void refreshContent();
  };

  /** Puts submitted content into the local draft so it shows in the preview. */
  const loadIntoDraft = (sub: Submission, then: "preview" | "edit") => {
    const key = sub.section_id;
    if (dirtyKeys.includes(key) && !window.confirm(`You have unpublished edits to ${SECTION_META[key]?.label}. Replace them with this submission?`)) {
      return;
    }
    setDraft(key, sub.data as SiteContent[typeof key]);
    if (then === "preview") {
      preview.open(SECTION_META[key].previewPath({ ...content, [key]: sub.data } as SiteContent));
      toast.info("Loaded into your preview", {
        description: "Discard it from the unpublished menu when you're done checking.",
      });
    } else {
      navigate(SECTION_META[key].route);
    }
  };

  const withdraw = async (sub: Submission) => {
    try {
      await withdrawSubmission(sub.id);
      toast.success("Submission withdrawn");
      afterChange();
    } catch (e) {
      toast.error("Couldn't withdraw", { description: e instanceof Error ? e.message : String(e) });
    }
  };

  const tabs = useMemo(
    () =>
      [
        reviewer && { id: "pending" as Tab, label: "Needs review", count: queue.pending },
        reviewer && { id: "history" as Tab, label: "History" },
        access.can("content.edit") && !reviewer && { id: "mine" as Tab, label: "My submissions" },
      ].filter(Boolean) as { id: Tab; label: string; count?: number }[],
    [reviewer, access, queue.pending]
  );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[22px] font-bold text-slate-900 tracking-tight">Review</h2>
          <p className="text-[13.5px] text-slate-500 mt-1 max-w-2xl">
            {reviewer
              ? "Changes from content creators wait here until an editor approves them. Preview first, then approve or send back with notes."
              : "Changes you submit wait here until an editor approves them. You'll see their notes if anything needs to change."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => void load()}
          title="Refresh"
          className="p-2.5 text-slate-500 hover:text-slate-900 bg-white ring-1 ring-slate-200 hover:ring-slate-300"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {tabs.length > 1 && (
        <div className="inline-flex items-center gap-1 p-1 mb-5 bg-slate-100 rounded-xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-[13px] font-semibold ${
                tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
              {!!t.count && (
                <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-amber-500 text-white text-[10.5px] leading-[18px] text-center">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mb-4 text-[13px] text-rose-600">{error}</p>}

      {loading && items.length === 0 ? (
        <div className="dash-card p-10 flex justify-center text-slate-400">
          <Loader2 size={18} className="animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="dash-card p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
            {tab === "pending" ? <ClipboardCheck size={22} className="text-emerald-500" /> : <Inbox size={22} className="text-slate-400" />}
          </div>
          <p className="text-[14px] font-semibold text-slate-800">
            {tab === "pending" ? "Nothing waiting for review" : tab === "mine" ? "You haven't submitted anything yet" : "No reviews yet"}
          </p>
          <p className="text-[12.5px] text-slate-500 mt-1">
            {tab === "mine"
              ? "Edit a page, then press Submit for review."
              : "New submissions from content creators will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((sub) => {
            const meta = SECTION_META[sub.section_id];
            const status = STATUS_STYLE[sub.status];
            const mine = sub.submitted_by === access.profile.id;
            const changes = describeChanges(sub.data, content[sub.section_id]);
            return (
              <article key={sub.id} className="dash-card p-5">
                <div className="flex flex-wrap items-start gap-3">
                  <Avatar name="" email={sub.submitted_by_email || "?"} role="content_creator" size={38} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-[15px] font-bold text-slate-900">{meta?.label ?? sub.section_id}</h3>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-slate-500 mt-0.5" title={formatDateTime(sub.created_at)}>
                      {mine ? "You" : sub.submitted_by_email || "Unknown"} · submitted {timeAgo(sub.created_at)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {reviewer && sub.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => loadIntoDraft(sub, "preview")}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-slate-700 bg-white ring-1 ring-slate-200 hover:ring-slate-300"
                        >
                          <Eye size={14} /> Preview
                        </button>
                        <button
                          type="button"
                          onClick={() => setDialog({ mode: "reject", sub })}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-rose-600 bg-white ring-1 ring-rose-200 hover:bg-rose-50"
                        >
                          <XCircle size={14} /> Request changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setDialog({ mode: "approve", sub })}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                      </>
                    )}
                    {mine && sub.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => void withdraw(sub)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-slate-600 bg-white ring-1 ring-slate-200 hover:ring-slate-300"
                      >
                        <Undo2 size={14} /> Withdraw
                      </button>
                    )}
                    {mine && sub.status === "rejected" && access.canEditSection(sub.section_id) && (
                      <button
                        type="button"
                        onClick={() => loadIntoDraft(sub, "edit")}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-[12.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)]"
                      >
                        <PenLine size={14} /> Revise
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 pl-0 sm:pl-[50px] space-y-3">
                  {sub.note && (
                    <p className="text-[13.5px] text-slate-700 leading-relaxed">“{sub.note}”</p>
                  )}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">What changes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {changes.slice(0, 8).map((c) => (
                        <span key={c} className="text-[12px] font-medium text-slate-600 bg-slate-100 rounded-md px-2 py-0.5">
                          {c}
                        </span>
                      ))}
                      {changes.length > 8 && (
                        <span className="text-[12px] text-slate-400">+{changes.length - 8} more</span>
                      )}
                    </div>
                  </div>
                  {sub.status !== "pending" && sub.reviewed_by_email && (
                    <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 px-3.5 py-3">
                      <MessageSquareText size={15} className="text-slate-400 shrink-0 mt-0.5" />
                      <div className="text-[13px]">
                        <p className="text-slate-500">
                          {sub.status === "approved" ? "Approved" : "Reviewed"} by{" "}
                          <span className="font-semibold text-slate-700">{sub.reviewed_by_email}</span>{" "}
                          {timeAgo(sub.reviewed_at)}
                        </p>
                        {sub.review_note && <p className="text-slate-700 mt-1 leading-relaxed">{sub.review_note}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ReviewDialog
        mode={dialog?.mode ?? null}
        submission={dialog?.sub ?? null}
        onClose={() => setDialog(null)}
        onDone={afterChange}
      />
    </div>
  );
};

export default ReviewPage;
