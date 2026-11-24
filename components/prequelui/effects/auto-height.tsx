"use client";

import * as React from "react";
import {
  motion,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";
import { Slot, useReduceMotion, useTempoTransition } from "../motion";
import { heightSpring, mergeRefs } from "./shared";

export type UseAutoHeightOptions = {
  includeParentBox?: boolean;
  includeSelfBox?: boolean;
};

export function useAutoHeight<T extends HTMLElement = HTMLDivElement>(
  deps: React.DependencyList = [],
  options: UseAutoHeightOptions = {},
) {
  const { includeParentBox = true, includeSelfBox = false } = options;
  const ref = React.useRef<T>(null);
  const [height, setHeight] = React.useState(0);

  const measure = React.useCallback(() => {
    const el = ref.current;
    if (!el) return 0;

    const base = el.getBoundingClientRect().height;
    let extra = 0;

    if (includeParentBox && el.parentElement) {
      const box = el.parentElement.getBoundingClientRect();
      const inner = Array.from(el.parentElement.children).reduce(
        (total, child) => total + child.getBoundingClientRect().height,
        0,
      );
      extra = Math.max(0, box.height - inner);
    }

    if (includeSelfBox) {
      const style = getComputedStyle(el);
      extra +=
        (parseFloat(style.paddingTop) || 0) +
        (parseFloat(style.paddingBottom) || 0) +
        (parseFloat(style.borderTopWidth) || 0) +
        (parseFloat(style.borderBottomWidth) || 0);
    }

    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    return Math.ceil((base + extra) * dpr) / dpr;
  }, [includeParentBox, includeSelfBox]);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    setHeight(measure());

    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setHeight(measure()));
    });

    observer.observe(el);
    if (includeParentBox && el.parentElement) observer.observe(el.parentElement);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  React.useLayoutEffect(() => {
    if (height !== 0) return;
    const next = measure();
    if (next !== 0) setHeight(next);
  }, [height, measure]);

  return { ref, height } as const;
}

export type AutoHeightProps = Omit<HTMLMotionProps<"div">, "animate"> & {
  children: React.ReactNode;
  deps?: React.DependencyList;
  animate?: TargetAndTransition;
  transition?: Transition;
  asChild?: boolean;
  wrapperClassName?: string;
};

export function AutoHeight({
  children,
  deps = [],
  animate,
  transition,
  asChild = false,
  wrapperClassName,
  className,
  style,
  ...props
}: AutoHeightProps) {
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? heightSpring);
  const { ref, height } = useAutoHeight<HTMLDivElement>(deps);
  const Component = (asChild ? Slot : motion.div) as React.ElementType;

  return (
    <Component
      data-slot="auto-height"
      style={{ overflow: "hidden", ...style }}
      animate={{ height, ...animate }}
      transition={reduce ? { duration: 0 } : spring}
      className={className}
      {...props}
    >
      <div ref={ref} className={cn("w-full", wrapperClassName)}>
        {children}
      </div>
    </Component>
  );
}
