"use client";

import * as React from "react";
import { useInView, type Transition } from "motion/react";

export const entranceSpring: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

export const heightSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  bounce: 0,
  restDelta: 0.01,
};

export const highlightSpring: Transition = {
  type: "spring",
  stiffness: 500,
  damping: 40,
};

export const fadeTween: Transition = {
  duration: 0.2,
  ease: [0.23, 1, 0.32, 1],
};

export const softEase = [0.23, 1, 0.32, 1] as const;

export type SlideDirection = "up" | "down" | "left" | "right";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const COARSE_QUERY = "(pointer: coarse)";

function useMediaQuery(query: string) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function useCanHover() {
  return useMediaQuery(HOVER_QUERY);
}

export function useCoarsePointer() {
  return useMediaQuery(COARSE_QUERY);
}

export function useMounted() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

export function useInViewEffect(
  ref: React.RefObject<Element | null>,
  enabled: boolean,
  once: boolean,
  margin: string,
) {
  const inView = useInView(ref, {
    once,
    amount: 0.35,
    margin: margin as `${number}px`,
  });
  return enabled ? inView : true;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else (ref as React.MutableRefObject<T | null>).current = node;
    }
  };
}
