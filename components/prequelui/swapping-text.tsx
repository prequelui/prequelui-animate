"use client";

import * as React from "react";
import { motion, useInView, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  splitGraphemes,
  srOnlyStyle,
  usePageVisible,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

export type SwappingTextDirection = "up" | "down";

export type SwappingTextProps = Omit<React.ComponentProps<"span">, "children"> & {
  text: string | string[];
  duration?: number;
  delay?: number;
  direction?: SwappingTextDirection;
  stagger?: number;
  transition?: Transition;
};

type Swap = {
  id: number;
  from: string[];
  to: string[];
  widths: { from: number[]; to: number[] } | null;
};

function measure(element: HTMLElement | null, chars: string[]) {
  if (!element || typeof document === "undefined") return null;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return null;
  const style = getComputedStyle(element);
  context.font = style.font;
  const spacing = Number.parseFloat(style.letterSpacing) || 0;
  return chars.map((char) => context.measureText(char).width + spacing);
}

export function SwappingText({
  text: textProp,
  duration = 2000,
  delay = 0,
  direction = "up",
  stagger = 0.04,
  transition,
  className,
  style,
  ...props
}: SwappingTextProps) {
  const reduce = useReduceMotion();
  const tween = useTempoTransition(
    transition ?? { duration: 0.2, ease: [0.4, 0, 0.2, 1] },
  );
  const ref = React.useRef<HTMLSpanElement>(null);
  const texts = React.useMemo(
    () => (Array.isArray(textProp) ? textProp : [textProp]),
    [textProp],
  );
  const [index, setIndex] = React.useState(0);
  const onScreen = useInView(ref);
  const pageVisible = usePageVisible();
  const [cycled, setCycled] = React.useState(false);
  const cycling = texts.length > 1 && onScreen && pageVisible;

  React.useEffect(() => {
    if (!cycling) return;
    const timer = setTimeout(
      () => {
        setCycled(true);
        setIndex((current) => (current + 1) % texts.length);
      },
      cycled ? duration : delay + duration,
    );
    return () => clearTimeout(timer);
  }, [cycled, cycling, delay, duration, index, texts.length]);

  const text = texts[index % texts.length] ?? "";
  const chars = React.useMemo(() => splitGraphemes(text), [text]);
  const [swap, setSwap] = React.useState<Swap>(() => ({
    id: 0,
    from: chars,
    to: chars,
    widths: null,
  }));

  React.useLayoutEffect(() => {
    setSwap((current) => {
      if (current.to.join("") === chars.join("")) return current;
      const from = measure(ref.current, current.to);
      const to = measure(ref.current, chars);
      return {
        id: current.id + 1,
        from: current.to,
        to: chars,
        widths: from && to ? { from, to } : null,
      };
    });
  }, [chars]);

  React.useEffect(() => {
    if (swap.id === 0) return;
    const timer = setTimeout(() => {
      setSwap((current) =>
        current.id === swap.id
          ? { ...current, from: current.to, widths: null }
          : current,
      );
    }, 700);
    return () => clearTimeout(timer);
  }, [swap.id]);

  const slots = Math.max(swap.from.length, swap.to.length);
  const sign = direction === "up" ? 1 : -1;
  const enter = `${sign * 0.5}em`;
  const exit = `${-sign * 0.5}em`;
  let order = 0;

  return (
    <span
      ref={ref}
      data-slot="swapping-text"
      className={cn("inline-block whitespace-pre", className)}
      style={style}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex">
        {Array.from({ length: slots }, (_, index) => {
          const from = swap.from[index] ?? "";
          const to = swap.to[index] ?? "";
          const animated = swap.id > 0 && from !== to && !reduce;
          if (!animated) {
            if (!to) return null;
            return (
              <span key={`${swap.id}-${index}`} className="inline-block">
                {to === " " ? "\u00A0" : to}
              </span>
            );
          }
          const timing = { ...tween, delay: order++ * stagger };
          const widths = swap.widths;
          return (
            <motion.span
              key={`${swap.id}-${index}`}
              data-slot="swapping-text-slot"
              className="relative inline-block"
              initial={
                widths
                  ? { width: (widths.from[index] ?? 0) / 16 + "rem" }
                  : false
              }
              animate={
                widths
                  ? { width: (widths.to[index] ?? 0) / 16 + "rem" }
                  : { opacity: 1 }
              }
              transition={timing}
            >
              {from && (
                <motion.span
                  className="absolute left-0 top-0"
                  initial={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  animate={{ y: exit, opacity: 0, filter: "blur(2px)" }}
                  transition={timing}
                >
                  {from === " " ? "\u00A0" : from}
                </motion.span>
              )}
              {to && (
                <motion.span
                  className="inline-block"
                  style={{ position: widths ? "absolute" : "relative", left: 0, top: 0 }}
                  initial={{ y: enter, opacity: 0, filter: "blur(2px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  transition={timing}
                >
                  {to === " " ? "\u00A0" : to}
                </motion.span>
              )}
              {widths && <span className="invisible">{to || "\u00A0"}</span>}
            </motion.span>
          );
        })}
      </span>
      <span className="sr-only" style={srOnlyStyle()}>
        {text}
      </span>
    </span>
  );
}
