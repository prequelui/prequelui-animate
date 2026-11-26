"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  clamp,
  cn,
  localPoint,
  surface,
  useHydratedReducedMotion,
  usePreviewPointer,
  type MomentProps,
} from "./shared";

const BARS = 24;
const WIDTH = 196;

export function ScrubWave({ className, preview }: MomentProps) {
  const [point, setPoint] = usePreviewPointer(preview, WIDTH, 90);
  const reduce = useHydratedReducedMotion();
  const ratio = clamp(point.x / WIDTH, 0, 1);

  const move = (event: React.PointerEvent) => {
    setPoint(localPoint(event, event.currentTarget as HTMLElement));
  };

  const start = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    move(event);
  };

  const key = (event: React.KeyboardEvent) => {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    if (event.key === "Home") {
      setPoint((current) => ({ ...current, x: 0 }));
      return;
    }
    if (event.key === "End") {
      setPoint((current) => ({ ...current, x: WIDTH }));
      return;
    }
    const delta = event.key === "ArrowRight" ? 12 : -12;
    setPoint((current) => ({ ...current, x: clamp(current.x + delta, 0, WIDTH) }));
  };

  return (
    <div className={cn(surface, className)}>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Scrub the wave"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuetext={`Playhead at ${Math.round(ratio * 100)} percent`}
        onPointerDown={start}
        onPointerMove={move}
        onKeyDown={key}
        className="relative h-[92px] w-[206px] cursor-ew-resize touch-none overflow-hidden rounded-xl border border-white/10 bg-white/4 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <div className="absolute inset-x-2 top-1/2 flex h-[58px] -translate-y-1/2 items-center gap-[3px]">
          {Array.from({ length: BARS }, (_, index) => {
            const distance = Math.abs(index / BARS - ratio);
            const closeness = clamp(1 - distance * 5, 0, 1);
            const height = 10 + closeness * 38 + Math.abs(Math.sin(index * 1.3)) * 8;
            return (
              <motion.span
                key={index}
                className="w-[3px] flex-1 rounded-full bg-white"
                style={{ height: 50, transformOrigin: "center" }}
                animate={{
                  scaleY: height / 50,
                  opacity: 0.25 + closeness * 0.75,
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.14, ease: "linear" }}
              />
            );
          })}
        </div>
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-3 w-px bg-white"
          animate={{ x: ratio * WIDTH }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
        />
        <span className="absolute bottom-1.5 left-2 text-[13px] tabular-nums text-white/40">
          {Math.round(ratio * 100)}%
        </span>
      </div>
    </div>
  );
}
