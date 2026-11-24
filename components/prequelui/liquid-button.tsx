"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  pressSpring,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

export type LiquidButtonProps = HTMLMotionProps<"button"> & {
  delay?: string;
  fillHeight?: string;
  hoverScale?: number;
  tapScale?: number;
  transition?: Transition;
};

export function LiquidButton({
  delay = "0.3s",
  fillHeight = "3px",
  hoverScale = 1,
  tapScale = 0.97,
  transition,
  className,
  children,
  ...props
}: LiquidButtonProps) {
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? pressSpring);
  const [hovered, setHovered] = React.useState(false);
  const seconds = Number.parseFloat(delay) || 0.3;

  return (
    <motion.button
      data-slot="liquid-button"
      initial={reduce ? undefined : { scale: 1 }}
      whileTap={reduce ? undefined : { scale: tapScale }}
      whileHover={reduce || hoverScale === 1 ? undefined : { scale: hoverScale }}
      transition={spring}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={cn(
        "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-background px-4 text-[13px] font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{
          scaleY: hovered && !reduce ? 1 : 0.06,
          opacity: hovered && !reduce ? 1 : 0.55,
        }}
        transition={{
          duration: reduce ? 0 : seconds,
          ease: [0.25, 0.1, 0.35, 1],
        }}
        style={{ height: hovered ? "100%" : fillHeight }}
        className="pointer-events-none absolute inset-x-0 bottom-0 origin-bottom bg-primary"
      />
      <span
        className={cn(
          "relative z-10 transition-colors",
          hovered && !reduce ? "text-primary-foreground" : "text-foreground",
        )}
        style={{ transitionDuration: `${seconds}s` }}
      >
        {children as React.ReactNode}
      </span>
    </motion.button>
  );
}
