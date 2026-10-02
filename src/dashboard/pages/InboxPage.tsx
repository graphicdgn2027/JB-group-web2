import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Archive,
  ArrowLeft,
  CheckCircle2,
  Inbox as InboxIcon,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  RefreshCw,
  Reply,
  Search,
  Send,
  Server,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import {
  countNewMessages,
  deleteMessage,
  getMailSettings,
  listMessages,
  saveMailSettings,
  sendTestEmail,
  updateMessage,
  type ContactMessage,
  type MailSettings,
  type MessageStatus,
} from "../adminApi";
import { useAccess } from "../AuthProvider";
import { useReviewQueue } from "../reviewQueue";
import { Button, Field, Grid, Notice, Panel, TextArea, TextInput, Toggle } from "../components/ui";
import { formatDateTime, timeAgo } from "../format";
import { useSection } from "../../content/ContentProvider";

type Filter = "new" | "open" | "replied" | "archived" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "open", label: "Inbox" },
  { id: "new", label: "Unread" },
  { id: "replied", label: "Replied" },
  { id: "archived", label: "Archived" },
  { id: "all", label: "All" },
];

const matchesFilter = (m: ContactMessage, f: Filter) =>
  f === "all" ? true : f === "open" ? m.status === "new" || m.status === "read" : m.status === f;

const fullName = (m: ContactMessage) => `${m.first_name} ${m.last_name}`.trim() || m.email;

/* ---------------------------------------------------------------- messages */

const MessagesTab: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("open");
  const [company, setCompany] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const { refreshInbox } = useReviewQueue();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setMessages(await listMessages());
      setLoadError(null);
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const companies = useMemo(
    () => [...new Set(messages.map((m) => m.company).filter(Boolean))].sort(),
    [messages]
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages
      .filter((m) => matchesFilter(m, filter))
      .filter((m) => !company || m.company === company)
      .filter(
        (m) =>
          !q ||
          `${fullName(m)} ${m.email} ${m.company} ${m.inquiry_type} ${m.message}`.toLowerCase().includes(q)
      );
  }, [messages, filter, company, query]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;

  const patchLocal = (id: string, patch: Partial<ContactMessage>) =>
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, ...patch } : m)));

  const open = async (m: ContactMessage) => {
    setSelectedId(m.id);
    setNotes(m.notes);
    if (m.status === "new") {
      patchLocal(m.id, { status: "read" });
      try {
        await updateMessage(m.id, { status: "read" });
        refreshInbox();
      } catch {
        patchLocal(m.id, { status: "new" });
      }
    }
  };

  const setStatus = async (m: ContactMessage, status: MessageStatus) => {
    const before = m.status;
    patchLocal(m.id, { status });
    try {
      await updateMessage(m.id, { status });
      refreshInbox();
      toast.success(
        status === "archived" ? "Archived" : status === "replied" ? "Marked as replied" : "Marked as unread"
      );
    } catch (e) {
      patchLocal(m.id, { status: before });
      toast.error("Couldn't update the message", { description: e instanceof Error ? e.message : String(e) });
    }
  };

  const saveNotes = async (m: ContactMessage) => {
    setBusy(true);
    try {
      await updateMessage(m.id, { notes });
      patchLocal(m.id, { notes });
      toast.success("Notes saved");
    } catch (e) {
      toast.error("Couldn't save notes", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setBusy(false);
    }
  };

  const remove = async (m: ContactMessage) => {
    if (!window.confirm(`Delete the message from ${fullName(m)}? This can't be undone.`)) return;
    try {
      await deleteMessage(m.id);
      setMessages((list) => list.filter((x) => x.id !== m.id));
      setSelectedId(null);
      refreshInbox();
      toast.success("Message deleted");
    } catch (e) {
      toast.error("Couldn't delete", { description: e instanceof Error ? e.message : String(e) });
    }
  };

  if (loadError) {
    const notSetUp = /contact_messages|schema cache|does not exist/i.test(loadError);
    return (
      <Notice tone="warn">
        {notSetUp
          ? "The inbox table doesn't exist yet. Run the latest supabase/schema.sql in the Supabase SQL Editor, then reload."
          : `Couldn't load messages: ${loadError}`}
      </Notice>
    );
  }

  const replyHref = (m: ContactMessage) =>
    `mailto:${m.email}?subject=${encodeURIComponent(`Re: your ${m.inquiry_type || "enquiry"} to JB Group`)}&body=${encodeURIComponent(
      `\n\n\n> ${m.message.split("\n").join("\n> ")}`
    )}`;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(320px,420px)_minmax(0,1fr)] items-start">
      {/* List */}
      <section className={`dash-card overflow-hidden ${selected ? "hidden lg:block" : ""}`}>
        <div className="p-4 space-y-3 border-b border-slate-100">
          <div className="flex gap-2">
            <label className="relative flex-1 min-w-0">
              <span className="sr-only">Search messages</span>
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, email or text"
                className="w-full rounded-xl pl-10 pr-3 py-2 outline-none"
              />
            </label>
            <button
              type="button"
              onClick={() => void load()}
              title="Refresh"
              aria-label="Refresh"
              className="w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
          <div className="flex gap-1 overflow-x-auto -mx-1 px-1">
            {FILTERS.map((f) => {
              const n = messages.filter((m) => matchesFilter(m, f.id)).length;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-[12.5px] font-semibold ${
                    filter === f.id ? "bg-[var(--dash-brand)] text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  }`}
                >
                  {f.label} <span className="tabular-nums opacity-70">{n}</span>
                </button>
              );
            })}
          </div>
          {companies.length > 0 && (
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              aria-label="Filter by company"
              className="w-full rounded-xl px-3 py-2 text-[13px] outline-none cursor-pointer"
            >
              <option value="">All companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
        </div>

        {loading && messages.length === 0 ? (
          <ul className="p-2 space-y-1" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="rounded-xl p-3 space-y-2 animate-pulse">
                <div className="h-3 w-1/3 rounded bg-slate-200" />
                <div className="h-3 w-2/3 rounded bg-slate-100" />
              </li>
            ))}
          </ul>
        ) : visible.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <InboxIcon size={22} className="mx-auto text-slate-300" />
            <p className="mt-3 text-[14px] font-semibold text-slate-700">
              {messages.length ? "Nothing here" : "No messages yet"}
            </p>
            <p className="text-[12.5px] text-slate-400 mt-1">
              {messages.length
                ? "Try another filter or search."
                : "Enquiries sent through the contact form will appear here."}
            </p>
          </div>
        ) : (
          <ul className="max-h-[calc(100vh-330px)] overflow-y-auto p-2 space-y-0.5">
            {visible.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => void open(m)}
                  className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors ${
                    selectedId === m.id ? "bg-slate-100" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {m.status === "new" && (
                      <span className="w-2 h-2 shrink-0 rounded-full bg-[var(--dash-gold)]" aria-label="Unread" />
                    )}
                    <span
                      className={`flex-1 min-w-0 truncate text-[13.5px] ${
                        m.status === "new" ? "font-bold text-slate-900" : "font-medium text-slate-700"
                      }`}
                    >
                      {fullName(m)}
                    </span>
                    <span className="shrink-0 text-[11.5px] text-slate-400">{timeAgo(m.created_at)}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-slate-500">
                    {[m.company, m.inquiry_type].filter(Boolean).join(" · ") || m.email}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-slate-400">{m.message}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Reading pane */}
      {selected ? (
        <section className="dash-card p-5 sm:p-7 min-w-0">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            className="lg:hidden mb-4 inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-[13px] font-semibold text-slate-600 hover:bg-slate-100"
          >
            <ArrowLeft size={15} /> Messages
          </button>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-[20px] font-bold text-slate-900 tracking-tight break-words">{fullName(selected)}</h3>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-[13px]">
                <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#b8862b] break-all">
                  <Mail size={13} /> {selected.email}
                </a>
                {selected.phone && (
                  <a href={`tel:${selected.phone}`} className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#b8862b]">
                    <Phone size={13} /> {selected.phone}
                  </a>
                )}
              </div>
            </div>
            <p className="text-[12.5px] text-slate-400">{formatDateTime(selected.created_at)}</p>
          </div>

          <dl className="mt-5 grid gap-2 sm:grid-cols-3 text-[12.5px]">
            {[
              ["Company", selected.company || "Not chosen"],
              ["Enquiry", selected.inquiry_type || "General"],
              ["Sent from", selected.page || "Contact page"],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 px-3.5 py-2.5">
                <dt className="text-slate-400">{k}</dt>
                <dd className="mt-0.5 font-semibold text-slate-800 truncate">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 whitespace-pre-wrap break-words text-[14.5px] leading-relaxed text-slate-800">
            {selected.message}
          </p>

          <div
            className={`mt-6 flex items-start gap-2.5 rounded-xl px-3.5 py-2.5 text-[12.5px] ${
              selected.email_status === "sent"
                ? "bg-emerald-50 text-emerald-800"
                : selected.email_status === "failed"
                  ? "bg-[var(--dash-danger-soft)] text-[#991b1b]"
                  : "bg-slate-50 text-slate-500"
            }`}
          >
            {selected.email_status === "failed" ? (
              <TriangleAlert size={15} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={15} className="shrink-0 mt-0.5" />
            )}
            <span className="break-words">
              {selected.email_status === "sent"
                ? `Emailed to ${selected.routed_to || "your inbox"}.`
                : selected.email_status === "failed"
                  ? `Saved here, but the email notification failed: ${selected.email_error}`
                  : "Saved here only. Email notifications are switched off."}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={replyHref(selected)}
              onClick={() => void setStatus(selected, "replied")}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--dash-brand)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--dash-brand-2)]"
            >
              <Reply size={15} /> Reply by email
            </a>
            {selected.status !== "replied" && (
              <button
                type="button"
                onClick={() => void setStatus(selected, "replied")}
                className="inline-flex items-center gap-2 rounded-xl ring-1 ring-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:text-slate-900"
              >
                <CheckCircle2 size={15} /> Mark replied
              </button>
            )}
            {selected.status !== "archived" ? (
              <button
                type="button"
                onClick={() => void setStatus(selected, "archived")}
                className="inline-flex items-center gap-2 rounded-xl ring-1 ring-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:text-slate-900"
              >
                <Archive size={15} /> Archive
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void setStatus(selected, "read")}
                className="inline-flex items-center gap-2 rounded-xl ring-1 ring-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-700 hover:text-slate-900"
              >
                <InboxIcon size={15} /> Move to inbox
              </button>
            )}
            <button
              type="button"
              onClick={() => void setStatus(selected, "new")}
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              <MailOpen size={15} /> Mark unread
            </button>
            <button
              type="button"
              onClick={() => void remove(selected)}
              className="ml-auto inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-[13px] font-semibold text-slate-500 hover:text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)]"
            >
              <Trash2 size={15} /> Delete
            </button>
          </div>

          <div className="mt-7 pt-6 border-t border-slate-100">
            <Field label="Internal notes" hint="Only visible in the dashboard.">
              <TextArea value={notes} onChange={setNotes} rows={3} placeholder="Called back on Monday, sent price list…" />
            </Field>
            <div className="mt-3">
              <Button onClick={() => void saveNotes(selected)} disabled={busy || notes === selected.notes}>
                {busy ? <Loader2 size={14} className="animate-spin" /> : null} Save notes
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <section className="hidden lg:flex dash-card min-h-[420px] items-center justify-center text-center p-8">
          <div>
            <MailOpen size={26} className="mx-auto text-slate-300" />
            <p className="mt-3 text-[14px] font-semibold text-slate-700">Select a message</p>
            <p className="text-[12.5px] text-slate-400 mt-1">It opens here, with the sender's details and reply options.</p>
          </div>
        </section>
      )}
    </div>
  );
};

/* -------------------------------------------------------------- mail setup */

const EMPTY: MailSettings = {
  enabled: false,
  smtp_host: "",
  smtp_port: 465,
  smtp_user: "",
  has_password: false,
  from_email: "",
  from_name: "JB Group website",
  notify_to: "",
  autoreply_enabled: false,
  autoreply_subject: "We received your message",
  autoreply_body: "",
  routes: {},
  copy_main_inbox: true,
  updated_at: "",
};

const MailSetupTab: React.FC = () => {
  const contact = useSection("contact");
  const [settings, setSettings] = useState<MailSettings>(EMPTY);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [testTo, setTestTo] = useState("");
  const [testing, setTesting] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    getMailSettings()
      .then((s) => {
        setSettings({ ...EMPTY, ...s, routes: s.routes ?? {} });
        setTestTo(s.notify_to.split(/[,;\s]+/)[0] ?? "");
      })
      .catch((e) => setLoadError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const set = (patch: Partial<MailSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
    setDirty(true);
  };

  const setRoute = (kind: "companies" | "inquiries", id: string, value: string) =>
    set({ routes: { ...settings.routes, [kind]: { ...(settings.routes[kind] ?? {}), [id]: value.trim() } } });

  const save = async () => {
    setSaving(true);
    try {
      const { has_password: _hp, updated_at: _u, ...rest } = settings;
      await saveMailSettings({ ...rest, smtp_password: password });
      setSettings((s) => ({ ...s, has_password: s.has_password || password !== "" }));
      setPassword("");
      setDirty(false);
      toast.success("Email settings saved");
    } catch (e) {
      toast.error("Couldn't save", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setSaving(false);
    }
  };

  const test = async () => {
    if (dirty) {
      toast.error("Save your changes first", { description: "The test uses the saved settings." });
      return;
    }
    setTesting(true);
    try {
      const to = await sendTestEmail(testTo.trim());
      toast.success("Test email sent", { description: `Check ${to}. It can take a minute to arrive.` });
    } catch (e) {
      toast.error("Test email failed", { description: e instanceof Error ? e.message : String(e) });
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="dash-card p-10 flex items-center justify-center text-slate-400">
        <Loader2 size={18} className="animate-spin" />
      </div>
    );
  }
  if (loadError) {
    return (
      <Notice tone="warn">
        {/get_mail_settings|schema cache|does not exist/i.test(loadError)
          ? "Email settings aren't set up in the database yet. Run the latest supabase/schema.sql in the Supabase SQL Editor, then reload."
          : loadError}
      </Notice>
    );
  }

  const port = Number(settings.smtp_port) || 465;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2 items-start">
        <Panel
          title="Your mail server"
          description="The website sends notifications through your own email account, using the same details as a mail app."
          actions={<Server size={16} className="text-slate-300" />}
        >
          <Toggle checked={settings.enabled} onChange={(v) => set({ enabled: v })} label="Email me when someone sends the contact form" />
          <Grid>
            <Field label="Mail server (SMTP host)" hint="On cPanel this is usually mail.yourdomain.com">
              <TextInput value={settings.smtp_host} onChange={(v) => set({ smtp_host: v.trim() })} placeholder="mail.jbgroup.com.np" />
            </Field>
            <Field label="Port" hint="Use 465 (SSL). Ports 25 and 587 are blocked by the hosting service.">
              <TextInput
                type="number"
                value={String(settings.smtp_port)}
                onChange={(v) => set({ smtp_port: Number(v) || 465 })}
              />
            </Field>
          </Grid>
          {port !== 465 && (
            <Notice tone="warn">
              Port {port} may not work: the email service can only connect on 465. Check your host's mail settings for the SSL port.
            </Notice>
          )}
          <Grid>
            <Field label="Username" hint="Usually the full email address.">
              <TextInput value={settings.smtp_user} onChange={(v) => set({ smtp_user: v.trim() })} placeholder="website@jbgroup.com.np" />
            </Field>
            <Field
              label="Password"
              hint={settings.has_password ? "A password is saved. Leave empty to keep it." : "Stored privately; it is never shown again."}
            >
              <TextInput
                type="password"
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  setDirty(true);
                }}
                placeholder={settings.has_password ? "••••••••  (saved)" : ""}
              />
            </Field>
          </Grid>
          <Grid>
            <Field label="Send from address" hint="Leave empty to use the username.">
              <TextInput value={settings.from_email} onChange={(v) => set({ from_email: v.trim() })} />
            </Field>
            <Field label="Sender name">
              <TextInput value={settings.from_name} onChange={(v) => set({ from_name: v })} />
            </Field>
          </Grid>
        </Panel>

        <Panel title="Where messages go" description="Separate several addresses with commas.">
          <Field label="Main inbox" hint="Gets every message, unless a company below has its own address.">
            <TextInput value={settings.notify_to} onChange={(v) => set({ notify_to: v })} placeholder="info@jbgroup.com.np" />
          </Field>
          <Toggle
            checked={settings.copy_main_inbox}
            onChange={(v) => set({ copy_main_inbox: v })}
            label="Also copy the main inbox on company and enquiry-type messages"
          />

          <div className="pt-2">
            <p className="text-[13px] font-bold text-slate-900">By company</p>
            <p className="text-[12px] text-slate-500 mb-3">When a visitor picks a company, the message goes to its address.</p>
            <div className="space-y-2">
              {contact.companies.map((c) => (
                <label key={c.id} className="grid sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[13px] font-medium text-slate-700 truncate">{c.label}</span>
                  <input
                    value={settings.routes.companies?.[c.id] ?? ""}
                    onChange={(e) => setRoute("companies", c.id, e.target.value)}
                    placeholder="Uses the main inbox"
                    className="w-full rounded-2xl px-3.5 py-2 text-[13px] outline-none"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <p className="text-[13px] font-bold text-slate-900">By enquiry type</p>
            <p className="text-[12px] text-slate-500 mb-3">For example, send careers enquiries to HR.</p>
            <div className="space-y-2">
              {contact.inquiryTypes.map((t) => (
                <label key={t.id} className="grid sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)] items-center gap-2">
                  <span className="text-[13px] font-medium text-slate-700 truncate">{t.label}</span>
                  <input
                    value={settings.routes.inquiries?.[t.id] ?? ""}
                    onChange={(e) => setRoute("inquiries", t.id, e.target.value)}
                    placeholder="Uses the main inbox"
                    className="w-full rounded-2xl px-3.5 py-2 text-[13px] outline-none"
                  />
                </label>
              ))}
            </div>
          </div>
          <p className="text-[11.5px] text-slate-400">
            These addresses are stored privately and never shown on the website.
          </p>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-2 items-start">
        <Panel title="Automatic reply" description="Optional confirmation sent to the visitor.">
          <Toggle
            checked={settings.autoreply_enabled}
            onChange={(v) => set({ autoreply_enabled: v })}
            label="Send an automatic reply"
          />
          <Field label="Subject">
            <TextInput value={settings.autoreply_subject} onChange={(v) => set({ autoreply_subject: v })} />
          </Field>
          <Field label="Message" hint="{name} is replaced with the visitor's first name.">
            <TextArea
              value={settings.autoreply_body}
              onChange={(v) => set({ autoreply_body: v })}
              rows={5}
              placeholder={"Dear {name},\n\nThank you for contacting JB Group. We'll get back to you within two working days.\n\nJB Group"}
            />
          </Field>
        </Panel>

        <Panel title="Save and test">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={() => void save()} disabled={saving || !dirty}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />} Save settings
            </Button>
          </div>
          <Field label="Send a test email to">
            <TextInput value={testTo} onChange={setTestTo} placeholder="you@jbgroup.com.np" />
          </Field>
          <Button onClick={() => void test()} disabled={testing || !testTo.trim()}>
            {testing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />} Send test email
          </Button>
          {settings.updated_at && (
            <p className="text-[11.5px] text-slate-400">Last saved {timeAgo(settings.updated_at)}.</p>
          )}
        </Panel>
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------- page */

const InboxPage: React.FC = () => {
  const access = useAccess();
  const canInbox = access.can("inbox.manage");
  const canSetup = access.can("settings.manage");
  const [tab, setTab] = useState<"messages" | "setup">(canInbox ? "messages" : "setup");

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Inbox</h2>
          <p className="text-sm text-slate-500 mt-1">Messages from the website's contact form.</p>
        </div>
        {canInbox && canSetup && (
          <div role="tablist" className="inline-flex gap-1 rounded-2xl bg-white p-1 ring-1 ring-slate-200">
            {(
              [
                ["messages", "Messages", InboxIcon],
                ["setup", "Email setup", Server],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[13px] font-semibold ${
                  tab === id ? "bg-[var(--dash-brand)] text-white" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
        )}
      </div>
      {tab === "messages" && canInbox ? <MessagesTab /> : <MailSetupTab />}
    </div>
  );
};

export default InboxPage;
