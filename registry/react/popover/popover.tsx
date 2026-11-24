"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type PopoverProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  side?: "top" | "bottom";
  className?: string;
};

const pop = { type: "spring", stiffness: 400, damping: 29 } as const;

export function Popover({
  trigger = "Share project",
  title = "Anyone with the link",
  description = "People with the link can view this project but cannot edit it.",
  children,
  side = "bottom",
  className,
}: PopoverProps) {
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);
  const titleId = React.useId();
  const descriptionId = React.useId();

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
      >
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            transition={reduce ? { duration: 0.15 } : pop}
            style={{ transformOrigin: side === "top" ? "bottom" : "top" }}
            className={cn(
              "absolute left-0 z-40 w-64 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl",
              side === "top" ? "bottom-full mb-2" : "top-full mt-2",
              className,
            )}
          >
            <p id={titleId} className="text-[13px] font-medium">
              {title}
            </p>
            <p id={descriptionId} className="mt-1 text-[13px] leading-5 text-muted-foreground">
              {description}
            </p>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
