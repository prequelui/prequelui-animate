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

export type EffectSlide = { direction?: SlideDirection; offset?: number };
export type EffectFade = { initialOpacity?: number; opacity?: number };
export type EffectZoom = { initialScale?: number; scale?: number };
export type EffectBlur = { initialBlur?: number; blur?: number };

export type EffectProps = HTMLMotionProps<"div"> & {
  children?: React.ReactNode;
  delay?: number;
  blur?: EffectBlur | boolean;
  slide?: EffectSlide | boolean;
  fade?: EffectFade | boolean;
  zoom?: EffectZoom | boolean;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: Transition;
  asChild?: boolean;
};

export function Effect({
  children,
  delay = 0,
  blur = false,
  slide = false,
  fade = false,
  zoom = false,
  inView = false,
  inViewOnce = true,
  inViewMargin = "0px",
  transition,
  asChild = false,
  ...props
}: EffectProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useInViewEffect(ref, inView, inViewOnce, inViewMargin);
  const reduce = useReduceMotion();
  const base = useTempoTransition(transition ?? entranceSpring);
  const Component = (asChild ? Slot : motion.div) as React.ElementType;

  const hidden: Variant = {};
  const shown: Variant = {};

  if (slide && !reduce) {
    const config = typeof slide === "object" ? slide : {};
    const direction: SlideDirection = config.direction ?? "up";
    const offset = config.offset ?? 100;
    const axis = direction === "up" || direction === "down" ? "y" : "x";
    hidden[axis] = direction === "right" || direction === "down" ? -offset : offset;
    shown[axis] = 0;
  }

  if (fade) {
    const config = typeof fade === "object" ? fade : {};
    hidden.opacity = config.initialOpacity ?? 0;
    shown.opacity = config.opacity ?? 1;
  }

  if (zoom && !reduce) {
    const config = typeof zoom === "object" ? zoom : {};
    hidden.scale = config.initialScale ?? 0.5;
    shown.scale = config.scale ?? 1;
  }

  if (blur) {
    const config = typeof blur === "object" ? blur : {};
    hidden.filter = `blur(${reduce ? 0 : config.initialBlur ?? 10}px)`;
    shown.filter = `blur(${config.blur ?? 0}px)`;
  }

  if (reduce && (slide || zoom) && shown.opacity === undefined) {
    hidden.opacity = (fade && typeof fade === "object" ? fade.initialOpacity : 0) ?? 0;
    shown.opacity = (fade && typeof fade === "object" ? fade.opacity : 1) ?? 1;
  }

  return (
    <Component
      ref={ref}
      data-slot="effect"
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

export type EffectsProps = Omit<EffectProps, "children"> & {
  children: React.ReactElement | React.ReactElement[];
  holdDelay?: number;
};

export function Effects({
  children,
  delay = 0,
  holdDelay = 0,
  ...props
}: EffectsProps) {
  return (
    <>
      {React.Children.toArray(children).map((child, index) => (
        <Effect key={index} delay={delay + index * holdDelay} {...props}>
          {child as React.ReactElement}
        </Effect>
      ))}
    </>
  );
}
