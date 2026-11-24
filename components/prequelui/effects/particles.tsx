"use client";

import * as React from "react";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "../motion";
import { useInViewEffect } from "./shared";

type Side = "top" | "bottom" | "left" | "right";
type Align = "start" | "center" | "end";

type ParticlesContextValue = {
  animate: boolean;
  inView: boolean;
};

const ParticlesContext = React.createContext<ParticlesContextValue | null>(null);

export type ParticlesProps = HTMLMotionProps<"div"> & {
  animate?: boolean;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  children: React.ReactNode;
};

export function Particles({
  animate = true,
  inView = false,
  inViewOnce = true,
  inViewMargin = "0px",
  children,
  className,
  style,
  ...props
}: ParticlesProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const visible = useInViewEffect(ref, inView, inViewOnce, inViewMargin);
  const value = React.useMemo(
    () => ({ animate, inView: visible }),
    [animate, visible],
  );

  return (
    <ParticlesContext.Provider value={value}>
      <motion.div
        ref={ref}
        data-slot="particles"
        className={cn("relative", className)}
        style={style}
        {...props}
      >
        {children}
      </motion.div>
    </ParticlesContext.Provider>
  );
}

export type ParticlesEffectProps = Omit<HTMLMotionProps<"div">, "children"> & {
  side?: Side;
  align?: Align;
  count?: number;
  radius?: number;
  spread?: number;
  duration?: number;
  holdDelay?: number;
  sideOffset?: number;
  alignOffset?: number;
  delay?: number;
  size?: number;
  color?: string;
};

export function ParticlesEffect({
  side = "top",
  align = "center",
  count = 6,
  radius = 30,
  spread = 360,
  duration = 0.8,
  holdDelay = 0.05,
  sideOffset = 0,
  alignOffset = 0,
  delay = 0,
  size = 4,
  color = "currentColor",
  className,
  style,
  ...props
}: ParticlesEffectProps) {
  const context = React.useContext(ParticlesContext);
  const animate = context?.animate ?? true;
  const isInView = context?.inView ?? true;
  const reduce = useReduceMotion();

  const vertical = side === "top" || side === "bottom";
  const alignPercent = align === "start" ? "0%" : align === "end" ? "100%" : "50%";

  const top = vertical
    ? side === "top"
      ? `calc(0% - ${sideOffset}px)`
      : `calc(100% + ${sideOffset}px)`
    : `calc(${alignPercent} + ${alignOffset}px)`;

  const left = vertical
    ? `calc(${alignPercent} + ${alignOffset}px)`
    : side === "left"
      ? `calc(0% - ${sideOffset}px)`
      : `calc(100% + ${sideOffset}px)`;

  const fullCircle = spread % 360 === 0;
  const step =
    (spread * (Math.PI / 180)) / (fullCircle ? Math.max(1, count) : Math.max(1, count - 1));

  const active = animate && isInView && !reduce;

  return (
    <AnimatePresence>
      {active
        ? Array.from({ length: count }).map((_, index) => {
            const angle = index * step;
            const x = Math.round(Math.cos(angle) * radius * 100) / 100;
            const y = Math.round(Math.sin(angle) * radius * 100) / 100;
            return (
              <motion.div
                key={index}
                {...props}
                aria-hidden="true"
                className={cn("pointer-events-none absolute z-10 rounded-full", className)}
                style={{
                  top,
                  left,
                  width: size,
                  height: size,
                  marginLeft: -size / 2,
                  marginTop: -size / 2,
                  background: color,
                  ...style,
                }}
                initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                animate={{
                  x,
                  y,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration,
                  delay: delay + index * holdDelay,
                  ease: "easeOut",
                  ...(props.transition as object),
                }}
              />
            );
          })
        : null}
    </AnimatePresence>
  );
}
