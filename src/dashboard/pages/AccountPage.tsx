import React, { useState } from "react";
import { toast } from "sonner";
import { Check, CheckCircle2, Loader2, LogOut, Minus, ShieldCheck } from "lucide-react";
import { useAccess, useAuth } from "../AuthProvider";
import { updateOwnName } from "../adminApi";
import { PERMISSIONS } from "../permissions";
import { WORK_AREAS } from "../sections";
import { supabase } from "../../lib/supabase";
import { Avatar, FormRow, PasswordField, RoleBadge, textInputCls } from "../components/people";

const AccountPage: React.FC = () => {
  const access = useAccess();
  const { updatePassword, refreshAccess, user } = useAuth();
  const { profile } = access;

  const [name, setName] = useState(profile.full_name);
  const [savingName, setSavingName] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [savingPw, setSavingPw] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const saveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingName(true);
    try {
      await updateOwnName(profile.id, name);
      await refreshAccess();
      toast.success("Name updated");
    } catch (err) {
      toast.error("Couldn't update name", { description: err instanceof Error ? err.message : String(err) });
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);
    if (password.length < 8) return setPwError("Use at least 8 characters.");
    if (password !== confirm) return setPwError("The two passwords don't match.");
    setSavingPw(true);
    try {
      await updatePassword(password);
      setPassword("");
      setConfirm("");
      toast.success("Password changed", { description: "Use your new password next time you sign in." });
    } catch (err) {
      setPwError(err instanceof Error ? err.message : String(err));
    } finally {
      setSavingPw(false);
    }
  };

  const signOutEverywhere = async () => {
    if (!supabase) return;
    if (!window.confirm("Sign out on every device, including this one?")) return;
    await supabase.auth.signOut({ scope: "global" });
  };

  const pages =
    access.isSuperAdmin || profile.sections === null
      ? null
      : WORK_AREAS.filter((a) => a.keys.every((k) => access.canEditSection(k)));

  return (
    <div className="space-y-6">
      {/* Identity */}
      <section className="dash-card overflow-hidden">
        <div className="h-20 bg-gradient-to-r from-[#0f172a] via-[#1b2a5e] to-[#a97a20]" />
        <div className="px-6 pb-6 -mt-9 flex flex-wrap items-end gap-4">
          <span className="ring-4 ring-white rounded-[22px]">
            <Avatar name={profile.full_name} email={profile.email} role={profile.role} size={72} />
          </span>
          <div className="min-w-0 flex-1 pb-1">
            <h2 className="text-[20px] font-bold text-slate-900 tracking-tight truncate">
              {profile.full_name || profile.email.split("@")[0]}
            </h2>
            <p className="text-[13.5px] text-slate-500 truncate">{profile.email}</p>
          </div>
          <div className="pb-1.5">
            <RoleBadge role={profile.role} label={profile.role_label} />
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="dash-card p-6">
          <h3 className="text-[15px] font-bold text-slate-900">Your details</h3>
          <p className="text-[12.5px] text-slate-500 mt-1 mb-5">
            Your email is managed by an administrator.
            {user?.last_sign_in_at && ` Last signed in ${new Date(user.last_sign_in_at).toLocaleString()}.`}
          </p>
          <form onSubmit={saveName} className="space-y-4">
            <FormRow label="Full name">
              <input className={textInputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </FormRow>
            <FormRow label="Email">
              <input className={`${textInputCls} text-slate-400`} value={profile.email} disabled />
            </FormRow>
            <button
              type="submit"
              disabled={savingName || name.trim() === profile.full_name}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] disabled:opacity-40"
            >
              {savingName ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save name
            </button>
          </form>
        </section>

        <section className="dash-card p-6">
          <h3 className="text-[15px] font-bold text-slate-900">Change password</h3>
          <p className="text-[12.5px] text-slate-500 mt-1 mb-5">Choose something long and unique to this site.</p>
          <form onSubmit={savePassword} className="space-y-4">
            <FormRow label="New password">
              <PasswordField value={password} onChange={setPassword} />
            </FormRow>
            <FormRow label="Confirm new password">
              <PasswordField value={confirm} onChange={setConfirm} placeholder="Type it again" allowGenerate={false} />
            </FormRow>
            {pwError && <p className="text-[13px] text-rose-600">{pwError}</p>}
            <button
              type="submit"
              disabled={savingPw || !password}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-white bg-[var(--dash-brand)] hover:bg-[var(--dash-brand-2)] disabled:opacity-40"
            >
              {savingPw ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />} Update password
            </button>
          </form>
        </section>
      </div>

      <section className="dash-card p-6">
        <h3 className="text-[15px] font-bold text-slate-900">What you can do</h3>
        <p className="text-[12.5px] text-slate-500 mt-1 mb-5">
          Set by your role{access.isSuperAdmin ? "" : ". Ask a Super Admin if you need more access."}
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {PERMISSIONS.map((p) => {
            const on = access.can(p.key);
            return (
              <div key={p.key} className={`flex items-start gap-3 rounded-xl p-3 ${on ? "bg-emerald-50/60" : "bg-slate-50"}`}>
                <span
                  className={`mt-0.5 w-5 h-5 shrink-0 rounded-full flex items-center justify-center ${
                    on ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-400"
                  }`}
                >
                  {on ? <Check size={12} strokeWidth={3} /> : <Minus size={12} strokeWidth={3} />}
                </span>
                <div>
                  <p className={`text-[13.5px] font-semibold ${on ? "text-slate-900" : "text-slate-400"}`}>{p.label}</p>
                  <p className="text-[12px] text-slate-500">{p.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {access.can("content.edit") && (
          <div className="mt-5">
            <p className="text-[12px] font-bold uppercase tracking-wider text-slate-400 mb-2">Pages you can edit</p>
            {pages === null ? (
              <p className="inline-flex items-center gap-1.5 text-[13px] text-slate-700">
                <CheckCircle2 size={14} className="text-emerald-500" /> All pages
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {pages.length === 0 && <span className="text-[13px] text-slate-400">None assigned yet</span>}
                {pages.map((a) => (
                  <span key={a.id} className="text-[12.5px] font-medium text-slate-700 bg-slate-100 rounded-lg px-2.5 py-1">
                    {a.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="dash-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-[15px] font-bold text-slate-900">Sessions</h3>
          <p className="text-[12.5px] text-slate-500 mt-1">Signed in on a shared or lost device? Sign out everywhere.</p>
        </div>
        <button
          type="button"
          onClick={() => void signOutEverywhere()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-[13px] font-semibold text-rose-600 bg-white ring-1 ring-rose-200 hover:bg-rose-50"
        >
          <LogOut size={14} /> Sign out everywhere
        </button>
      </section>
    </div>
  );
};

export default AccountPage;
