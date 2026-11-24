"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DialogProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const popupSpring = { type: "spring", stiffness: 150, damping: 25 } as const;
const veil = { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } as const;

export function Dialog({
  trigger = "Open dialog",
  title = "Edit profile",
  description = "Make changes to your profile here.",
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: DialogProps) {
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
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-[13px] font-medium text-background"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {value && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.button
              type="button"
              aria-label="Close dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={veil}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8, filter: "blur(4px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 4, filter: "blur(2px)" }}
              transition={reduce ? { duration: 0.2 } : popupSpring}
              className={cn("relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl", className)}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
              <h2 id={titleId} className="text-[15px] font-medium">{title}</h2>
              <p id={descriptionId} className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{description}</p>
              {children}
              <div className="mt-5 flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="h-8 rounded-md border px-3 text-[13px]">
                  Cancel
                </button>
                <button type="button" onClick={() => setOpen(false)} className="h-8 rounded-md bg-foreground px-3 text-[13px] font-medium text-background">
                  Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
