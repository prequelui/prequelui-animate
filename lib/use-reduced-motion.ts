"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function useHydratedReducedMotion() {
  const reduce = useReducedMotion() ?? false;
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  return mounted ? reduce : false;
}
