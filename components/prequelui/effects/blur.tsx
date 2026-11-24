"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { Slot, useReduceMotion, useTempoTransition } from "../motion";
import { entranceSpring, useInViewEffect } from "./shared";

export type BlurProps = HTMLMotionProps<"div"> & {
  children?: React.ReactNode;
  delay?: number;
  initialBlur?: number;
  blur?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: Transition;
  asChild?: boolean;
};

export function Blur({
  children,
  delay = 0,
  initialBlur = 10,
  blur = 0,
  inView = false,
  inViewOnce = true,
  inViewMargin = "0px",
  transition,
  asChild = false,
  ...props
}: BlurProps) {
  const reduce = useReduceMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useInViewEffect(ref, inView, inViewOnce, inViewMargin);
  const base = useTempoTransition(transition ?? entranceSpring);
  const Component = (asChild ? Slot : motion.div) as React.ElementType;

  return (
    <Component
      ref={ref}
      data-slot="blur"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="hidden"
      variants={{
        hidden: { filter: `blur(${reduce ? 0 : initialBlur}px)` },
        visible: { filter: `blur(${blur}px)` },
      }}
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

export type BlurListProps = Omit<BlurProps, "children"> & {
  children: React.ReactElement | React.ReactElement[];
  holdDelay?: number;
};

export function Blurs({
  children,
  delay = 0,
  holdDelay = 0,
  ...props
}: BlurListProps) {
  return (
    <>
      {React.Children.toArray(children).map((child, index) => (
        <Blur key={index} delay={delay + index * holdDelay} {...props}>
          {child as React.ReactElement}
        </Blur>
      ))}
    </>
  );
}
