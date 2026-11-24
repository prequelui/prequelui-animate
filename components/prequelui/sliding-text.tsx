"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type AnimationPlaybackControls,
  type HTMLMotionProps,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion, useTempoTransition } from "./motion";

export type SlidingTextDirection = "up" | "down";
export type SlidingTextTrigger = "hover" | "click";

const HOST = 'a, button, [role="button"], [role="link"]';
const BLEED = "0.25em";
const GAP = "0.6em";

export type SlidingTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string;
  direction?: SlidingTextDirection;
  trigger?: SlidingTextTrigger;
  transition?: Transition;
};

export function SlidingText({
  text,
  direction = "down",
  trigger = "hover",
  transition,
  className,
  style,
  ...props
}: SlidingTextProps) {
  const reduce = useReduceMotion();
  const tween = useTempoTransition(
    transition ?? { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  );
  const sign = direction === "down" ? 1 : -1;
  const progress = useMotionValue(0);
  const y = useTransform(progress, (value) => {
    const lap = sign * (value - Math.floor(value));
    return lap === 0 ? "0%" : `calc(${lap * 100}% + ${lap} * ${GAP})`;
  });
  const target = React.useRef(0);
  const controls = React.useRef<AnimationPlaybackControls | null>(null);

  React.useEffect(() => () => controls.current?.stop(), []);

  const slideTo = React.useCallback(
    (next: number) => {
      target.current = next;
      controls.current?.stop();
      if (reduce) {
        progress.jump(next);
        return;
      }
      controls.current = animate(progress, next, tween);
    },
    [progress, reduce, tween],
  );

  const elementRef = React.useRef<HTMLSpanElement | null>(null);
  const [host, setHost] = React.useState<Element | null>(null);

  React.useLayoutEffect(() => {
    setHost(elementRef.current?.parentElement?.closest(HOST) ?? null);
  }, []);

  React.useEffect(() => {
    if (!host) return;
    const enter = (event: Event) => {
      if (trigger === "hover" && (event as PointerEvent).pointerType !== "touch") {
        slideTo(1);
      }
    };
    const leave = (event: Event) => {
      if (trigger === "hover" && (event as PointerEvent).pointerType !== "touch") {
        slideTo(0);
      }
    };
    const click = () => {
      if (trigger === "click") slideTo(Math.round(target.current) + 1);
    };
    host.addEventListener("pointerenter", enter);
    host.addEventListener("pointerleave", leave);
    host.addEventListener("click", click);
    return () => {
      host.removeEventListener("pointerenter", enter);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("click", click);
    };
  }, [host, slideTo, trigger]);

  return (
    <motion.span
      ref={(node) => {
        elementRef.current = node;
      }}
      data-slot="sliding-text"
      data-direction={direction}
      data-trigger={trigger}
      onHoverStart={() => {
        if (trigger === "hover" && !host) slideTo(1);
      }}
      onHoverEnd={() => {
        if (trigger === "hover" && !host) slideTo(0);
      }}
      onClick={() => {
        if (trigger === "click" && !host) slideTo(Math.round(target.current) + 1);
      }}
      className={cn("relative inline-block overflow-clip", className)}
      style={{
        paddingBlock: BLEED,
        marginBlock: `calc(-1 * ${BLEED})`,
        ...style,
      }}
      {...props}
    >
      <motion.span
        data-slot="sliding-text-track"
        className="relative inline-block"
        style={{ y }}
      >
        {text}
        <span
          data-slot="sliding-text-copy"
          aria-hidden="true"
          className="absolute left-0 w-full"
          style={{ top: `calc(${-sign * 100}% - ${sign} * ${GAP})` }}
        >
          {text}
        </span>
      </motion.span>
    </motion.span>
  );
}
