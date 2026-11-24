"use client";

import * as React from "react";
import {
  motion,
  type HTMLMotionProps,
  type Transition,
  type Variant,
} from "motion/react";
import { Slot, useReduceMotion, useTempoTransition } from "../motion";
import { entranceSpring, useInViewEffect, type SlideDirection } from "./shared";

export type { SlideDirection };

export type SlideProps = HTMLMotionProps<"div"> & {
  children?: React.ReactNode;
  delay?: number;
  direction?: SlideDirection;
  offset?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: Transition;
  asChild?: boolean;
};

export function Slide({
  children,
  delay = 0,
  direction = "up",
  offset = 100,
  inView = false,
  inViewOnce = true,
  inViewMargin = "0px",
  transition,
  asChild = false,
  ...props
}: SlideProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useInViewEffect(ref, inView, inViewOnce, inViewMargin);
  const reduce = useReduceMotion();
  const base = useTempoTransition(transition ?? entranceSpring);
  const Component = (asChild ? Slot : motion.div) as React.ElementType;

  const axis = direction === "up" || direction === "down" ? "y" : "x";
  const hidden: Variant = reduce
    ? { opacity: 0 }
    : {
        [axis]:
          direction === "right" || direction === "down" ? -offset : offset,
      };
  const shown: Variant = reduce ? { opacity: 1 } : { [axis]: 0 };

  return (
    <Component
      ref={ref}
      data-slot="slide"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      exit="hidden"
      variants={{ hidden, visible: shown }}
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

export type SlideListProps = Omit<SlideProps, "children"> & {
  children: React.ReactElement | React.ReactElement[];
  holdDelay?: number;
};

export function Slides({
  children,
  delay = 0,
  holdDelay = 0,
  ...props
}: SlideListProps) {
  return (
    <>
      {React.Children.toArray(children).map((child, index) => (
        <Slide key={index} delay={delay + index * holdDelay} {...props}>
          {child as React.ReactElement}
        </Slide>
      ))}
    </>
  );
}
