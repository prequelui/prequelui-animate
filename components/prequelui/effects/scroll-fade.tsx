"use client";

import * as React from "react";
import { animate, useMotionValue, type MotionValue, type Transition } from "motion/react";
import { useReduceMotion, useTempoTransition } from "../motion";
import { clamp, fadeTween, mergeRefs } from "./shared";

export type ScrollFadeOrientation = "vertical" | "horizontal" | "both";
export type ScrollFadeEdge = "top" | "bottom" | "left" | "right";
export type ScrollFadeValues = Record<ScrollFadeEdge, MotionValue<number>>;

export type UseScrollFadeOptions = {
  orientation?: ScrollFadeOrientation;
  size?: number;
  transition?: Transition;
  enabled?: boolean;
};

const EDGES: ScrollFadeEdge[] = ["top", "bottom", "left", "right"];
const VARS: Record<ScrollFadeEdge | "size", string> = {
  top: "--scroll-fade-top",
  bottom: "--scroll-fade-bottom",
  left: "--scroll-fade-left",
  right: "--scroll-fade-right",
  size: "--scroll-fade-size",
};

function maskFor(orientation: ScrollFadeOrientation) {
  const stop = (edge: ScrollFadeEdge) =>
    `rgb(0 0 0 / calc(1 - var(${VARS[edge]}, 0)))`;
  const depth = (edge: ScrollFadeEdge) =>
    `calc(var(${VARS.size}) * min(1, var(${VARS[edge]}, 0) * 1000))`;
  const vertical = `linear-gradient(to bottom, ${stop("top")} 0, #000 ${depth(
    "top",
  )}, #000 calc(100% - ${depth("bottom")}), ${stop("bottom")} 100%)`;
  const horizontal = `linear-gradient(to right, ${stop("left")} 0, #000 ${depth(
    "left",
  )}, #000 calc(100% - ${depth("right")}), ${stop("right")} 100%)`;

  if (orientation === "vertical") return vertical;
  if (orientation === "horizontal") return horizontal;
  return `${vertical}, ${horizontal}`;
}

function applyMask(element: HTMLElement, mask: string | null) {
  if (mask) {
    element.style.setProperty("mask-image", mask);
    element.style.setProperty("-webkit-mask-image", mask);
    element.style.setProperty("mask-composite", "intersect");
    element.style.setProperty("-webkit-mask-composite", "source-in");
  } else {
    for (const property of [
      "mask-image",
      "-webkit-mask-image",
      "mask-composite",
      "-webkit-mask-composite",
    ]) {
      element.style.removeProperty(property);
    }
  }
}

export function useScrollFade(
  ref: React.RefObject<HTMLElement | null>,
  {
    orientation = "vertical",
    size = 40,
    transition,
    enabled = true,
  }: UseScrollFadeOptions = {},
): ScrollFadeValues {
  const reduce = useReduceMotion();
  const settle = useTempoTransition(transition ?? fadeTween);
  const top = useMotionValue(0);
  const bottom = useMotionValue(0);
  const left = useMotionValue(0);
  const right = useMotionValue(0);
  const values = React.useMemo(
    () => ({ top, bottom, left, right }),
    [top, bottom, left, right],
  );

  React.useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const vertical = orientation !== "horizontal";
    const horizontal = orientation !== "vertical";
    const mask = maskFor(orientation);
    let masked = false;

    element.style.setProperty(VARS.size, `${size}px`);

    const write = () => {
      let any = false;
      for (const edge of EDGES) {
        const amount = clamp(values[edge].get(), 0, 1);
        if (amount > 0.001) any = true;
        element.style.setProperty(VARS[edge], amount.toFixed(4));
      }
      if (any !== masked) {
        masked = any;
        applyMask(element, any ? mask : null);
      }
    };

    const unsubscribers = EDGES.map((edge) => values[edge].on("change", write));
    const ramp = size / 2;
    const amount = (distance: number) =>
      ramp > 0 ? clamp(distance / ramp, 0, 1) : distance > 0.5 ? 1 : 0;

    const measure = (follow: boolean) => {
      const targets = { top: 0, bottom: 0, left: 0, right: 0 } as Record<
        ScrollFadeEdge,
        number
      >;

      if (vertical) {
        const max = element.scrollHeight - element.clientHeight;
        if (max > 1) {
          targets.top = amount(element.scrollTop);
          targets.bottom = amount(max - element.scrollTop);
        }
      }

      if (horizontal) {
        const max = element.scrollWidth - element.clientWidth;
        if (max > 1) {
          const fromStart = Math.abs(element.scrollLeft);
          const fromEnd = max - fromStart;
          const rtl = getComputedStyle(element).direction === "rtl";
          targets.left = amount(rtl ? fromEnd : fromStart);
          targets.right = amount(rtl ? fromStart : fromEnd);
        }
      }

      for (const edge of EDGES) {
        if (follow || reduce) values[edge].jump(targets[edge]);
        else if (Math.abs(values[edge].get() - targets[edge]) > 0.001) {
          animate(values[edge], targets[edge], settle);
        }
      }
      write();
    };

    measure(true);

    const onScroll = () => measure(true);
    element.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(() => measure(false));
    observer.observe(element);
    for (const child of element.children) observer.observe(child);

    const mutation = new MutationObserver(() => {
      measure(false);
      observer.disconnect();
      observer.observe(element);
      for (const child of element.children) observer.observe(child);
    });
    mutation.observe(element, { childList: true, subtree: true });

    return () => {
      element.removeEventListener("scroll", onScroll);
      observer.disconnect();
      mutation.disconnect();
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      applyMask(element, null);
      for (const name of Object.values(VARS)) element.style.removeProperty(name);
      for (const edge of EDGES) values[edge].jump(0);
    };
  }, [enabled, orientation, ref, reduce, settle, size, values]);

  return values;
}

const OVERFLOW: Record<ScrollFadeOrientation, React.CSSProperties> = {
  vertical: { overflowY: "auto" },
  horizontal: { overflowX: "auto" },
  both: { overflow: "auto" },
};

export type ScrollFadeProps = React.ComponentProps<"div"> &
  UseScrollFadeOptions & {
    asChild?: boolean;
  };

export function ScrollFade({
  orientation = "vertical",
  size,
  transition,
  enabled,
  asChild = false,
  className,
  style,
  children,
  ...props
}: ScrollFadeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const childRef = React.isValidElement<{ ref?: React.Ref<HTMLElement> }>(children)
    ? children.props.ref
    : undefined;
  const merged = React.useMemo(
    () => mergeRefs<HTMLDivElement>(ref, childRef as React.Ref<HTMLDivElement>),
    [childRef],
  );

  useScrollFade(ref, { orientation, size, transition, enabled });

  const shared = {
    "data-slot": "scroll-fade",
    "data-orientation": orientation,
    className,
    style: { ...OVERFLOW[orientation], ...style },
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children as React.ReactElement<Record<string, unknown>>,
      {
        ...props,
        ...shared,
        ref: merged,
      },
    );
  }

  return (
    <div ref={ref} {...shared} {...props}>
      {children}
    </div>
  );
}
