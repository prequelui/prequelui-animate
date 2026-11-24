"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Slot,
  pressSpring,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

export type ButtonProps = HTMLMotionProps<"button"> & {
  asChild?: boolean;
  hoverScale?: number;
  tapScale?: number;
  transition?: Transition;
};

const BASE =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

export function Button({
  asChild = false,
  hoverScale = 1,
  tapScale = 0.97,
  transition,
  className,
  ...props
}: ButtonProps) {
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? pressSpring);
  const motionProps = {
    "data-slot": "button",
    initial: reduce ? undefined : { scale: 1 },
    whileTap: reduce ? undefined : { scale: tapScale },
    whileHover: reduce || hoverScale === 1 ? undefined : { scale: hoverScale },
    transition: spring,
    className: cn(BASE, className),
  } as const;

  if (asChild) {
    return (
      <Slot className={className} {...(props as React.HTMLAttributes<HTMLElement>)}>
        {props.children as React.ReactNode}
      </Slot>
    );
  }

  return <motion.button {...motionProps} {...props} />;
}
