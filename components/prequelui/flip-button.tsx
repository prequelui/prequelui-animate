"use client";

import * as React from "react";
import { motion, type HTMLMotionProps, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  faceSpring,
  pressSpring,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

export type FlipDirection = "top" | "bottom" | "left" | "right";

type FlipContextValue = {
  from: FlipDirection;
  vertical: boolean;
  axis: "rotateX" | "rotateY";
};

const FlipContext = React.createContext<FlipContextValue | null>(null);

function useFlip() {
  const value = React.useContext(FlipContext);
  if (!value) throw new Error("FlipButtonFace must be used inside FlipButton");
  return value;
}

export type FlipButtonProps = HTMLMotionProps<"button"> & {
  from?: FlipDirection;
  tapScale?: number;
  transition?: Transition;
};

export function FlipButton({
  from = "top",
  tapScale = 0.97,
  transition,
  className,
  style,
  ...props
}: FlipButtonProps) {
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? pressSpring);
  const vertical = from === "top" || from === "bottom";
  const value = React.useMemo(
    () => ({ from, vertical, axis: (vertical ? "rotateX" : "rotateY") as "rotateX" | "rotateY" }),
    [from, vertical],
  );

  return (
    <FlipContext.Provider value={value}>
      <motion.button
        data-slot="flip-button"
        data-from={from}
        initial={reduce ? undefined : { scale: 1 }}
        whileTap={reduce ? undefined : { scale: tapScale }}
        whileHover="hover"
        variants={reduce ? undefined : { initial: { scale: 1 } }}
        transition={spring}
        className={cn(
          "inline-grid place-items-center rounded-lg text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          className,
        )}
        style={{ perspective: 1000, ...style }}
        {...props}
      />
    </FlipContext.Provider>
  );
}

type FaceProps = HTMLMotionProps<"span"> & { transition?: Transition };

function faceVariant(
  axis: "rotateX" | "rotateY",
  vertical: boolean,
  rotation: number,
  opacity: number,
  offset: string,
): Record<string, string | number> {
  return {
    opacity,
    [axis]: rotation,
    [vertical ? "y" : "x"]: offset,
  };
}

export function FlipButtonFront({
  transition,
  className,
  style,
  ...props
}: FaceProps) {
  const { from, vertical, axis } = useFlip();
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? faceSpring);
  const front = from === "top" || from === "left" ? "50%" : "-50%";

  return (
    <motion.span
      data-slot="flip-button-front"
      variants={{
        initial: faceVariant(axis, vertical, 0, 1, "0%"),
        hover: faceVariant(axis, vertical, reduce ? 0 : 90, 0, reduce ? "0%" : front),
      }}
      transition={spring}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-primary-foreground",
        className,
      )}
      style={{ gridArea: "1 / 1", ...style }}
      {...props}
    />
  );
}

export function FlipButtonBack({
  transition,
  className,
  style,
  ...props
}: FaceProps) {
  const { from, vertical, axis } = useFlip();
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? faceSpring);
  const back = from === "top" || from === "left" ? "-50%" : "50%";

  return (
    <motion.span
      data-slot="flip-button-back"
      aria-hidden="true"
      variants={{
        initial: faceVariant(axis, vertical, reduce ? 0 : 90, 0, reduce ? "0%" : back),
        hover: faceVariant(axis, vertical, 0, 1, "0%"),
      }}
      transition={spring}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-4 text-secondary-foreground",
        className,
      )}
      style={{ gridArea: "1 / 1", ...style }}
      {...props}
    />
  );
}

export function useFlipButton() {
  return useFlip();
}
