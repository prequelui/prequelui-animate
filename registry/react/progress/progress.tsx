"use client";

import * as React from "react";
import { animate, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ProgressProps = {
  value?: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
};

const settle = {
  type: "spring",
  stiffness: 300,
  damping: 35,
  restDelta: 0.01,
  restSpeed: 0.1,
} as const;

const count = { type: "spring", stiffness: 90, damping: 50 } as const;

export function Progress({
  value = 0,
  max = 100,
  label = "Uploading assets",
  showValue = true,
  className,
}: ProgressProps) {
  const reduce = useReducedMotion();
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(safeMax, Math.max(0, value));
  const percent = (clamped / safeMax) * 100;
  const [shown, setShown] = React.useState(reduce ? clamped : 0);

  React.useEffect(() => {
    if (reduce) {
      setShown(clamped);
      return;
    }
    const controls = animate(shown, clamped, {
      ...count,
      onUpdate: (latest) => setShown(latest),
    });
    return () => controls.stop();
  }, [clamped, reduce]);

  return (
    <div className={cn("w-full max-w-[380px]", className)}>
      <div className="mb-2 flex items-center justify-between text-[13px] text-muted-foreground">
        <span>{label}</span>
        {showValue && <span className="tabular-nums">{Math.round(shown)}%</span>}
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={clamped}
        className="h-2 w-full overflow-hidden rounded-full bg-accent"
      >
        <motion.div
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={reduce ? { duration: 0 } : settle}
          className="h-full rounded-full bg-foreground"
        />
      </div>
    </div>
  );
}
