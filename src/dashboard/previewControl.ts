import { createContext, useContext } from "react";

export interface PreviewControl {
  isOpen: boolean;
  /** Opens the live preview, optionally at a specific public page. */
  open: (path?: string) => void;
  close: () => void;
}

export const PreviewControlContext = createContext<PreviewControl | null>(null);

export function usePreviewControl(): PreviewControl {
  const ctx = useContext(PreviewControlContext);
  if (!ctx) throw new Error("usePreviewControl must be used inside the dashboard layout");
  return ctx;
}
