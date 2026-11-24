"use client";

import * as React from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
  type SpringOptions,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion, useTempoTransition } from "../motion";
import { useCanHover } from "./shared";

export type MagneticProps = HTMLMotionProps<"div"> & {
  strength?: number;
  range?: number;
  springOptions?: SpringOptions;
  onlyOnHover?: boolean;
  disableOnTouch?: boolean;
};

const defaultSpring: SpringOptions = {
  stiffness: 100,
  damping: 10,
  mass: 0.5,
};

export function Magnetic({
  children,
  strength = 0.5,
  range = 120,
  springOptions,
  onlyOnHover = false,
  disableOnTouch = true,
  className,
  style,
  onPointerEnter,
  onPointerLeave,
  onPointerMove,
  ...props
}: MagneticProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const scrubX = useMotionValue(0);
  const scrubY = useMotionValue(0);
  const tempoSpring = useTempoTransition(springOptions ?? defaultSpring) as SpringOptions;
  const x = useSpring(scrubX, tempoSpring);
  const y = useSpring(scrubY, tempoSpring);
  const canHover = useCanHover();
  const reduce = useReduceMotion();
  const enabled = !reduce && (canHover || !disableOnTouch);
  const hovering = React.useRef(false);

  const reset = React.useCallback(() => {
    scrubX.set(0);
    scrubY.set(0);
  }, [scrubX, scrubY]);

  const compute = React.useCallback(
    (event: MouseEvent | React.PointerEvent) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance <= range) {
        const factor = (1 - distance / range) * strength;
        scrubX.set(dx * factor);
        scrubY.set(dy * factor);
      } else {
        reset();
      }
    },
    [range, reset, scrubX, scrubY, strength],
  );

  React.useEffect(() => {
    if (!enabled || onlyOnHover) return;
    const handleMove = (event: MouseEvent) => compute(event);
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      reset();
    };
  }, [compute, enabled, onlyOnHover, reset]);

  React.useEffect(() => {
    if (enabled) return;
    reset();
  }, [enabled, reset]);

  return (
    <motion.div
      ref={ref}
      data-slot="magnetic"
      className={cn("inline-block", className)}
      style={{ x, y, ...style }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        hovering.current = true;
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (enabled && onlyOnHover && hovering.current) compute(event);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        hovering.current = false;
        reset();
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
