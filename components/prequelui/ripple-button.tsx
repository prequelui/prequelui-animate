"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  Slot,
  pressSpring,
  useReduceMotion,
  useTempo,
  useTempoTransition,
} from "./motion";

type Ripple = { id: number; x: number; y: number };
type RippleContextValue = { ripples: Ripple[] };

const RippleContext = React.createContext<RippleContextValue | null>(null);

export type RippleButtonProps = HTMLMotionProps<"button"> & {
  asChild?: boolean;
  hoverScale?: number;
  tapScale?: number;
  transition?: Transition;
};

export function RippleButton({
  asChild = false,
  hoverScale = 1,
  tapScale = 0.97,
  transition,
  onClick,
  className,
  style,
  ...props
}: RippleButtonProps) {
  const reduce = useReduceMotion();
  const tempo = useTempo();
  const spring = useTempoTransition(transition ?? pressSpring);
  const [ripples, setRipples] = React.useState<Ripple[]>([]);
  const idRef = React.useRef(0);
  const timers = React.useRef(new Set<ReturnType<typeof setTimeout>>());

  React.useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((timer) => clearTimeout(timer));
  }, []);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const scaleX = event.currentTarget.offsetWidth / rect.width;
    const scaleY = event.currentTarget.offsetHeight / rect.height;
    const ripple = {
      id: idRef.current++,
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY,
    };
    setRipples((current) => [...current, ripple]);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      setRipples((current) => current.filter((item) => item.id !== ripple.id));
    }, 600 * tempo);
    timers.current.add(timer);
  };

  const shared = {
    "data-slot": "ripple-button",
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event);
      onClick?.(event);
    },
    initial: reduce ? undefined : { scale: 1 },
    whileTap: reduce ? undefined : { scale: tapScale },
    whileHover: reduce || hoverScale === 1 ? undefined : { scale: hoverScale },
    transition: spring,
    className: cn(
      "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground",
      className,
    ),
    style: { position: "relative" as const, ...style },
  };

  if (asChild) {
    return (
      <RippleContext.Provider value={{ ripples }}>
        <Slot {...(props as React.HTMLAttributes<HTMLElement>)}>
          {props.children as React.ReactNode}
        </Slot>
      </RippleContext.Provider>
    );
  }

  return (
    <RippleContext.Provider value={{ ripples }}>
      <motion.button {...shared} {...props} />
    </RippleContext.Provider>
  );
}

export type RippleButtonRipplesProps = {
  color?: string;
  scale?: number;
  transition?: Transition;
};

export function RippleButtonRipples({
  color = "currentColor",
  scale = 10,
  transition,
}: RippleButtonRipplesProps) {
  const context = React.useContext(RippleContext);
  const reduce = useReduceMotion();
  const tween = useTempoTransition(transition ?? { duration: 0.6, ease: "easeOut" });
  if (!context) return null;

  return (
    <>
      {context.ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          aria-hidden="true"
          initial={{ scale: reduce ? scale : 0, opacity: 0.5 }}
          animate={{ scale, opacity: 0 }}
          transition={tween}
          className="pointer-events-none absolute size-5 rounded-full"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            backgroundColor: color,
          }}
        />
      ))}
    </>
  );
}

export function useRippleButton() {
  const value = React.useContext(RippleContext);
  if (!value) throw new Error("useRippleButton must be used inside RippleButton");
  return value;
}
