"use client";

import { useEffect, useState } from "react";
import type { Transition } from "motion/react";
import { useHydratedReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/utils";

export { cn, useHydratedReducedMotion };

export type MomentProps = {
  className?: string;
  preview?: boolean;
};

export const springFast: Transition = { type: "spring", stiffness: 620, damping: 32 };
export const springSoft: Transition = { type: "spring", stiffness: 260, damping: 22 };
export const springBounce: Transition = { type: "spring", stiffness: 380, damping: 18 };
export const springHeavy: Transition = { type: "spring", stiffness: 200, damping: 26 };
export const springSnap: Transition = { type: "spring", stiffness: 700, damping: 38 };

export const tweenFast: Transition = { duration: 0.18, ease: [0.23, 1, 0.32, 1] };
export const tweenSoft: Transition = { duration: 0.32, ease: [0.23, 1, 0.32, 1] };

export const surface =
  "relative flex h-[150px] w-[230px] max-w-full select-none items-center justify-center text-foreground";

export function usePreviewPulse(
  preview: boolean | undefined,
  duration = 900,
  gap = 2500,
) {
  const [on, setOn] = useState(false);
  const reduce = useHydratedReducedMotion();

  useEffect(() => {
    if (!preview || reduce) {
      setOn(false);
      return;
    }
    let close = 0;
    let next = 0;
    const run = () => {
      setOn(true);
      close = window.setTimeout(() => setOn(false), duration);
      next = window.setTimeout(run, gap);
    };
    run();
    return () => {
      window.clearTimeout(close);
      window.clearTimeout(next);
    };
  }, [preview, reduce, duration, gap]);

  return on && !reduce;
}

export function usePreviewStep(
  preview: boolean | undefined,
  steps: number,
  interval = 1500,
) {
  const [step, setStep] = useState(0);
  const reduce = useHydratedReducedMotion();

  useEffect(() => {
    if (!preview || reduce) return;
    setStep(1);
    const id = window.setInterval(
      () => setStep((current) => (current + 1) % steps),
      interval,
    );
    return () => window.clearInterval(id);
  }, [preview, reduce, steps, interval]);

  return reduce ? 0 : step;
}

export function usePreviewPointer(
  preview: boolean | undefined,
  width = 220,
  height = 120,
) {
  const [point, setPoint] = useState({ x: width / 2, y: height / 2 });
  const reduce = useHydratedReducedMotion();

  useEffect(() => {
    if (!preview || reduce) return;
    let frame = 0;
    let start = 0;
    const loop = (time: number) => {
      if (!start) start = time;
      const t = (time - start) / 1000;
      const x = width / 2 + Math.cos(t * 1.4) * (width * 0.36);
      const y = height / 2 + Math.sin(t * 2.1) * (height * 0.28);
      setPoint({ x, y });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [preview, reduce, width, height]);

  return [point, setPoint] as const;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * The docs stage zooms its children (CSS `zoom`), so a pointer event reports
 * positions in zoomed pixels while the component lays itself out unscaled.
 * Normalise the event back into the component's own coordinate space.
 */
export function localPoint(
  event: { clientX: number; clientY: number },
  node: HTMLElement,
) {
  const rect = node.getBoundingClientRect();
  const scaleX = node.offsetWidth ? rect.width / node.offsetWidth : 1;
  const scaleY = node.offsetHeight ? rect.height / node.offsetHeight : 1;
  return {
    x: (event.clientX - rect.left) / (scaleX || 1),
    y: (event.clientY - rect.top) / (scaleY || 1),
  };
}

export function naturalWidth(node: HTMLElement) {
  return node.offsetWidth || node.getBoundingClientRect().width;
}

export function pointerScaleX(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return node.offsetWidth ? rect.width / node.offsetWidth : 1;
}
