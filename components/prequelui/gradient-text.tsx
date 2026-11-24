"use client";

import * as React from "react";
import { motion, useInView, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { usePageVisible, useReduceMotion, useTempoTransition } from "./motion";

const DEFAULT_GRADIENT =
  "linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)";

export type GradientTextProps = Omit<React.ComponentProps<"span">, "children"> & {
  text: string;
  gradient?: string;
  neon?: boolean;
  transition?: Transition;
};

export function GradientText({
  text,
  gradient = DEFAULT_GRADIENT,
  neon = false,
  transition,
  className,
  style,
  ...props
}: GradientTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const pageVisible = usePageVisible();
  const reduce = useReduceMotion();
  const tween = useTempoTransition(
    transition ?? { duration: 50, repeat: Infinity, ease: "linear" },
  );
  const playing = inView && pageVisible && !reduce;

  const layer: React.CSSProperties = {
    backgroundImage: gradient,
    color: "transparent",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    backgroundSize: "700% 100%",
    display: "inline-block",
  };

  return (
    <span
      ref={ref}
      data-slot="gradient-text"
      className={cn("relative inline-block", className)}
      style={style}
      {...props}
    >
      <motion.span
        style={layer}
        animate={playing ? { backgroundPosition: ["0% 0%", "500% 100%"] } : undefined}
        transition={playing ? tween : undefined}
      >
        {text}
      </motion.span>
      {neon && (
        <motion.span
          aria-hidden="true"
          style={{
            ...layer,
            position: "absolute",
            inset: 0,
            mixBlendMode: "plus-lighter",
            filter: "blur(8px)",
          }}
          animate={playing ? { backgroundPosition: ["0% 0%", "500% 100%"] } : undefined}
          transition={playing ? tween : undefined}
        >
          {text}
        </motion.span>
      )}
    </span>
  );
}
