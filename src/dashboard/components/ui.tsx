import React, { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ImageIcon,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useMediaLibrary } from "../media";
import { isSupabaseConfigured } from "../../lib/supabase";

/* ------------------------------------------------------------------ layout */

export const Panel: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}> = ({ title, description, children, actions }) => (
  <section className="bg-white border border-slate-200 rounded-xl mb-5 overflow-hidden">
    <header className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-200 bg-slate-50/70">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">{description}</p>
        )}
      </div>
      {actions}
    </header>
    <div className="p-5 space-y-4">{children}</div>
  </section>
);

export const Grid: React.FC<{ cols?: 2 | 3; children: React.ReactNode }> = ({
  cols = 2,
  children,
}) => (
  <div
    className={`grid gap-4 ${cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2"}`}
  >
    {children}
  </div>
);

export const Field: React.FC<{
  label: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ label, hint, children }) => (
  <label className="block">
    <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-slate-400 mt-1">{hint}</span>}
  </label>
);

/* ------------------------------------------------------------------ inputs */

const inputCls =
  "w-full border border-slate-300 rounded-lg px-3 py-2 outline-none transition focus:border-[#cb9733] focus:ring-2 focus:ring-[#cb9733]/20";

export const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    className={inputCls}
    value={value ?? ""}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

export const TextArea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}> = ({ value, onChange, rows = 4, placeholder }) => (
  <textarea
    className={`${inputCls} resize-y leading-relaxed`}
    rows={rows}
    value={value ?? ""}
    placeholder={placeholder}
    onChange={(e) => onChange(e.target.value)}
  />
);

export const NumberInput: React.FC<{
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}> = ({ value, onChange, min = 0, step = 1 }) => (
  <input
    type="number"
    className={inputCls}
    value={Number.isFinite(value) ? value : 0}
    min={min}
    step={step}
    onChange={(e) => onChange(Number(e.target.value))}
  />
);

export const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => (
  <select
    className={`${inputCls} cursor-pointer`}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="inline-flex items-center gap-2.5 text-sm text-slate-700"
  >
    <span
      className={`relative w-10 h-6 rounded-full transition-colors ${
        checked ? "bg-[#cb9733]" : "bg-slate-300"
      }`}
      style={{ borderRadius: 9999 }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform"
        style={{ borderRadius: 9999, transform: checked ? "translateX(16px)" : "none" }}
      />
    </span>
    {label}
  </button>
);

/* ----------------------------------------------------------------- buttons */

type ButtonVariant = "primary" | "ghost" | "danger" | "subtle";

const variantCls: Record<ButtonVariant, string> = {
  primary: "bg-[#111d43] text-white hover:bg-[#1b2a5e] disabled:opacity-50",
  subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  ghost: "text-slate-600 hover:bg-slate-100 border border-slate-300",
  danger: "text-red-600 hover:bg-red-50 border border-red-200",
};

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit";
  title?: string;
}> = ({ children, onClick, variant = "subtle", disabled, type = "button", title }) => (
  <button
    type={type}
    title={title}
    disabled={disabled}
    onClick={onClick}
    className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed ${variantCls[variant]}`}
  >
    {children}
  </button>
);

/* ------------------------------------------------------------ media picker */

const MediaPicker: React.FC<{
  onPick: (url: string) => void;
  onClose: () => void;
}> = ({ onPick, onClose }) => {
  const { items, loading, error, upload, remove } = useMediaLibrary();
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setLocalError(null);
    try {
      const urls = await upload(files);
      if (urls[0]) onPick(urls[0]);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50">
      <div className="bg-white w-full max-w-3xl max-h-[80vh] rounded-xl flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900">Media library</h3>
          <div className="flex items-center gap-2">
            <Button onClick={() => fileRef.current?.click()} disabled={busy} variant="primary">
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              Upload
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />

        {(error || localError) && (
          <p className="px-5 py-2.5 text-xs text-red-600 bg-red-50 border-b border-red-100">
            {localError || error}
          </p>
        )}

        <div className="p-5 overflow-y-auto">
          {!isSupabaseConfigured && (
            <p className="text-sm text-slate-500">
              Connect Supabase to upload and store images.
            </p>
          )}
          {loading && <p className="text-sm text-slate-500">Loading…</p>}
          {!loading && isSupabaseConfigured && items.length === 0 && (
            <p className="text-sm text-slate-500">
              No images yet. Use Upload to add your first one.
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((m) => (
              <div key={m.name} className="group relative border border-slate-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => onPick(m.url)}
                  className="block w-full aspect-square bg-slate-50"
                >
                  <img src={m.url} alt={m.name} className="w-full h-full object-contain" />
                </button>
                <button
                  type="button"
                  title="Delete permanently"
                  onClick={() => void remove(m.name)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-white/90 text-red-600 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 size={13} />
                </button>
                <p className="px-2 py-1.5 text-[10px] text-slate-500 truncate">{m.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Image path field with a live preview and a media-library browser. */
export const ImageInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  label?: string;
  hint?: string;
}> = ({ value, onChange, label = "Image", hint }) => {
  const [picking, setPicking] = useState(false);

  return (
    <div>
      <span className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</span>
      <div className="flex gap-3">
        <div className="w-20 h-20 shrink-0 border border-slate-200 rounded-lg bg-slate-50 overflow-hidden flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt=""
              className="w-full h-full object-contain"
              onError={(e) => {
                e.currentTarget.style.opacity = "0.15";
              }}
            />
          ) : (
            <ImageIcon size={20} className="text-slate-300" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <TextInput value={value} onChange={onChange} placeholder="/assets/… or https://…" />
          <div className="flex gap-2">
            <Button onClick={() => setPicking(true)}>
              <ImageIcon size={14} /> Browse
            </Button>
            {value && (
              <Button variant="ghost" onClick={() => onChange("")}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>
      {hint && <p className="text-[11px] text-slate-400 mt-1">{hint}</p>}
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(url) => {
            onChange(url);
            setPicking(false);
          }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------ list editors */

/** Editor for a plain `string[]` — paragraphs, bullet lists, gallery URLs. */
export const StringListEditor: React.FC<{
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  multiline?: boolean;
  image?: boolean;
  addLabel?: string;
  placeholder?: string;
  hint?: string;
}> = ({
  label,
  value,
  onChange,
  multiline,
  image,
  addLabel = "Add item",
  placeholder,
  hint,
}) => {
  const list = value ?? [];
  const setAt = (i: number, v: string) =>
    onChange(list.map((item, idx) => (idx === i ? v : item)));
  const removeAt = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <Button onClick={() => onChange([...list, ""])}>
          <Plus size={14} /> {addLabel}
        </Button>
      </div>
      {hint && <p className="text-[11px] text-slate-400 mb-2">{hint}</p>}
      <div className="space-y-2">
        {list.length === 0 && (
          <p className="text-xs text-slate-400 italic py-2">Nothing here yet.</p>
        )}
        {list.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              {image ? (
                <ImageInput value={item} onChange={(v) => setAt(i, v)} label={`Image ${i + 1}`} />
              ) : multiline ? (
                <TextArea value={item} onChange={(v) => setAt(i, v)} placeholder={placeholder} />
              ) : (
                <TextInput value={item} onChange={(v) => setAt(i, v)} placeholder={placeholder} />
              )}
            </div>
            <div className="flex flex-col gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                title="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                title="Move down"
              >
                <ChevronDown size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="p-1.5 text-red-500 hover:bg-red-50"
                title="Remove"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Editor for a list of objects, each rendered by `renderItem`. */
export function ListEditor<T extends { id: string }>({
  label,
  items,
  onChange,
  renderItem,
  makeNew,
  titleFor,
  addLabel = "Add",
  collapsible = true,
}: {
  label: string;
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, patch: (p: Partial<T>) => void, index: number) => React.ReactNode;
  makeNew: () => T;
  titleFor: (item: T, index: number) => string;
  addLabel?: string;
  collapsible?: boolean;
}) {
  const list = items ?? [];
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const patchAt = (i: number, p: Partial<T>) =>
    onChange(list.map((item, idx) => (idx === i ? { ...item, ...p } : item)));
  const removeAt = (i: number) => onChange(list.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <Button
          variant="primary"
          onClick={() => {
            const item = makeNew();
            setOpen((o) => ({ ...o, [item.id]: true }));
            onChange([...list, item]);
          }}
        >
          <Plus size={14} /> {addLabel}
        </Button>
      </div>

      <div className="space-y-3">
        {list.length === 0 && (
          <p className="text-xs text-slate-400 italic py-2">Nothing here yet.</p>
        )}
        {list.map((item, i) => {
          const expanded = collapsible ? (open[item.id] ?? false) : true;
          return (
            <div key={item.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-slate-50 border-b border-slate-200">
                {collapsible && (
                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [item.id]: !expanded }))}
                    className="p-1 text-slate-400 hover:text-slate-700"
                    aria-label={expanded ? "Collapse" : "Expand"}
                  >
                    {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                )}
                <span className="flex-1 text-sm font-medium text-slate-800 truncate">
                  {titleFor(item, i)}
                </span>
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move up"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === list.length - 1}
                  className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                  title="Move down"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="p-1.5 text-red-500 hover:bg-red-100"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {expanded && (
                <div className="p-4 space-y-4">
                  {renderItem(item, (p) => patchAt(i, p), i)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- save bar */

export const SaveBar: React.FC<{
  dirty: boolean;
  saving: boolean;
  error: string | null;
  savedAt: number | null;
  onSave: () => void;
  onDiscard: () => void;
  onReset: () => void;
}> = ({ dirty, saving, error, savedAt, onSave, onDiscard, onReset }) => (
  <div className="sticky bottom-0 -mx-6 mt-6 px-6 py-3 bg-white/95 backdrop-blur border-t border-slate-200 flex items-center gap-3 flex-wrap">
    <Button variant="primary" onClick={onSave} disabled={!dirty || saving}>
      {saving ? <Loader2 size={15} className="animate-spin" /> : null}
      {saving ? "Saving…" : "Save changes"}
    </Button>
    <Button onClick={onDiscard} disabled={!dirty || saving}>
      Discard
    </Button>
    <Button variant="danger" onClick={onReset} disabled={saving}>
      Reset to default
    </Button>

    {error ? (
      <span className="text-xs text-red-600">{error}</span>
    ) : dirty ? (
      <span className="text-xs text-amber-600">Unsaved changes</span>
    ) : savedAt ? (
      <span className="text-xs text-emerald-600">Saved — live on the site</span>
    ) : (
      <span className="text-xs text-slate-400">No changes</span>
    )}
  </div>
);

export const Notice: React.FC<{
  tone?: "info" | "warn";
  children: React.ReactNode;
}> = ({ tone = "info", children }) => (
  <div
    className={`text-xs rounded-lg px-4 py-3 mb-5 border ${
      tone === "warn"
        ? "bg-amber-50 border-amber-200 text-amber-800"
        : "bg-sky-50 border-sky-200 text-sky-800"
    }`}
  >
    {children}
  </div>
);
