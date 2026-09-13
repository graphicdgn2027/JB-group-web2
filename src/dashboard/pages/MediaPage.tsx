import React, { useRef, useState } from "react";
import { Copy, Loader2, Trash2, Upload } from "lucide-react";
import { useMediaLibrary } from "../media";
import { isSupabaseConfigured } from "../../lib/supabase";
import { Button, Notice, Panel } from "../components/ui";

function formatSize(bytes: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const MediaPage: React.FC = () => {
  const { items, loading, error, upload, remove } = useMediaLibrary();
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    setLocalError(null);
    try {
      await upload(files);
    } catch (e) {
      setLocalError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setLocalError("Could not copy to clipboard.");
    }
  };

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Media library</h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Images uploaded here get a permanent public URL you can use in any image
          field across the dashboard.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <Notice tone="warn">
          Supabase is not connected, so uploads are unavailable. Images referenced by
          path from the <code>Public/assets</code> folder still work.
        </Notice>
      )}

      <Panel
        title="Your images"
        actions={
          <Button
            variant="primary"
            onClick={() => fileRef.current?.click()}
            disabled={busy || !isSupabaseConfigured}
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            Upload images
          </Button>
        }
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />

        {(error || localError) && (
          <p className="text-xs text-red-600">{localError || error}</p>
        )}
        {loading && <p className="text-sm text-slate-500">Loading…</p>}
        {!loading && items.length === 0 && isSupabaseConfigured && (
          <p className="text-sm text-slate-500">
            Nothing uploaded yet. Images you add will appear here and in every
            "Browse" picker.
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((m) => (
            <div key={m.name} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="aspect-square bg-slate-50 flex items-center justify-center">
                <img src={m.url} alt={m.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-2.5 border-t border-slate-100">
                <p className="text-[11px] text-slate-600 truncate" title={m.name}>
                  {m.name}
                </p>
                <p className="text-[10px] text-slate-400 mb-2">{formatSize(m.size)}</p>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => void copy(m.url)}
                    className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700"
                    style={{ borderRadius: 6 }}
                  >
                    <Copy size={11} />
                    {copied === m.url ? "Copied" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => void remove(m.name)}
                    title="Delete permanently"
                    className="px-2 py-1.5 text-red-600 hover:bg-red-50"
                    style={{ borderRadius: 6 }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel
        title="Deleting images"
        description="Removal is permanent and is not undone by 'Reset to default'."
      >
        <p className="text-sm text-slate-600 leading-relaxed">
          If a page still references a deleted image, that image simply stops loading —
          nothing else breaks. Check where an image is used before removing it.
        </p>
      </Panel>
    </div>
  );
};

export default MediaPage;
