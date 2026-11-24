"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type HoverCardProps = {
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

const pop = { type: "spring", stiffness: 400, damping: 31 } as const;

export function HoverCard({
  trigger = "@prequelui",
  title = "PrequelUI Animate",
  description = "Animated primitives for interfaces that already have a design system.",
  children,
}: HoverCardProps) {
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();
  const enter = React.useRef<number | undefined>(undefined);
  const leave = React.useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(leave.current);
    enter.current = window.setTimeout(() => setOpen(true), 200);
  };
  const hide = () => {
    window.clearTimeout(enter.current);
    leave.current = window.setTimeout(() => setOpen(false), 150);
  };

  React.useEffect(
    () => () => {
      window.clearTimeout(enter.current);
      window.clearTimeout(leave.current);
    },
    [],
  );

  return (
    <span className="relative inline-block" onPointerEnter={show} onPointerLeave={hide} onFocus={show} onBlur={hide}>
      <button type="button" className="text-[13px] font-medium underline decoration-border underline-offset-4">
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 4, filter: "blur(2px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 2, filter: "blur(1px)" }}
            transition={reduce ? { duration: 0.2 } : pop}
            className="absolute left-0 top-full z-40 mt-2 w-64 rounded-xl border bg-background p-4 shadow-xl"
          >
            <p className="text-[13px] font-medium">{title}</p>
            <p className="mt-1 text-[13px] leading-6 text-muted-foreground">{description}</p>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
