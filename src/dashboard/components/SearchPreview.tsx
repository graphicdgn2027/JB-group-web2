import React from "react";

const TITLE_MAX = 60;
const DESC_MAX = 160;

const clip = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max - 1).replace(/\s+\S*$/, "")} …` : text;

/** Approximates how a page appears in Google results. */
export const SearchPreview: React.FC<{
  siteName: string;
  siteUrl: string;
  path: string;
  title: string;
  description: string;
}> = ({ siteName, siteUrl, path, title, description }) => {
  let host = siteUrl;
  try {
    host = new URL(siteUrl).host;
  } catch {
    // Keep whatever was typed; the field is free text.
  }
  const crumbs = path.split("/").filter(Boolean);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 font-[arial,sans-serif]">
      <div className="flex items-center gap-2.5">
        <span className="w-7 h-7 rounded-full bg-slate-100 ring-1 ring-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600">
          {siteName.slice(0, 1).toUpperCase() || "J"}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-[13px] text-[#202124] truncate">{siteName}</p>
          <p className="text-[11.5px] text-[#4d5156] truncate">
            {`https://${host}`}
            {crumbs.map((c) => ` › ${c}`).join("")}
          </p>
        </div>
      </div>
      <p className="mt-2 text-[18px] leading-snug text-[#1a0dab] break-words">{clip(title, TITLE_MAX)}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-[#4d5156] break-words">
        {description ? clip(description, DESC_MAX) : <em className="text-slate-400">No description yet.</em>}
      </p>
    </div>
  );
};

/** A small count against the recommended length for search results. */
export const LengthHint: React.FC<{ value: string; ideal: [number, number]; note?: string }> = ({
  value,
  ideal,
  note,
}) => {
  const n = value.length;
  const [min, max] = ideal;
  const tone = n === 0 ? "text-slate-400" : n > max ? "text-amber-600" : n < min ? "text-slate-500" : "text-emerald-600";
  return (
    <span className="flex items-center justify-between gap-3">
      <span>{note}</span>
      <span className={`shrink-0 tabular-nums font-semibold ${tone}`}>
        {n} / {max}
      </span>
    </span>
  );
};
