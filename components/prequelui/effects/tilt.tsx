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

export type TiltProps = HTMLMotionProps<"div"> & {
  maxTilt?: number;
  perspective?: number;
  transition?: SpringOptions;
};

const defaultSpring: SpringOptions = {
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

export function Tilt({
  maxTilt = 10,
  perspective = 800,
  transition,
  className,
  style,
  onPointerMove,
  onPointerLeave,
  ...props
}: TiltProps) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const tempoSpring = useTempoTransition(transition ?? defaultSpring) as SpringOptions;
  const rotateX = useSpring(rawX, tempoSpring);
  const rotateY = useSpring(rawY, tempoSpring);
  const reduce = useReduceMotion();

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
    const py = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
    rawY.set((px * 2 - 1) * maxTilt);
    rawX.set(-(py * 2 - 1) * maxTilt);
  };

  const handleLeave = (event: React.PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(event);
    rawX.set(0);
    rawY.set(0);
  };

  React.useEffect(() => {
    if (!reduce) return;
    rawX.jump(0);
    rawY.jump(0);
    rotateX.jump(0);
    rotateY.jump(0);
  }, [rawX, rawY, reduce, rotateX, rotateY]);

  return (
    <motion.div
      data-slot="tilt"
      className={cn("will-change-transform", className)}
      style={{
        rotateX,
        rotateY,
        transformPerspective: perspective,
        transformStyle: "preserve-3d",
        ...style,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...props}
    >
      {props.children}
    </motion.div>
  );
}
