import React, { useState } from "react";
import { Eye, EyeOff, Lock, Sparkles } from "lucide-react";
import { initials, passwordStrength, generatePassword } from "../format";
import { roleStyle } from "../permissions";

export const Avatar: React.FC<{
  name: string;
  email: string;
  role: string;
  size?: number;
  muted?: boolean;
}> = ({ name, email, role, size = 36, muted }) => (
  <span
    className={`shrink-0 inline-flex items-center justify-center font-bold bg-gradient-to-br shadow-sm ${
      roleStyle(role).avatar
    } ${muted ? "opacity-40 grayscale" : ""}`}
    style={{ width: size, height: size, borderRadius: size * 0.3, fontSize: size * 0.36 }}
  >
    {initials(name, email)}
  </span>
);

export const RoleBadge: React.FC<{ role: string; label: string }> = ({ role, label }) => {
  const s = roleStyle(role);
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold ring-1 ring-inset ${s.badge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {label}
    </span>
  );
};

export const StatusBadge: React.FC<{ active: boolean }> = ({ active }) =>
  active ? (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-emerald-700">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> Disabled
    </span>
  );

const STRENGTH_COLORS = ["bg-slate-200", "bg-rose-500", "bg-amber-500", "bg-sky-500", "bg-emerald-500"];

/** Password input with show/hide, generator and strength meter. */
export const PasswordField: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  allowGenerate?: boolean;
}> = ({ value, onChange, placeholder = "At least 8 characters", autoComplete = "new-password", allowGenerate = true }) => {
  const [show, setShow] = useState(false);
  const { score, label } = passwordStrength(value);

  return (
    <div>
      <div className="relative flex items-center">
        <Lock size={16} className="pointer-events-none absolute left-3.5 text-slate-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full h-11 rounded-xl pl-10 ${allowGenerate ? "pr-24" : "pr-11"} outline-none font-mono tracking-wide`}
        />
        <div className="absolute right-1.5 flex items-center gap-0.5">
          {allowGenerate && (
            <button
              type="button"
              onClick={() => {
                onChange(generatePassword());
                setShow(true);
              }}
              title="Generate a strong password"
              className="inline-flex items-center gap-1 px-2 py-1.5 text-[11.5px] font-semibold text-[#a97a20] hover:bg-amber-50"
            >
              <Sparkles size={13} /> Generate
            </button>
          )}
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>
      {value && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 grid grid-cols-4 gap-1">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-colors ${i <= score ? STRENGTH_COLORS[score] : "bg-slate-200"}`}
              />
            ))}
          </div>
          <span className="text-[11.5px] font-semibold text-slate-500 w-16 text-right">{label}</span>
        </div>
      )}
    </div>
  );
};

/** Consistent label + hint wrapper for modal forms. */
export const FormRow: React.FC<{
  label: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
  htmlFor?: string;
}> = ({ label, hint, children, htmlFor }) => (
  <div>
    <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-slate-700 mb-1.5">
      {label}
    </label>
    {children}
    {hint && <p className="text-[12px] text-slate-400 mt-1.5 leading-relaxed">{hint}</p>}
  </div>
);

export const textInputCls = "w-full h-11 rounded-xl px-3.5 outline-none";
