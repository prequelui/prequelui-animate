"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { Slot, useTempoTransition } from "../motion";
import { entranceSpring, useInViewEffect } from "./shared";

export type FadeProps = HTMLMotionProps<"div"> & {
  children?: React.ReactNode;
  delay?: number;
  initialOpacity?: number;
  opacity?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: Transition;
  asChild?: boolean;
};

export function Fade({
  children,
  delay = 0,
  initialOpacity = 0,
  opacity = 1,
  inView = false,
  inViewOnce = true,
  inViewMargin = "0px",
  transition,
  asChild = false,
  ...props
}: FadeProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useInViewEffect(ref, inView, inViewOnce, inViewMargin);
  const base = useTempoTransition(transition ?? entranceSpring);
  const Component = (asChild ? Slot : motion.div) as React.ElementType;

  return (
    <Component
      ref={ref}
      data-slot="fade"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="hidden"
      variants={{
        hidden: { opacity: initialOpacity },
        visible: { opacity },
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

export type FadeListProps = Omit<FadeProps, "children"> & {
  children: React.ReactElement | React.ReactElement[];
  holdDelay?: number;
};

export function Fades({
  children,
  delay = 0,
  holdDelay = 0,
  ...props
}: FadeListProps) {
  return (
    <>
      {React.Children.toArray(children).map((child, index) => (
        <Fade key={index} delay={delay + index * holdDelay} {...props}>
          {child as React.ReactElement}
        </Fade>
      ))}
    </>
  );
}
