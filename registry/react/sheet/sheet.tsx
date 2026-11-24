"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type SheetProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  side?: "left" | "right";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const enter = { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } as const;
const leave = { duration: 0.2, ease: [0.33, 0.17, 0.67, 0.5] } as const;
const veil = { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] } as const;

export function Sheet({
  trigger = "Open sheet",
  title = "Workspace",
  description = "Choose where this project lives.",
  side = "right",
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: SheetProps) {
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
        className="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {value && (
          <div className="fixed inset-0 z-50">
            <motion.button
              type="button"
              aria-label="Close sheet"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={veil}
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[3px]"
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              initial={reduce ? { opacity: 0 } : { x: side === "right" ? "100%" : "-100%" }}
              animate={reduce ? { opacity: 1 } : { x: "0%" }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { x: side === "right" ? "100%" : "-100%", transition: leave }
              }
              transition={reduce ? { duration: 0.2 } : enter}
              className={cn(
                "absolute top-0 flex h-full w-[85%] max-w-sm flex-col border bg-popover p-5 shadow-2xl",
                side === "right" ? "right-0 border-l" : "left-0 border-r",
                className,
              )}
            >
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent"
              >
                <X className="size-4" />
              </button>
              <h2 id={titleId} className="pr-8 text-[15px] font-medium">
                {title}
              </h2>
              <p id={descriptionId} className="mt-1.5 text-[13px] leading-6 text-muted-foreground">
                {description}
              </p>
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
