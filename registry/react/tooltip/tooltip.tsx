"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TooltipProps = {
  trigger?: React.ReactNode;
  content?: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  closeDelay?: number;
  className?: string;
};

type Side = NonNullable<TooltipProps["side"]>;

const pop = { type: "spring", stiffness: 400, damping: 31 } as const;
const leave = { duration: 0.13, ease: [0, 0, 0.58, 1] } as const;
const WARM_WINDOW = 300;

const openTips = new Set<symbol>();
let cooledAt = 0;

const sides: Record<Side, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function Tooltip({
  trigger = "Hover me",
  content = "Saved just now",
  side = "top",
  delay = 180,
  closeDelay = 80,
  className,
}: TooltipProps) {
  const [open, setOpen] = React.useState(false);
  const [instant, setInstant] = React.useState(false);
  const [id] = React.useState(() => Symbol("tooltip"));
  const reduce = useReducedMotion();
  const openTimer = React.useRef<number | undefined>(undefined);
  const closeTimer = React.useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    window.clearTimeout(openTimer.current);
    const warm = openTips.size > 0 || Date.now() - cooledAt < WARM_WINDOW;
    setInstant(warm);
    openTimer.current = window.setTimeout(() => {
      openTips.add(id);
      setOpen(true);
    }, warm ? 0 : delay);
  };

  const hide = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      openTips.delete(id);
      if (openTips.size === 0) cooledAt = Date.now();
      setOpen(false);
      setInstant(false);
    }, closeDelay);
  };

  React.useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
      openTips.delete(id);
    },
    [id],
  );

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={show}
      onPointerLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <button type="button" className="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            initial={
              reduce || instant
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.7, filter: "blur(6px)" }
            }
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0, transition: leave }
                : { opacity: 0, scale: 0.9, filter: "blur(4px)", transition: leave }
            }
            transition={reduce || instant ? { duration: instant ? 0 : 0.2 } : pop}
            className={cn(
              "pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md",
              sides[side],
              className,
            )}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
