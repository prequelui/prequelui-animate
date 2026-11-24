"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type AlertDialogProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  confirmLabel?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConfirm?: () => void;
};

const popupSpring = { type: "spring", stiffness: 150, damping: 25 } as const;
const veil = { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } as const;

export function AlertDialog({
  trigger = "Delete project",
  title = "Delete project?",
  description = "This action cannot be undone. The project and its data will be removed.",
  confirmLabel = "Delete",
  open,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
}: AlertDialogProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const value = open ?? internal;
  const reduce = useReducedMotion();
  const titleId = React.useId();
  const descriptionId = React.useId();

  const setOpen = (next: boolean) => {
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };

  React.useEffect(() => {
    if (!value) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">
        {trigger}
      </button>
      <AnimatePresence>
        {value && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.button type="button" aria-label="Close dialog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={veil} onClick={() => setOpen(false)} className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 4, filter: "blur(2px)" }}
              transition={reduce ? { duration: 0.2 } : popupSpring}
              className="relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl"
            >
              <h2 id={titleId} className="text-[15px] font-medium">{title}</h2>
              <p id={descriptionId} className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{description}</p>
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="h-8 rounded-md border px-3 text-[13px]">Cancel</button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm?.();
                    setOpen(false);
                  }}
                  className="h-8 rounded-md bg-destructive px-3 text-[13px] font-medium text-destructive-foreground"
                >
                  {confirmLabel}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
