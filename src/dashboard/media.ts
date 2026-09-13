import { useCallback, useEffect, useState } from "react";
import { MEDIA_BUCKET, supabase } from "../lib/supabase";

export interface MediaItem {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
}

/** Public URL for an object in the media bucket. */
export function mediaUrl(path: string): string {
  if (!supabase) return path;
  return supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Filenames are namespaced with a timestamp so re-uploading never overwrites. */
function safeName(file: File): string {
  const cleaned = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  return `${Date.now()}-${cleaned}`;
}

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!supabase) {
      setItems([]);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase.storage
      .from(MEDIA_BUCKET)
      .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    setItems(
      (data ?? [])
        // Supabase returns a placeholder row for empty folders; skip it.
        .filter((f) => f.id !== null)
        .map((f) => ({
          name: f.name,
          url: mediaUrl(f.name),
          size: (f.metadata as { size?: number } | null)?.size ?? 0,
          updatedAt: f.updated_at ?? f.created_at ?? "",
        }))
    );
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const upload = useCallback(
    async (files: FileList | File[]): Promise<string[]> => {
      if (!supabase) throw new Error("Supabase is not configured.");
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        const path = safeName(file);
        const { error: err } = await supabase.storage
          .from(MEDIA_BUCKET)
          .upload(path, file, { cacheControl: "31536000", upsert: false });
        if (err) throw new Error(`${file.name}: ${err.message}`);
        uploaded.push(mediaUrl(path));
      }
      await refresh();
      return uploaded;
    },
    [refresh]
  );

  const remove = useCallback(
    async (name: string) => {
      if (!supabase) throw new Error("Supabase is not configured.");
      const { error: err } = await supabase.storage.from(MEDIA_BUCKET).remove([name]);
      if (err) throw new Error(err.message);
      await refresh();
    },
    [refresh]
  );

  return { items, loading, error, refresh, upload, remove };
}
