import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  GripVertical,
  ImageIcon,
  Info,
  Loader2,
  Plus,
  RotateCcw,
  Trash2,
  Upload,
  UploadCloud,
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
  <section className="dash-card mb-8 overflow-hidden">
    <header className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-100 bg-white/50">
      <div className="min-w-0">
        <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">{title}</h3>
        {description && (
          <p className="text-[13px] text-slate-500 mt-1.5 max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
    <div className="p-6 space-y-5">{children}</div>
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
    <span className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">{label}</span>
    {children}
    {hint && <span className="block text-[11px] text-[var(--dash-muted-2)] mt-1.5 leading-relaxed">{hint}</span>}
  </label>
);

/* ------------------------------------------------------------------ inputs */

const inputCls =
  "w-full border border-[var(--dash-border-strong)] rounded-[10px] px-3.5 py-2.5 outline-none bg-white text-[13.5px] transition-all focus:border-[#cb9733] focus:ring-4 focus:ring-[var(--dash-gold-ring)] hover:border-slate-400";

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
  <div className="relative">
    <select
      className={`${inputCls} appearance-none pr-9 cursor-pointer`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
    <ChevronDown
      size={15}
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
    />
  </div>
);

export const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}> = ({ checked, onChange, label }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="inline-flex items-center gap-2.5 text-[13px] font-medium text-slate-700 group"
  >
    <span
      className="relative w-10 h-[22px] rounded-full transition-colors duration-200 shrink-0"
      style={{
        borderRadius: 9999,
        background: checked ? "var(--dash-gold)" : "#cbd1db",
      }}
    >
      <span
        className="absolute top-[2px] left-[2px] w-[18px] h-[18px] bg-white shadow transition-transform duration-200"
        style={{ borderRadius: 9999, transform: checked ? "translateX(18px)" : "none" }}
      />
    </span>
    <span className="group-hover:text-slate-900 transition-colors">{label}</span>
  </button>
);

/* ----------------------------------------------------------------- buttons */

type ButtonVariant = "primary" | "ghost" | "danger" | "subtle";

const variantCls: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--dash-brand)] text-white shadow-sm hover:bg-[var(--dash-brand-2)] hover:shadow disabled:opacity-45 disabled:shadow-none",
  subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-45",
  ghost:
    "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-[var(--dash-border-strong)] disabled:opacity-45",
  danger:
    "text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)] border border-[var(--dash-danger-border)] disabled:opacity-45",
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
    className={`inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-semibold transition disabled:cursor-not-allowed whitespace-nowrap ${variantCls[variant]}`}
  >
    {children}
  </button>
);

/** Small square icon-only button used inside list rows. */
const IconButton: React.FC<{
  onClick?: () => void;
  disabled?: boolean;
  title: string;
  tone?: "default" | "danger";
  children: React.ReactNode;
}> = ({ onClick, disabled, title, tone = "default", children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={title}
    className={`p-1.5 transition disabled:opacity-25 disabled:cursor-not-allowed ${
      tone === "danger"
        ? "text-slate-400 hover:text-[var(--dash-danger)] hover:bg-[var(--dash-danger-soft)]"
        : "text-slate-400 hover:text-slate-800 hover:bg-slate-100"
    }`}
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
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setLocalError(null);
    try {
      const urls = await upload(files);
      if (urls[0]) onPick(urls[0]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLocalError(msg);
      toast.error("Upload failed", { description: msg });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-[2px] dash-fade-up">
      <div className="bg-white w-full max-w-3xl max-h-[82vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-[var(--dash-panel-alt)]">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Media library</h3>
            <p className="text-[11px] text-[var(--dash-muted)] mt-0.5">
              Pick an existing image or upload a new one.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => fileRef.current?.click()} disabled={busy} variant="primary">
              {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
              Upload
            </Button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
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
          <p className="px-5 py-2.5 text-xs text-[var(--dash-danger)] bg-[var(--dash-danger-soft)] border-b border-[var(--dash-danger-border)]">
            {localError || error}
          </p>
        )}

        <div
          className="p-5 overflow-y-auto flex-1"
          onDragOver={(e) => {
            e.preventDefault();
            if (isSupabaseConfigured) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            void handleFiles(e.dataTransfer.files);
          }}
        >
          {!isSupabaseConfigured && (
            <p className="text-sm text-slate-500">
              Connect Supabase to upload and store images.
            </p>
          )}

          {isSupabaseConfigured && (
            <div
              onClick={() => fileRef.current?.click()}
              className={`mb-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 py-6 cursor-pointer transition-colors ${
                dragOver
                  ? "border-[#cb9733] bg-[var(--dash-gold-soft)]"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/60"
              }`}
            >
              <UploadCloud size={22} className={dragOver ? "text-[#cb9733]" : "text-slate-400"} />
              <p className="text-xs font-medium text-slate-600">
                Drag images here, or click to browse
              </p>
            </div>
          )}

          {loading && <p className="text-sm text-slate-500">Loading…</p>}
          {!loading && isSupabaseConfigured && items.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-6">
              No images uploaded yet.
            </p>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {items.map((m) => (
              <div
                key={m.name}
                className="group relative border border-slate-200 rounded-xl overflow-hidden hover:border-[#cb9733]/50 hover:shadow-md transition-all"
              >
                <button
                  type="button"
                  onClick={() => onPick(m.url)}
                  className="block w-full aspect-square bg-slate-50 relative"
                >
                  <img src={m.url} alt={m.name} className="w-full h-full object-contain" />
                  <span className="absolute inset-0 bg-[var(--dash-brand)]/0 group-hover:bg-[var(--dash-brand)]/5 transition-colors" />
                </button>
                <button
                  type="button"
                  title="Delete permanently"
                  onClick={() => void remove(m.name)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-white/95 text-[var(--dash-danger)] opacity-0 group-hover:opacity-100 transition rounded-lg shadow-sm"
                >
                  <Trash2 size={13} />
                </button>
                <p className="px-2 py-1.5 text-[10px] text-slate-500 truncate border-t border-slate-100">
                  {m.name}
                </p>
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
      <span className="block text-[12.5px] font-semibold text-slate-700 mb-1.5">{label}</span>
      <div className="flex gap-3">
        <div className="w-20 h-20 shrink-0 border border-slate-200 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center">
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
      {hint && <p className="text-[11px] text-[var(--dash-muted-2)] mt-1.5 leading-relaxed">{hint}</p>}
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
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[12.5px] font-semibold text-slate-700">{label}</span>
        <Button onClick={() => onChange([...list, ""])}>
          <Plus size={14} /> {addLabel}
        </Button>
      </div>
      {hint && <p className="text-[11px] text-[var(--dash-muted-2)] mb-2.5">{hint}</p>}
      <div className="space-y-2">
        {list.length === 0 && <EmptyRow />}
        {list.map((item, i) => (
          <div
            key={i}
            className="flex gap-2 items-start bg-[var(--dash-panel-alt)] border border-slate-100 rounded-xl p-2.5"
          >
            <div className="pt-2 pl-0.5 text-slate-300">
              <GripVertical size={14} />
            </div>
            <div className="flex-1">
              {image ? (
                <ImageInput value={item} onChange={(v) => setAt(i, v)} label={`Image ${i + 1}`} />
              ) : multiline ? (
                <TextArea value={item} onChange={(v) => setAt(i, v)} placeholder={placeholder} />
              ) : (
                <TextInput value={item} onChange={(v) => setAt(i, v)} placeholder={placeholder} />
              )}
            </div>
            <div className="flex flex-col pt-0.5">
              <IconButton title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                <ChevronDown size={14} className="rotate-180" />
              </IconButton>
              <IconButton title="Move down" onClick={() => move(i, 1)} disabled={i === list.length - 1}>
                <ChevronDown size={14} />
              </IconButton>
              <IconButton title="Remove" tone="danger" onClick={() => removeAt(i)}>
                <Trash2 size={14} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EmptyRow: React.FC<{ label?: string }> = ({ label = "Nothing here yet." }) => (
  <div className="border border-dashed border-slate-250 rounded-xl py-6 text-center bg-slate-50/50">
    <p className="text-xs text-slate-400 italic">{label}</p>
  </div>
);

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
        <div className="flex items-center gap-2">
          <span className="text-[12.5px] font-semibold text-slate-700">{label}</span>
          {list.length > 0 && (
            <span className="text-[10.5px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
              {list.length}
            </span>
          )}
        </div>
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

      <div className="space-y-2.5">
        {list.length === 0 && <EmptyRow />}
        {list.map((item, i) => {
          const expanded = collapsible ? (open[item.id] ?? false) : true;
          return (
            <div
              key={item.id}
              className="border border-slate-200 rounded-xl overflow-hidden bg-white transition-shadow hover:shadow-sm"
            >
              <div className="flex items-center gap-1 pl-2 pr-2 py-2 bg-[var(--dash-panel-alt)] border-b border-slate-200">
                <span className="text-slate-300 pr-0.5">
                  <GripVertical size={14} />
                </span>
                <span className="w-5 h-5 shrink-0 rounded-full bg-[var(--dash-brand)]/8 text-[var(--dash-brand)] text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {collapsible ? (
                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [item.id]: !expanded }))}
                    className="flex-1 min-w-0 flex items-center gap-1.5 px-1.5 py-0.5 text-left"
                  >
                    <span className="flex-1 text-[13px] font-medium text-slate-800 truncate">
                      {titleFor(item, i)}
                    </span>
                    <motion.span
                      animate={{ rotate: expanded ? 180 : 0 }}
                      transition={{ duration: 0.15 }}
                      className="text-slate-400 shrink-0"
                    >
                      <ChevronDown size={15} />
                    </motion.span>
                  </button>
                ) : (
                  <span className="flex-1 min-w-0 text-[13px] font-medium text-slate-800 truncate px-1.5">
                    {titleFor(item, i)}
                  </span>
                )}
                <span className="flex items-center shrink-0">
                  <IconButton title="Move up" onClick={() => move(i, -1)} disabled={i === 0}>
                    <ChevronDown size={14} className="rotate-180" />
                  </IconButton>
                  <IconButton title="Move down" onClick={() => move(i, 1)} disabled={i === list.length - 1}>
                    <ChevronDown size={14} />
                  </IconButton>
                  <IconButton title="Remove" tone="danger" onClick={() => removeAt(i)}>
                    <Trash2 size={14} />
                  </IconButton>
                </span>
              </div>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="p-4 space-y-4">
                      {renderItem(item, (p) => patchAt(i, p), i)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
}> = ({ dirty, saving, error, savedAt, onSave, onDiscard, onReset }) => {
  const lastSavedAt = useRef<number | null>(null);
  const lastError = useRef<string | null>(null);

  // A toast is a clearer confirmation than static text alone, without
  // replacing the persistent status the bar already shows.
  useEffect(() => {
    if (savedAt && savedAt !== lastSavedAt.current) {
      lastSavedAt.current = savedAt;
      toast.success("Changes saved", { description: "Your edit is now live on the site." });
    }
  }, [savedAt]);

  useEffect(() => {
    if (error && error !== lastError.current) {
      lastError.current = error;
      toast.error("Couldn't save", { description: error });
    }
    if (!error) lastError.current = null;
  }, [error]);

  return (
    <div className="sticky bottom-6 z-30 mt-8">
      <div className="mx-auto max-w-fit bg-white/80 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-[var(--dash-shadow-lg)] px-4 py-3 flex items-center gap-3 flex-wrap ring-1 ring-black/5">
        <Button variant="primary" onClick={onSave} disabled={!dirty || saving}>
          {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          {saving ? "Saving…" : "Save changes"}
        </Button>
        <Button onClick={onDiscard} disabled={!dirty || saving}>
          Discard
        </Button>
        <Button variant="danger" onClick={onReset} disabled={saving}>
          <RotateCcw size={14} /> Reset to default
        </Button>

        <span className="w-px self-stretch bg-slate-200/60 mx-2" />

        <StatusPill dirty={dirty} saving={saving} error={error} savedAt={savedAt} />
      </div>
    </div>
  );
};

const StatusPill: React.FC<{
  dirty: boolean;
  saving: boolean;
  error: string | null;
  savedAt: number | null;
}> = ({ dirty, saving, error, savedAt }) => {
  if (saving) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-500 pr-1">
        <Loader2 size={13} className="animate-spin" /> Saving…
      </span>
    );
  }
  if (error) {
    return (
      <span
        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--dash-danger)] pr-1 max-w-[220px] truncate"
        title={error}
      >
        <AlertCircle size={13} /> {error}
      </span>
    );
  }
  if (dirty) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--dash-warn)] pr-1">
        <span className="relative w-1.5 h-1.5 rounded-full bg-[var(--dash-warn)] dash-pulse" />
        Unsaved changes
      </span>
    );
  }
  if (savedAt) {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[var(--dash-success)] pr-1">
        <CheckCircle2 size={13} /> Saved — live on the site
      </span>
    );
  }
  return <span className="text-[12px] text-slate-400 pr-1">No changes</span>;
};

/* ---------------------------------------------------------------- notices */

const noticeStyles = {
  info: {
    bg: "var(--dash-info-soft)",
    border: "var(--dash-info-border)",
    text: "#075985",
    Icon: Info,
  },
  warn: {
    bg: "var(--dash-warn-soft)",
    border: "var(--dash-warn-border)",
    text: "#92400e",
    Icon: AlertCircle,
  },
} as const;

export const Notice: React.FC<{
  tone?: "info" | "warn";
  children: React.ReactNode;
}> = ({ tone = "info", children }) => {
  const s = noticeStyles[tone];
  return (
    <div
      className="text-[12.5px] leading-relaxed rounded-xl px-4 py-3 mb-5 border flex items-start gap-2.5"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}
    >
      <s.Icon size={16} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
};
