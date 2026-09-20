import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ExternalLink, Monitor, RotateCw, Smartphone, Tablet, X } from "lucide-react";
import { PREVIEW_WINDOW_NAME, withPreviewFlag } from "../../content/preview";

const DEVICES = {
  desktop: { width: 1280, icon: Monitor, label: "Desktop" },
  tablet: { width: 820, icon: Tablet, label: "Tablet" },
  mobile: { width: 390, icon: Smartphone, label: "Mobile" },
} as const;

type Device = keyof typeof DEVICES;

const DEVICE_PREF_KEY = "jbg-dashboard-preview-device";

function loadDevice(): Device {
  try {
    const v = window.localStorage.getItem(DEVICE_PREF_KEY);
    if (v && v in DEVICES) return v as Device;
  } catch {
    // ignore
  }
  return "desktop";
}

/**
 * The public site rendered in an iframe at a real device width, scaled down to
 * fit the pane. The iframe runs in preview mode, so it shows unpublished
 * drafts and follows them live.
 */
const PreviewPane: React.FC<{
  path: string;
  pages: { label: string; path: string }[];
  onPathChange: (path: string) => void;
  onClose: () => void;
  dirtyCount: number;
}> = ({ path, pages, onPathChange, onClose, dirtyCount }) => {
  const [device, setDevice] = useState<Device>(loadDevice);
  const [reloadKey, setReloadKey] = useState(0);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(DEVICE_PREF_KEY, device);
    } catch {
      // ignore
    }
  }, [device]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const deviceWidth = DEVICES[device].width;
  const gutter = 32;
  const scale = size.width ? Math.min(1, (size.width - gutter) / deviceWidth) : 1;
  const frameHeight = size.height ? (size.height - gutter) / scale : 800;
  const src = withPreviewFlag(path);

  // Keep the current path selectable even when it's a hash or unlisted page.
  const basePath = path.split("#")[0] || "/";
  const options = pages.some((p) => p.path === basePath)
    ? pages
    : [{ label: basePath, path: basePath }, ...pages];

  return (
    <div className="flex flex-col h-full bg-[#eef1f5]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-white border-b border-slate-200">
        <span className="hidden 2xl:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 pr-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${dirtyCount ? "bg-amber-500" : "bg-emerald-500"}`}
          />
          Preview
        </span>

        <div className="relative min-w-0 flex-1">
          <select
            value={basePath}
            onChange={(e) => onPathChange(e.target.value)}
            className="w-full appearance-none rounded-lg pl-3 pr-8 py-1.5 text-[12.5px] font-medium cursor-pointer"
            aria-label="Page to preview"
          >
            {options.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label} — {p.path}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>

        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg shrink-0">
          {(Object.keys(DEVICES) as Device[]).map((d) => {
            const Icon = DEVICES[d].icon;
            const active = d === device;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDevice(d)}
                title={`${DEVICES[d].label} (${DEVICES[d].width}px)`}
                aria-pressed={active}
                className={`p-1.5 ${
                  active ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <Icon size={15} />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          title="Reload preview"
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 shrink-0"
        >
          <RotateCw size={15} />
        </button>
        <a
          href={src}
          target={`${PREVIEW_WINDOW_NAME}-tab`}
          title="Open preview in a new tab"
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg shrink-0"
        >
          <ExternalLink size={15} />
        </a>
        <button
          type="button"
          onClick={onClose}
          title="Close preview"
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      {/* Stage */}
      <div ref={stageRef} className="relative flex-1 min-h-0 overflow-hidden">
        {size.width > 0 && (
          <div
            className="absolute left-1/2 top-4 -translate-x-1/2 bg-white overflow-hidden shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/10"
            style={{
              width: deviceWidth * scale,
              height: frameHeight * scale,
              borderRadius: device === "desktop" ? 10 : 22,
            }}
          >
            <iframe
              key={`${reloadKey}-${src}`}
              name={PREVIEW_WINDOW_NAME}
              src={src}
              title="Live preview"
              style={{
                width: deviceWidth,
                height: frameHeight,
                border: 0,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                display: "block",
              }}
            />
          </div>
        )}
      </div>

      <p className="px-3 py-2 text-[11px] text-slate-500 bg-white border-t border-slate-200">
        {dirtyCount
          ? `Showing ${dirtyCount} unpublished ${dirtyCount === 1 ? "section" : "sections"} — visitors won't see these until you publish.`
          : "Everything is published — this matches the live site."}
      </p>
    </div>
  );
};

export default PreviewPane;
