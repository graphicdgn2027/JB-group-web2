import React, { useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Ban,
  Check,
  Database,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Send,
  ShieldOff,
  UserX,
} from "lucide-react";
import whiteLogo from "@/assets/reliance_logo.png";
import { useAuth, type AccessStatus } from "../AuthProvider";
import { useDrafts } from "../DraftProvider";
import { SECTION_META } from "../sections";
import Modal from "./Modal";
import { FormRow, PasswordField } from "./people";
import "../dashboard.css";

const Frame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="dash min-h-screen flex flex-col items-center justify-center px-6 py-12">
    <span className="mb-8 inline-flex items-center rounded-xl bg-[#0f172a] px-3.5 py-2.5 shadow-md">
      <img src={whiteLogo} alt="JB Group" className="h-7 w-auto" />
    </span>
    <div className="dash-card dash-fade-up w-full max-w-md p-7">{children}</div>
  </div>
);

const COPY: Record<Exclude<AccessStatus, "idle" | "loading" | "ready">, { icon: React.ElementType; tone: string; title: string; body: string }> = {
  "not-installed": {
    icon: Database,
    tone: "bg-amber-50 text-amber-600 ring-amber-200",
    title: "The database isn't set up yet",
    body: "You're signed in, but the dashboard's tables haven't been created in Supabase. Run supabase/schema.sql in the Supabase SQL Editor, then press Try again.",
  },
  "no-profile": {
    icon: UserX,
    tone: "bg-slate-100 text-slate-500 ring-slate-200",
    title: "No dashboard access",
    body: "Your login exists, but it hasn't been given access to the dashboard. Ask a Super Admin to add you.",
  },
  inactive: {
    icon: Ban,
    tone: "bg-rose-50 text-rose-600 ring-rose-200",
    title: "Your account is disabled",
    body: "A Super Admin has turned off your access. Contact them if you think this is a mistake.",
  },
  error: {
    icon: ShieldOff,
    tone: "bg-rose-50 text-rose-600 ring-rose-200",
    title: "Couldn't check your access",
    body: "Something went wrong while loading your permissions.",
  },
};

/** Shown instead of the dashboard when the signed-in user can't use it. */
export const AccessProblemScreen: React.FC<{ status: AccessStatus }> = ({ status }) => {
  const { user, signOut, refreshAccess, accessError } = useAuth();
  const [retrying, setRetrying] = useState(false);
  const copy = COPY[status as keyof typeof COPY] ?? COPY.error;

  return (
    <Frame>
      <span className={`w-12 h-12 rounded-2xl ring-1 flex items-center justify-center mb-5 ${copy.tone}`}>
        <copy.icon size={22} />
      </span>
      <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">{copy.title}</h1>
      <p className="text-[14px] text-slate-500 mt-2 leading-relaxed">{copy.body}</p>
      {status === "error" && accessError && (
        <p className="mt-3 text-[12.5px] font-mono text-rose-600 break-words">{accessError}</p>
      )}
      <p className="mt-5 text-[12.5px] text-slate-400">
        Signed in as <span className="font-semibold text-slate-600">{user?.email}</span>
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={retrying}
          onClick={async () => {
            setRetrying(true);
            await refreshAccess();
            setRetrying(false);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] disabled:opacity-50"
        >
          <RefreshCw size={15} className={retrying ? "animate-spin" : ""} /> Try again
        </button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 bg-white ring-1 ring-slate-200 hover:ring-slate-300"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>
    </Frame>
  );
};

/** After following a password-reset link: choose a new password before continuing. */
export const SetNewPasswordScreen: React.FC = () => {
  const { user, updatePassword, signOut } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    try {
      await updatePassword(password);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Frame>
      <span className="w-12 h-12 rounded-2xl ring-1 flex items-center justify-center mb-5 bg-amber-50 text-amber-700 ring-amber-200">
        <KeyRound size={22} />
      </span>
      <h1 className="text-[22px] font-bold text-slate-900 tracking-tight">Choose a new password</h1>
      <p className="text-[14px] text-slate-500 mt-2">For {user?.email}</p>
      <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
        <FormRow label="New password">
          <PasswordField value={password} onChange={setPassword} />
        </FormRow>
        <FormRow label="Confirm new password">
          <PasswordField value={confirm} onChange={setConfirm} placeholder="Type it again" allowGenerate={false} />
        </FormRow>
        {error && <p className="text-[13px] text-rose-600">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full h-11 inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] disabled:opacity-50"
        >
          {busy ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save and continue
        </button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="w-full text-[13px] font-medium text-slate-500 hover:text-slate-800 py-1"
        >
          Cancel and sign out
        </button>
      </form>
    </Frame>
  );
};

/** In-dashboard page for routes the user's role can't open. */
export const NoAccessPage: React.FC = () => (
  <div className="dash-card p-10 text-center max-w-lg mx-auto mt-6">
    <span className="mx-auto w-12 h-12 rounded-2xl ring-1 flex items-center justify-center mb-4 bg-slate-50 text-slate-400 ring-slate-200">
      <ShieldOff size={22} />
    </span>
    <h2 className="text-[18px] font-bold text-slate-900">You don't have access to this page</h2>
    <p className="text-[13.5px] text-slate-500 mt-2">
      Your role doesn't include it. Ask a Super Admin if you need access.
    </p>
    <Link
      to="/dashboard"
      className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)]"
    >
      <ArrowLeft size={15} /> Back to overview
    </Link>
  </div>
);

/** Lets a content creator add a note before sending every draft for review. */
export const SubmitForReviewDialog: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { dirtyKeys, submit, publishing } = useDrafts();
  const [note, setNote] = useState("");

  const send = async () => {
    if (await submit(undefined, note)) {
      setNote("");
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      locked={publishing}
      width="sm"
      title="Submit for review"
      description="An editor will check your changes and publish them. You'll see their feedback on the Review page."
      icon={
        <span className="w-10 h-10 rounded-xl bg-sky-50 ring-1 ring-sky-200 flex items-center justify-center">
          <Send size={18} className="text-sky-600" />
        </span>
      }
      footer={
        <>
          <button type="button" onClick={onClose} disabled={publishing} className="px-4 py-2.5 text-[13.5px] font-semibold text-slate-600 hover:bg-slate-100">
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void send()}
            disabled={publishing || dirtyKeys.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-[13.5px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] disabled:opacity-50"
          >
            {publishing ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            Submit {dirtyKeys.length}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-2">Sections</p>
          <div className="flex flex-wrap gap-1.5">
            {dirtyKeys.map((k) => (
              <span key={k} className="text-[12.5px] font-medium text-slate-700 bg-slate-100 rounded-lg px-2.5 py-1">
                {SECTION_META[k].label}
              </span>
            ))}
          </div>
        </div>
        <FormRow label="Note for the reviewer (optional)">
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Updated the leadership bios with the new titles."
            className="w-full rounded-xl px-3.5 py-3 outline-none resize-y"
          />
        </FormRow>
      </div>
    </Modal>
  );
};
