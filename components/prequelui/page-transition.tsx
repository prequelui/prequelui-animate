"use client";

import * as React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { easeInOut, useReduceMotion } from "./motion";

export type PageTransitionProps = Omit<HTMLMotionProps<"div">, "children"> & {
  pageKey: React.Key;
  children: React.ReactNode;
  duration?: number;
  from?: "top" | "bottom" | "left" | "right";
  fade?: boolean;
};

function hiddenClip(from: PageTransitionProps["from"]) {
  switch (from) {
    case "bottom":
      return "inset(100% 0 0 0)";
    case "left":
      return "inset(0 100% 0 0)";
    case "right":
      return "inset(0 0 0 100%)";
    default:
      return "inset(0 0 100% 0)";
  }
}

export function PageTransition({
  pageKey,
  children,
  duration = 0.55,
  from = "top",
  fade = true,
  className,
  ...props
}: PageTransitionProps) {
  const reduce = useReduceMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pageKey}
        data-slot="page-transition"
        initial={
          reduce
            ? { opacity: 0 }
            : { clipPath: hiddenClip(from), opacity: fade ? 0.6 : 1 }
        }
        animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0 }}
        transition={reduce ? { duration: 0 } : { duration, ease: easeInOut }}
        className={cn("min-w-0", className)}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
