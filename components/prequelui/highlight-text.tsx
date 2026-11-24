"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  useReduceMotion,
  useSeen,
  useTempoTransition,
} from "./motion";

export type HighlightTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string;
  delay?: number;
  color?: string;
  inView?: boolean;
  inViewOnce?: boolean;
  transition?: Transition;
};

export function HighlightText({
  text,
  delay = 0,
  color = "color-mix(in oklab, #f5c542 38%, transparent)",
  inView = false,
  inViewOnce = true,
  transition,
  className,
  style,
  ...props
}: HighlightTextProps) {
  const reduce = useReduceMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref, inView, inViewOnce);
  const tween = useTempoTransition(
    transition ?? { duration: 2, ease: [0.42, 0, 0.58, 1] },
  );
  const shown = seen || reduce;
  const final = reduce ? { duration: 0 } : { ...tween, delay: (tween.delay ?? 0) + delay / 1000 };

  return (
    <motion.span
      ref={ref}
      data-slot="highlight-text"
      initial={reduce ? false : { backgroundSize: "0% 100%" }}
      animate={{ backgroundSize: shown ? "100% 100%" : "0% 100%" }}
      transition={shown ? final : { duration: 0 }}
      className={cn("relative inline-block", className)}
      style={{
        backgroundImage: `linear-gradient(${color}, ${color})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        ...style,
      }}
      {...props}
    >
      {text}
    </motion.span>
  );
}
