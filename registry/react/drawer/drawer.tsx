"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DrawerProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const enter = { duration: 0.4, ease: [0.34, 1.2, 0.64, 1] } as const;
const leave = { duration: 0.16, ease: [0.4, 0, 1, 1] } as const;

export function Drawer({
  trigger = "Open drawer",
  title = "Notifications",
  description = "Updates from the projects you follow.",
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
}: DrawerProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const value = open ?? internal;
  const reduce = useReducedMotion();

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
          <div className="fixed inset-0 z-50">
            <motion.button type="button" aria-label="Close drawer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }} onClick={() => setOpen(false)} className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            <motion.div
              role="dialog"
              aria-modal="true"
              initial={reduce ? { opacity: 0 } : { x: "100%" }}
              animate={reduce ? { opacity: 1 } : { x: 0 }}
              exit={reduce ? { opacity: 0 } : { x: "100%", transition: leave }}
              transition={reduce ? { duration: 0.2 } : enter}
              className={cn("absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l bg-background p-5 shadow-2xl", className)}
            >
              <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent">
                <X className="size-4" />
              </button>
              <p className="text-[15px] font-medium">{title}</p>
              <p className="mt-1.5 text-[13px] leading-6 text-muted-foreground">{description}</p>
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
