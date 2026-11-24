"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "./motion";

export type MotionGridProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  count?: number;
  columns?: number;
  dotSize?: number;
  gap?: number;
  speed?: number;
  stagger?: number;
  pauseOnHover?: boolean;
  dotClassName?: string;
};

export function MotionGrid({
  count = 35,
  columns = 7,
  dotSize = 8,
  gap = 10,
  speed = 1.4,
  stagger = 0.07,
  pauseOnHover = true,
  dotClassName,
  className,
  onPointerEnter,
  onPointerLeave,
  style,
  ...props
}: MotionGridProps) {
  const reduce = useReduceMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "120px 0px" });
  const [paused, setPaused] = React.useState(false);
  const total = Math.max(1, Math.round(count));
  const cols = Math.max(1, Math.round(columns));

  return (
    <div
      ref={ref}
      data-slot="motion-grid"
      aria-hidden="true"
      className={cn("grid w-fit", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gap,
        ...style,
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (pauseOnHover) setPaused(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (pauseOnHover) setPaused(false);
      }}
      {...props}
    >
      {Array.from({ length: total }, (_, index) => {
        const row = Math.floor(index / cols);
        const column = index % cols;
        const delay = (row + column) * stagger;
        const resting = reduce || paused || !inView;
        return (
          <motion.span
            key={index}
            className={cn("rounded-full bg-foreground", dotClassName)}
            style={{ width: dotSize, height: dotSize }}
            animate={
              resting
                ? { scale: 1, opacity: paused ? 0.35 : 0.55 }
                : {
                    scale: [0.65, 1, 0.65],
                    opacity: [0.3, 1, 0.3],
                  }
            }
            transition={
              resting
                ? { duration: reduce ? 0 : 0.2 }
                : {
                    duration: speed,
                    repeat: Infinity,
                    delay,
                    ease: "easeInOut",
                  }
            }
          />
        );
      })}
    </div>
  );
}
