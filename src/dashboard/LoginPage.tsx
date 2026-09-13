import React, { useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, Lock } from "lucide-react";
import { useAuth } from "./AuthProvider";
import "./dashboard.css";

const inputCls =
  "w-full border border-[var(--dash-border-strong)] rounded-[10px] px-3.5 py-2.5 text-[13.5px] outline-none bg-white transition-all focus:border-[#cb9733] focus:ring-4 focus:ring-[var(--dash-gold-ring)] hover:border-slate-400";

const LoginPage: React.FC = () => {
  const { signIn, sendPasswordReset, configured } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!email.trim()) {
      setError("Enter your email address first, then press Forgot password.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await sendPasswordReset(email.trim());
      setNotice("Password reset link sent. Check your inbox.");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="dash min-h-screen flex items-center justify-center p-6"
      style={{
        background:
          "radial-gradient(circle at 20% 15%, rgba(203,151,51,0.08), transparent 45%), radial-gradient(circle at 85% 80%, rgba(17,29,67,0.06), transparent 40%), var(--dash-bg)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="flex items-center gap-3 mb-7">
          <div
            className="w-11 h-11 shrink-0 bg-gradient-to-br from-[var(--dash-brand)] to-[var(--dash-brand-2)] flex items-center justify-center shadow-md"
            style={{ borderRadius: 12 }}
          >
            <Lock size={19} className="text-[#cb9733]" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-slate-900">JB Group Dashboard</h1>
            <p className="text-[12.5px] text-slate-500">Sign in to manage site content</p>
          </div>
        </div>

        {!configured ? (
          <div className="dash-card p-5">
            <h2 className="text-sm font-semibold text-amber-800 mb-2 flex items-center gap-2">
              <AlertCircle size={16} /> Supabase is not connected yet
            </h2>
            <p className="text-[12.5px] text-slate-600 leading-relaxed mb-3">
              The site is running on its built-in default content. To enable the
              dashboard, create a Supabase project, run{" "}
              <code className="bg-slate-100 px-1 rounded">supabase/schema.sql</code> in
              its SQL editor, then add these to a{" "}
              <code className="bg-slate-100 px-1 rounded">.env</code> file in the
              project root and restart the dev server:
            </p>
            <pre className="text-[11px] bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
            </pre>
            <p className="text-[11px] text-slate-500 mt-3">
              Full instructions are in <code>DASHBOARD.md</code>.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="dash-card p-5 space-y-4">
            <label className="block">
              <span className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Email
              </span>
              <input
                type="email"
                className={inputCls}
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
            </label>

            <label className="block">
              <span className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">
                Password
              </span>
              <input
                type="password"
                className={inputCls}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && (
              <p className="text-[12.5px] text-[var(--dash-danger)] flex items-start gap-1.5">
                <AlertCircle size={14} className="shrink-0 mt-0.5" /> {error}
              </p>
            )}
            {notice && (
              <p className="text-[12.5px] text-[var(--dash-success)] flex items-start gap-1.5">
                <CheckCircle2 size={14} className="shrink-0 mt-0.5" /> {notice}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[var(--dash-brand)] text-white py-2.5 text-[13.5px] font-semibold hover:bg-[var(--dash-brand-2)] transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
              style={{ borderRadius: 10 }}
            >
              {busy && <Loader2 size={15} className="animate-spin" />}
              Sign in
            </button>

            <button
              type="button"
              onClick={() => void reset()}
              disabled={busy}
              className="w-full text-[12.5px] text-slate-500 hover:text-slate-800 transition"
            >
              Forgot password?
            </button>
          </form>
        )}

        <a
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-600 transition"
        >
          <ArrowLeft size={13} /> Back to website
        </a>
      </motion.div>
    </div>
  );
};

export default LoginPage;
