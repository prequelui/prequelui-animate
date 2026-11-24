"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { Slot, useReduceMotion, useTempoTransition } from "../motion";
import { entranceSpring, useInViewEffect } from "./shared";

export type ZoomProps = HTMLMotionProps<"div"> & {
  children?: React.ReactNode;
  delay?: number;
  initialScale?: number;
  scale?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: Transition;
  asChild?: boolean;
};

export function Zoom({
  children,
  delay = 0,
  initialScale = 0.5,
  scale = 1,
  inView = false,
  inViewOnce = true,
  inViewMargin = "0px",
  transition,
  asChild = false,
  ...props
}: ZoomProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useInViewEffect(ref, inView, inViewOnce, inViewMargin);
  const reduce = useReduceMotion();
  const base = useTempoTransition(transition ?? entranceSpring);
  const Component = (asChild ? Slot : motion.div) as React.ElementType;

  return (
    <Component
      ref={ref}
      data-slot="zoom"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="hidden"
      variants={
        reduce
          ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
          : { hidden: { scale: initialScale }, visible: { scale } }
      }
      transition={{
        ...base,
        delay: (base.delay ?? 0) + delay / 1000,
      }}
      {...props}
    >
      {children}
    </Component>
  );
}

export type ZoomListProps = Omit<ZoomProps, "children"> & {
  children: React.ReactElement | React.ReactElement[];
  holdDelay?: number;
};

export function Zooms({
  children,
  delay = 0,
  holdDelay = 0,
  ...props
}: ZoomListProps) {
  return (
    <>
      {React.Children.toArray(children).map((child, index) => (
        <Zoom key={index} delay={delay + index * holdDelay} {...props}>
          {child as React.ReactElement}
        </Zoom>
      ))}
    </>
  );
}
