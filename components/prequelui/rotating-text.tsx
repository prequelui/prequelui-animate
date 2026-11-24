"use client";

import * as React from "react";
import { AnimatePresence, motion, useInView, type HTMLMotionProps, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  srOnlyStyle,
  usePageVisible,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

export type RotatingTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text?: string | string[];
  texts?: string | string[];
  duration?: number;
  y?: number;
  delay?: number;
  align?: "start" | "center" | "end";
  loop?: boolean;
  transition?: Transition;
};

export function RotatingText({
  text,
  texts: textsProp,
  duration = 2000,
  y = -50,
  delay = 0,
  align = "start",
  loop = true,
  transition,
  className,
  style,
  ...props
}: RotatingTextProps) {
  const reduce = useReduceMotion();
  const tween = useTempoTransition(
    transition ?? { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  );
  const list = React.useMemo(() => {
    const value = textsProp ?? text ?? "";
    const next = Array.isArray(value) ? value : [value];
    return next.length ? next : [""];
  }, [text, textsProp]);
  const unique = React.useMemo(() => [...new Set(list)], [list]);
  const [index, setIndex] = React.useState(0);
  const [rotated, setRotated] = React.useState(false);
  const ref = React.useRef<HTMLSpanElement>(null);
  const onScreen = useInView(ref);
  const pageVisible = usePageVisible();
  const playing = onScreen && pageVisible && (loop || index < list.length - 1);

  React.useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(
      () => {
        setRotated(true);
        setIndex((current) =>
          loop ? (current + 1) % list.length : Math.min(current + 1, list.length - 1),
        );
      },
      rotated ? duration : delay,
    );
    return () => clearTimeout(timer);
  }, [delay, duration, index, list.length, loop, playing, rotated]);

  const current = list[index % list.length] ?? "";
  const travel = reduce ? 0 : y;

  return (
    <motion.span
      ref={ref}
      data-slot="rotating-text"
      className={cn("relative inline-block overflow-hidden py-1 align-baseline", className)}
      style={style}
      {...props}
    >
      <span className="sr-only" style={srOnlyStyle()}>
        {list.join(", ")}
      </span>
      <span
        aria-hidden="true"
        className="inline-grid"
        style={{ justifyItems: align, alignItems: "baseline" }}
      >
        {unique.map((item) => (
          <span
            key={item}
            className="invisible whitespace-nowrap"
            style={{ gridArea: "1 / 1" }}
          >
            {item}
          </span>
        ))}
        <span style={{ gridArea: "1 / 1", justifySelf: align }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`${current}-${index}`}
              aria-hidden="true"
              initial={{ opacity: 0, y: -travel }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: travel }}
              transition={tween}
              className="inline-block whitespace-nowrap"
            >
              {current}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
    </motion.span>
  );
}
