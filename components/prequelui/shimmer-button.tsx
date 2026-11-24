"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { pressSpring, useReduceMotion, useTempoTransition } from "./motion";

export type ShimmerButtonProps = HTMLMotionProps<"button"> & {
  shimmerColor?: string;
  shimmerDuration?: number;
  shimmerDelay?: number;
  shimmer?: boolean;
  tapScale?: number;
};

const BASE =
  "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

export function ShimmerButton({
  shimmerColor = "color-mix(in oklab, var(--primary-foreground) 55%, transparent)",
  shimmerDuration = 900,
  shimmerDelay = 60,
  shimmer = true,
  tapScale = 0.97,
  className,
  children,
  onPointerEnter,
  onClick,
  ...props
}: ShimmerButtonProps) {
  const reduce = useReduceMotion();
  const spring = useTempoTransition(pressSpring);
  const [run, setRun] = React.useState(0);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current);
    };
  }, []);

  const play = React.useCallback(
    (delay = shimmerDelay) => {
      if (!shimmer || reduce) return;
      if (timer.current !== undefined) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        setRun((value) => value + 1);
      }, delay);
    },
    [reduce, shimmer, shimmerDelay],
  );

  const overlay =
    shimmer && run > 0 ? (
      <motion.span
        key={run}
        aria-hidden="true"
        data-slot="shimmer-button-beam"
        initial={{ x: "-180%", skewX: -14, opacity: 0 }}
        animate={{ x: "260%", skewX: -14, opacity: [0, 1, 1, 0] }}
        transition={{
          duration: shimmerDuration / 1000,
          ease: [0.33, 0, 0.2, 1],
          times: [0, 0.16, 0.72, 1],
        }}
        className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[52%]"
        style={{
          background: `linear-gradient(105deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
        }}
      />
    ) : null;

  return (
    <motion.button
      data-slot="shimmer-button"
      whileTap={reduce ? undefined : { scale: tapScale }}
      transition={spring}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (event.pointerType !== "touch") play();
      }}
      onClick={(event) => {
        onClick?.(event);
        play(0);
      }}
      className={cn(BASE, className)}
      {...props}
    >
      {overlay}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children as React.ReactNode}
      </span>
    </motion.button>
  );
}
