"use client";

import * as React from "react";
import { motion, useAnimationFrame, useMotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "./motion";

export type MarqueeProps = React.ComponentProps<"div"> & {
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  fade?: boolean;
  gap?: number;
  repeat?: number;
  itemClassName?: string;
};

export function Marquee({
  speed = 42,
  reverse = false,
  pauseOnHover = true,
  fade = true,
  gap = 32,
  repeat = 2,
  itemClassName,
  className,
  children,
  style,
  onPointerEnter,
  onPointerLeave,
  ...props
}: MarqueeProps) {
  const reduce = useReduceMotion();
  const [paused, setPaused] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const trackRef = React.useRef<HTMLDivElement>(null);
  const firstRef = React.useRef<HTMLDivElement>(null);
  const spanRef = React.useRef(0);
  const x = useMotionValue(0);
  const direction = reverse ? 1 : -1;

  React.useLayoutEffect(() => {
    const node = firstRef.current;
    if (!node) return;
    const measure = () => {
      const width = node.scrollWidth + gap;
      spanRef.current = width;
      if (reverse) x.set(-width);
      setReady(width > 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, [gap, reverse, x, children]);

  useAnimationFrame((_, delta) => {
    if (reduce || paused || !ready || speed <= 0) return;
    const step = (speed * Math.min(delta, 64)) / 1000;
    let next = x.get() + direction * step;
    const span = spanRef.current;
    if (span <= 0) return;
    if (!reverse && next <= -span) next += span;
    if (reverse && next >= 0) next -= span;
    x.set(next);
  });

  const copies = Math.max(2, Math.round(repeat));
  const items = Array.from({ length: copies }, (_, copy) => (
    <div
      key={copy}
      ref={copy === 0 ? firstRef : undefined}
      aria-hidden={copy > 0 ? "true" : undefined}
      className={cn("flex shrink-0 items-center", itemClassName)}
      style={{ gap }}
    >
      {children}
    </div>
  ));

  return (
    <div
      data-slot="marquee"
      className={cn("relative overflow-hidden", className)}
      style={{
        ...style,
        maskImage: fade
          ? "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
          : undefined,
        WebkitMaskImage: fade
          ? "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
          : undefined,
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
      <motion.div
        ref={trackRef}
        className="flex w-max items-center will-change-transform"
        style={{ x, gap }}
        data-paused={paused ? "true" : undefined}
      >
        {items}
      </motion.div>
    </div>
  );
}
