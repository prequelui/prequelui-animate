"use client";

import * as React from "react";
import {
  useAnimationControls,
  useInView,
  type TargetAndTransition,
  type Transition,
  type Variants,
} from "motion/react";
import { Slot, useReduceMotion, useTempo } from "../motion";
import {
  IconStyleProvider,
  type IconVariant,
  type IconWeight,
} from "./style";

export type IconAnimationSet = Record<string, Record<string, Variants>>;
export type IconTrigger = boolean | string;
export type IconControls = ReturnType<typeof useAnimationControls>;

type IconContextValue = {
  controls: IconControls;
  animation: string;
  speed: number;
};

const IconContext = React.createContext<IconContextValue | null>(null);

export function useAnimatedIconContext() {
  return React.useContext(IconContext);
}

const TIME_KEYS = new Set([
  "duration",
  "delay",
  "repeatDelay",
  "delayChildren",
  "staggerChildren",
]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function scaleTransition(transition: Transition, factor: number): Transition {
  if (factor === 1) return transition;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(transition)) {
    if (typeof value === "number" && TIME_KEYS.has(key)) next[key] = value * factor;
    else if (typeof value === "number" && key === "stiffness")
      next[key] = value / (factor * factor);
    else if (typeof value === "number" && key === "damping") next[key] = value / factor;
    else if (isPlainObject(value)) next[key] = scaleTransition(value as Transition, factor);
    else next[key] = value;
  }
  return next as Transition;
}

function scaleTarget(
  target: TargetAndTransition,
  factor: number,
): TargetAndTransition {
  if (!isPlainObject(target)) return target;
  const next: Record<string, unknown> = { ...target };
  if (isPlainObject(next.transition)) {
    next.transition = scaleTransition(next.transition as Transition, factor);
  }
  return next as TargetAndTransition;
}

function scalePart(part: Variants, factor: number): Variants {
  if (factor === 1) return part;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(part)) {
    if (key === "transition" && isPlainObject(value)) {
      next[key] = scaleTransition(value as Transition, factor);
    } else {
      next[key] = scaleTarget(value as TargetAndTransition, factor);
    }
  }
  return next as Variants;
}

export function useIconVariants(animations: IconAnimationSet): Record<string, Variants> {
  const context = React.useContext(IconContext);
  const tempo = useTempo();
  const animation = context?.animation ?? "default";
  const speed = context?.speed ?? 1;
  const factor = tempo / Math.max(0.05, speed);
  const set =
    animations[animation] ??
    animations.default ??
    animations.hover ??
    Object.values(animations)[0] ??
    {};

  return React.useMemo(() => {
    if (factor === 1) return set;
    const next: Record<string, Variants> = {};
    for (const [part, variants] of Object.entries(set)) {
      next[part] = scalePart(variants, factor);
    }
    return next;
  }, [factor, set]);
}

export type AnimatedIconProps = Omit<React.ComponentProps<"span">, "children"> & {
  children: React.ReactNode;
  animate?: IconTrigger;
  animateOnHover?: IconTrigger;
  animateOnTap?: IconTrigger;
  animateOnView?: IconTrigger;
  animateOnViewOnce?: boolean;
  animateOnViewMargin?: string;
  animation?: string;
  loop?: boolean;
  loopDelay?: number;
  delay?: number;
  speed?: number;
  variant?: IconVariant;
  weight?: IconWeight;
  asChild?: boolean;
};

export function AnimatedIcon({
  children,
  animate = false,
  animateOnHover = false,
  animateOnTap = false,
  animateOnView = false,
  animateOnViewOnce = true,
  animateOnViewMargin = "0px",
  animation = "default",
  loop = false,
  loopDelay = 0,
  delay = 0,
  speed = 1,
  variant,
  weight,
  asChild = false,
  className,
  onPointerEnter,
  onPointerLeave,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  ...props
}: AnimatedIconProps) {
  const controls = useAnimationControls();
  const reduce = useReduceMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const [active, setActive] = React.useState(false);
  const [currentAnimation, setCurrentAnimation] = React.useState(animation);
  const pending = React.useRef<number | undefined>(undefined);
  const [mounted, setMounted] = React.useState(false);
  const alive = React.useRef(true);

  React.useEffect(() => setMounted(true), []);

  /* The animation effects clean up passively, after paint. A frame scheduled
     just before an unmount could therefore still reach the controls after
     motion has detached them. The layout cleanup runs synchronously, so the
     callbacks below can bail out before touching a dead controller. */
  React.useLayoutEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const inView = useInView(ref, {
    once: animateOnViewOnce,
    amount: 0.5,
    margin: animateOnViewMargin as `${number}px`,
  });

  const clearPending = React.useCallback(() => {
    if (pending.current !== undefined) {
      window.clearTimeout(pending.current);
      pending.current = undefined;
    }
  }, []);

  const start = React.useCallback(
    (trigger: IconTrigger) => {
      if (!trigger || reduce) return;
      clearPending();
      const next = typeof trigger === "string" ? trigger : animation;
      setCurrentAnimation(next);
      if (delay > 0) {
        pending.current = window.setTimeout(() => setActive(true), delay);
      } else {
        setActive(true);
      }
    },
    [animation, clearPending, delay, reduce],
  );

  const stop = React.useCallback(() => {
    clearPending();
    setActive(false);
  }, [clearPending]);

  React.useEffect(() => {
    if (animate) start(animate);
    else stop();
  }, [animate, start, stop]);

  React.useEffect(() => {
    setCurrentAnimation(typeof animate === "string" ? animate : animation);
  }, [animate, animation]);

  React.useEffect(() => {
    if (!animateOnView) return;
    if (inView) start(animateOnView);
    else stop();
  }, [animateOnView, inView, start, stop]);

  React.useEffect(() => {
    if (!mounted) return;

    let cancelled = false;
    let frame = 0;
    let timer: number | undefined;

    const run = async () => {
      if (cancelled || !alive.current) return;
      await controls.start("animate");
      if (cancelled || !alive.current) return;
      if (loop) {
        timer = window.setTimeout(run, Math.max(0, loopDelay));
      } else {
        setActive(false);
      }
    };

    frame = window.requestAnimationFrame(() => {
      if (cancelled || !alive.current) return;
      if (!active || reduce) {
        void controls.start("initial");
        return;
      }
      void run();
    });

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [active, controls, currentAnimation, loop, loopDelay, mounted, reduce]);

  React.useEffect(() => {
    return () => {
      if (pending.current !== undefined) window.clearTimeout(pending.current);
    };
  }, []);

  const Component = (asChild ? Slot : "span") as React.ElementType;

  return (
    <IconContext.Provider
      value={{ controls, animation: currentAnimation, speed }}
    >
      <IconStyleProvider variant={variant} weight={weight}>
        <Component
          ref={ref}
          data-slot="animated-icon"
          className={className}
          onPointerEnter={(event: React.PointerEvent<HTMLElement>) => {
            onPointerEnter?.(event as React.PointerEvent<HTMLSpanElement>);
            if (animateOnHover && event.pointerType !== "touch") start(animateOnHover);
          }}
          onPointerLeave={(event: React.PointerEvent<HTMLElement>) => {
            onPointerLeave?.(event as React.PointerEvent<HTMLSpanElement>);
            if (animateOnHover || animateOnTap) stop();
          }}
          onPointerDown={(event: React.PointerEvent<HTMLElement>) => {
            onPointerDown?.(event as React.PointerEvent<HTMLSpanElement>);
            if (animateOnTap) start(animateOnTap);
          }}
          onPointerUp={(event: React.PointerEvent<HTMLElement>) => {
            onPointerUp?.(event as React.PointerEvent<HTMLSpanElement>);
            if (animateOnTap) stop();
          }}
          onPointerCancel={(event: React.PointerEvent<HTMLElement>) => {
            onPointerCancel?.(event as React.PointerEvent<HTMLSpanElement>);
            if (animateOnTap) stop();
          }}
          {...props}
        >
          {children}
        </Component>
      </IconStyleProvider>
    </IconContext.Provider>
  );
}

export type AnimatedSvgProps = React.ComponentProps<"svg"> & {
  size?: number;
  children: React.ReactNode;
};
