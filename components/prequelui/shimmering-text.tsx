"use client";

import * as React from "react";
import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import {
  splitGraphemes,
  srOnlyStyle,
  usePageVisible,
  useReduceMotion,
  useTempo,
} from "./motion";

export type ShimmeringTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string;
  duration?: number;
  wave?: boolean;
  color?: string;
  shimmeringColor?: string;
};

const REST = { x: 0, y: 0, scale: 1, rotateY: 0 };
const WAVE = {
  x: [0, 5, 0],
  y: [0, -5, 0],
  scale: [1, 1.1, 1],
  rotateY: [0, 15, 0],
};

export function ShimmeringText({
  text,
  duration = 1,
  wave = false,
  color = "var(--muted-foreground)",
  shimmeringColor = "var(--foreground)",
  className,
  style,
  ...props
}: ShimmeringTextProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref);
  const pageVisible = usePageVisible();
  const reduce = useReduceMotion();
  const tempo = useTempo();
  const playing = inView && pageVisible && !reduce;
  const chars = React.useMemo(() => splitGraphemes(text ?? ""), [text]);
  const span = duration * tempo;

  return (
    <motion.span
      ref={ref}
      data-slot="shimmering-text"
      className={cn("relative inline-block", className)}
      style={
        {
          "--shimmer-color": shimmeringColor,
          "--shimmer-base": color,
          color,
          perspective: "500px",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      <span className="sr-only" style={srOnlyStyle()}>
        {text}
      </span>
      <span aria-hidden="true" className="inline-block" style={{ perspective: "inherit" }}>
        {chars.map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            className="inline-block whitespace-pre"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ ...(wave ? { scale: 1, rotateY: 0 } : {}), opacity: 1 }}
            animate={
              playing
                ? {
                    ...(wave ? WAVE : {}),
                    opacity: [1, 0.35, 1],
                  }
                : { ...(wave ? REST : {}), opacity: 1 }
            }
            transition={
              playing
                ? {
                    duration: span,
                    repeat: Infinity,
                    repeatDelay: chars.length * 0.05,
                    delay: (index * span) / Math.max(1, chars.length),
                    ease: "easeInOut",
                  }
                : { duration: 0 }
            }
          >
            {char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
