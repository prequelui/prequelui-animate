"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "./motion";

export type SpringProps = HTMLMotionProps<"div"> & {
  stiffness?: number;
  damping?: number;
  elastic?: number;
  snapBack?: boolean;
  pressScale?: number;
};

export function Spring({
  stiffness = 200,
  damping = 16,
  elastic = 0.7,
  snapBack = true,
  pressScale = 1.06,
  transition,
  className,
  children,
  ...props
}: SpringProps) {
  const reduce = useReduceMotion();

  return (
    <motion.div
      data-slot="spring"
      drag={reduce ? false : true}
      dragSnapToOrigin={snapBack}
      dragElastic={elastic}
      dragMomentum={false}
      whileDrag={reduce ? undefined : { scale: pressScale, cursor: "grabbing" }}
      transition={
        reduce
          ? { duration: 0 }
          : transition ?? { type: "spring", stiffness, damping }
      }
      className={cn("cursor-grab touch-none select-none active:cursor-grabbing", className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
