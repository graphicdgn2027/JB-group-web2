import React, { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { useAuth } from "./AuthProvider";
import "./dashboard.css";

const inputCls =
  "w-full border border-slate-300 rounded-lg px-3 py-2.5 text-sm outline-none transition focus:border-[#cb9733] focus:ring-2 focus:ring-[#cb9733]/20";

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
    <div className="dash min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 bg-[#111d43] flex items-center justify-center"
            style={{ borderRadius: 10 }}
          >
            <Lock size={18} className="text-[#cb9733]" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-slate-900">JB Group Dashboard</h1>
            <p className="text-xs text-slate-500">Sign in to manage site content</p>
          </div>
        </div>

        {!configured ? (
          <div className="bg-white border border-amber-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-amber-800 mb-2">
              Supabase is not connected yet
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              The site is running on its built-in default content. To enable the
              dashboard, create a Supabase project, run{" "}
              <code className="bg-slate-100 px-1 rounded">supabase/schema.sql</code> in
              its SQL editor, then add these to a <code className="bg-slate-100 px-1 rounded">.env</code> file
              in the project root and restart the dev server:
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
          <form
            onSubmit={submit}
            className="bg-white border border-slate-200 rounded-xl p-5 space-y-4"
          >
            <label className="block">
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">Email</span>
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
              <span className="block text-xs font-semibold text-slate-700 mb-1.5">Password</span>
              <input
                type="password"
                className={inputCls}
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>

            {error && <p className="text-xs text-red-600">{error}</p>}
            {notice && <p className="text-xs text-emerald-600">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full bg-[#111d43] text-white py-2.5 text-sm font-medium hover:bg-[#1b2a5e] transition disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ borderRadius: 8 }}
            >
              {busy && <Loader2 size={15} className="animate-spin" />}
              Sign in
            </button>

            <button
              type="button"
              onClick={reset}
              disabled={busy}
              className="w-full text-xs text-slate-500 hover:text-slate-800 transition"
            >
              Forgot password?
            </button>
          </form>
        )}

        <p className="text-center text-[11px] text-slate-400 mt-5">
          <a href="/" className="hover:text-slate-600">
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
