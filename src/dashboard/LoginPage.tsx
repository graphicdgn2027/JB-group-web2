import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  MonitorSmartphone,
  PenLine,
  ShieldCheck,
  UploadCloud,
} from "lucide-react";
import whiteLogo from "@/assets/reliance_logo.png";
import { useAuth } from "./AuthProvider";
import "./dashboard.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Supabase's auth errors are terse; say what the person can do about them. */
function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "That email and password don't match. Check them and try again.";
  if (m.includes("email not confirmed"))
    return "This account hasn't been confirmed yet. Ask an administrator to confirm it in Supabase.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Wait a minute, then try again.";
  if (m.includes("failed to fetch") || m.includes("network"))
    return "Can't reach the server. Check your connection and try again.";
  return message;
}

const FEATURES = [
  { icon: PenLine, title: "Edit every page", text: "Leadership, businesses, hero slides and more." },
  { icon: MonitorSmartphone, title: "Preview live", text: "See drafts on desktop, tablet and mobile." },
  { icon: UploadCloud, title: "Publish in one click", text: "Push every change live together." },
];

const fieldWrap = "relative flex items-center";
const fieldIcon = "pointer-events-none absolute left-3.5 text-slate-400";
const fieldInput =
  "w-full h-12 rounded-xl pl-11 pr-4 text-[14.5px] outline-none placeholder:text-slate-400";

const BrandPanel: React.FC = () => (
  <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 xl:p-16 text-white bg-[#0b1224]">
    {/* Backdrop */}
    <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_0%_0%,rgba(203,151,51,0.22),transparent_60%),radial-gradient(70%_60%_at_100%_100%,rgba(59,91,180,0.28),transparent_60%)]" />
    <div
      className="absolute inset-0 opacity-[0.07]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at 30% 40%, black 20%, transparent 75%)",
      }}
    />
    <motion.div
      aria-hidden
      className="absolute -right-24 top-1/3 w-80 h-80 rounded-full bg-[#cb9733]/20 blur-3xl"
      animate={{ y: [0, -24, 0], opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
    />

    <motion.img
      src={whiteLogo}
      alt="JB Group"
      className="relative h-11 w-auto self-start"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    />

    <div className="relative max-w-lg">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#cb9733]"
      >
        Content dashboard
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.18 }}
        className="mt-4 text-[38px] xl:text-[44px] font-bold leading-[1.08] tracking-tight"
      >
        Your whole website,
        <br />
        <span className="bg-gradient-to-r from-[#f1cf85] to-[#cb9733] bg-clip-text text-transparent">
          managed in one place.
        </span>
      </motion.h2>

      <ul className="mt-10 space-y-5">
        {FEATURES.map((f, i) => (
          <motion.li
            key={f.title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.3 + i * 0.08 }}
            className="flex items-start gap-4"
          >
            <span className="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center bg-white/[0.06] ring-1 ring-inset ring-white/10">
              <f.icon size={18} className="text-[#e0b458]" />
            </span>
            <div>
              <p className="text-[15px] font-semibold">{f.title}</p>
              <p className="text-[13.5px] text-white/55 mt-0.5">{f.text}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>

    <p className="relative text-[12px] font-semibold uppercase tracking-[0.25em] text-white/35">
      Believing · Growing · Leading
    </p>
  </aside>
);

const Alert: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.2 }}
    className="overflow-hidden"
    role="alert"
  >
    <div className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[13px] leading-relaxed bg-[var(--dash-danger-soft)] text-[#b91c1c] ring-1 ring-inset ring-[var(--dash-danger-border)]">
      <AlertCircle size={16} className="shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  </motion.div>
);

const SubmitButton: React.FC<{ busy: boolean; disabled?: boolean; children: React.ReactNode; busyLabel: string }> = ({
  busy,
  disabled,
  children,
  busyLabel,
}) => (
  <button
    type="submit"
    disabled={busy || disabled}
    className="group w-full h-12 inline-flex items-center justify-center gap-2 rounded-xl text-[14.5px] font-semibold text-white bg-gradient-to-b from-[#1b2742] to-[#0f172a] shadow-[0_8px_20px_-8px_rgba(15,23,42,0.6),inset_0_1px_0_rgba(255,255,255,0.08)] hover:shadow-[0_12px_28px_-10px_rgba(15,23,42,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
  >
    {busy ? (
      <>
        <Loader2 size={17} className="animate-spin" /> {busyLabel}
      </>
    ) : (
      <>
        {children}
        <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
      </>
    )}
  </button>
);

const LoginPage: React.FC = () => {
  const { signIn, sendPasswordReset, configured } = useAuth();
  const [mode, setMode] = useState<"signin" | "reset" | "sent">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const emailValid = EMAIL_RE.test(email.trim());

  const switchMode = (next: typeof mode) => {
    setError(null);
    setMode(next);
  };

  const submitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) return setError("Enter a valid email address.");
    if (!password) return setError("Enter your password.");
    setBusy(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  };

  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailValid) return setError("Enter the email address you sign in with.");
    setBusy(true);
    setError(null);
    try {
      await sendPasswordReset(email.trim());
      setMode("sent");
    } catch (err) {
      setError(friendlyError(err instanceof Error ? err.message : String(err)));
    } finally {
      setBusy(false);
    }
  };

  const trackCaps = (e: React.KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(e.getModifierState?.("CapsLock") ?? false);

  const view = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
    transition: { duration: 0.22, ease: "easeOut" as const },
  };

  return (
    <div className="dash min-h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <BrandPanel />

      <main className="relative flex flex-col min-h-screen px-6 sm:px-10">
        {/* Top bar */}
        <div className="flex items-center justify-between h-20 shrink-0">
          <span className="lg:hidden inline-flex items-center rounded-xl bg-[#0f172a] px-3 py-2">
            <img src={whiteLogo} alt="JB Group" className="h-6 w-auto" />
          </span>
          <a
            href="/"
            className="ml-auto inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 rounded-lg px-2.5 py-1.5 hover:bg-slate-100 transition"
          >
            <ArrowLeft size={14} /> Back to website
          </a>
        </div>

        {/* Form */}
        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-[400px]">
            {!configured ? (
              <motion.div {...view}>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 ring-1 ring-amber-200 flex items-center justify-center mb-6">
                  <AlertCircle size={22} className="text-amber-600" />
                </div>
                <h1 className="text-[28px] font-bold tracking-tight text-slate-900">
                  Dashboard not connected
                </h1>
                <p className="mt-2 text-[14.5px] text-slate-500 leading-relaxed">
                  The site is running on its built-in content. Add your Supabase keys to a{" "}
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">.env</code> file and
                  restart the dev server to enable sign-in.
                </p>
                <pre className="mt-5 rounded-xl bg-slate-900 p-4 text-[12px] leading-relaxed text-slate-100 overflow-x-auto">
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...`}
                </pre>
                <p className="mt-4 text-[13px] text-slate-400">
                  Full setup steps are in <code>DASHBOARD.md</code>.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {mode === "signin" && (
                  <motion.div key="signin" {...view}>
                    <h1 className="text-[30px] font-bold tracking-tight text-slate-900">Welcome back</h1>
                    <p className="mt-2 text-[15px] text-slate-500">
                      Sign in to manage the JB Group website.
                    </p>

                    <form onSubmit={submitSignIn} noValidate className="mt-9 space-y-5">
                      <label className="block">
                        <span className="block text-[13px] font-semibold text-slate-700 mb-2">
                          Email address
                        </span>
                        <span className={fieldWrap}>
                          <Mail size={18} className={fieldIcon} />
                          <input
                            type="email"
                            className={fieldInput}
                            value={email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                          />
                        </span>
                      </label>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="dash-password" className="text-[13px] font-semibold text-slate-700">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => switchMode("reset")}
                            className="text-[13px] font-semibold text-[#a97a20] hover:text-[#7a5614] px-1 -mr-1"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <span className={fieldWrap}>
                          <Lock size={18} className={fieldIcon} />
                          <input
                            id="dash-password"
                            type={showPassword ? "text" : "password"}
                            className={`${fieldInput} pr-12`}
                            value={password}
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={trackCaps}
                            onKeyUp={trackCaps}
                            onBlur={() => setCapsLock(false)}
                            placeholder="Enter your password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((s) => !s)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            title={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-2 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                          >
                            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                          </button>
                        </span>
                        <AnimatePresence>
                          {capsLock && (
                            <motion.p
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="mt-2 flex items-center gap-1.5 text-[12.5px] font-medium text-amber-600"
                            >
                              <KeyRound size={13} /> Caps Lock is on
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>

                      <AnimatePresence>{error && <Alert>{error}</Alert>}</AnimatePresence>

                      <div className="pt-1">
                        <SubmitButton busy={busy} busyLabel="Signing in…">
                          Sign in
                        </SubmitButton>
                      </div>
                    </form>
                  </motion.div>
                )}

                {mode === "reset" && (
                  <motion.div key="reset" {...view}>
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-900 -ml-2 px-2 py-1 mb-6"
                    >
                      <ArrowLeft size={14} /> Back to sign in
                    </button>
                    <div className="w-12 h-12 rounded-2xl bg-[#cb9733]/10 ring-1 ring-[#cb9733]/20 flex items-center justify-center mb-6">
                      <KeyRound size={22} className="text-[#a97a20]" />
                    </div>
                    <h1 className="text-[30px] font-bold tracking-tight text-slate-900">Reset password</h1>
                    <p className="mt-2 text-[15px] text-slate-500 leading-relaxed">
                      Enter your email and we'll send you a link to get back in.
                    </p>

                    <form onSubmit={submitReset} noValidate className="mt-8 space-y-5">
                      <label className="block">
                        <span className="block text-[13px] font-semibold text-slate-700 mb-2">
                          Email address
                        </span>
                        <span className={fieldWrap}>
                          <Mail size={18} className={fieldIcon} />
                          <input
                            type="email"
                            className={fieldInput}
                            value={email}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                          />
                        </span>
                      </label>

                      <AnimatePresence>{error && <Alert>{error}</Alert>}</AnimatePresence>

                      <SubmitButton busy={busy} busyLabel="Sending…">
                        Send reset link
                      </SubmitButton>
                    </form>
                  </motion.div>
                )}

                {mode === "sent" && (
                  <motion.div key="sent" {...view} className="text-center">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.05 }}
                      className="mx-auto w-16 h-16 rounded-full bg-emerald-50 ring-8 ring-emerald-50/60 flex items-center justify-center mb-6"
                    >
                      <MailCheck size={28} className="text-emerald-600" />
                    </motion.div>
                    <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Check your inbox</h1>
                    <p className="mt-2 text-[15px] text-slate-500 leading-relaxed">
                      If an account exists for{" "}
                      <span className="font-semibold text-slate-700">{email.trim()}</span>, a reset link
                      is on its way.
                    </p>
                    <button
                      type="button"
                      onClick={() => switchMode("signin")}
                      className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-semibold text-slate-700 hover:text-slate-900 rounded-xl px-4 py-2.5 ring-1 ring-slate-200 hover:ring-slate-300 hover:bg-slate-50"
                    >
                      <ArrowLeft size={15} /> Back to sign in
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 shrink-0 flex items-center justify-between gap-4 text-[12px] text-slate-400 border-t border-slate-100">
          <span>© {new Date().getFullYear()} JB Group</span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-500" /> Authorised staff only
          </span>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
