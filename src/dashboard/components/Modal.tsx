import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

const WIDTHS = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-2xl" } as const;

/**
 * Centered dialog, or a right-hand drawer with `side="right"`.
 *
 * Portalled to <body> so a transformed ancestor can't trap its fixed
 * positioning; wrapped in `.dash` so dashboard styles still apply there.
 */
const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: keyof typeof WIDTHS;
  side?: "center" | "right";
  /** Blocks closing via backdrop / Escape while something is in flight. */
  locked?: boolean;
}> = ({ open, onClose, title, description, icon, children, footer, width = "md", side = "center", locked }) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !locked) onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, locked, onClose]);

  const drawer = side === "right";

  return createPortal(
    <div className="dash" style={{ background: "transparent" }}>
      <AnimatePresence>
        {open && (
          <motion.div
            key="modal"
            className={`fixed inset-0 z-[120] flex ${drawer ? "justify-end" : "items-center justify-center p-4"}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-[3px]"
              onClick={() => !locked && onClose()}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              className={`relative flex flex-col bg-white shadow-2xl ring-1 ring-slate-900/5 w-full ${
                drawer ? "h-full max-w-lg" : `${WIDTHS[width]} max-h-[90vh] rounded-2xl`
              }`}
              initial={drawer ? { x: 40, opacity: 0 } : { y: 12, scale: 0.98, opacity: 0 }}
              animate={drawer ? { x: 0, opacity: 1 } : { y: 0, scale: 1, opacity: 1 }}
              exit={drawer ? { x: 40, opacity: 0 } : { y: 8, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            >
              <header className="flex items-start gap-3 px-6 pt-5 pb-4 border-b border-slate-100">
                {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
                <div className="min-w-0 flex-1">
                  <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">{title}</h2>
                  {description && (
                    <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">{description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={locked}
                  aria-label="Close"
                  className="p-1.5 -mr-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-40"
                >
                  <X size={18} />
                </button>
              </header>
              <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
              {footer && (
                <footer className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl">
                  {footer}
                </footer>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
};

export default Modal;
