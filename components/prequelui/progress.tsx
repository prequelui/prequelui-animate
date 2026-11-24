"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { progressSpring, useReduceMotion, useTempoTransition } from "./motion";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number;
  max?: number;
  indicatorClassName?: string;
  transition?: Transition;
};

export function Progress({
  value = 0,
  max = 100,
  className,
  indicatorClassName,
  transition,
  ...props
}: ProgressProps) {
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? progressSpring);
  const safeMax = max > 0 ? max : 100;
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={value}
      data-slot="progress"
      className={cn("h-2 w-full overflow-hidden rounded-full bg-accent", className)}
      {...props}
    >
      <motion.div
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={reduce ? { duration: 0 } : spring}
        className={cn("h-full rounded-full bg-foreground", indicatorClassName)}
      />
    </div>
  );
}
