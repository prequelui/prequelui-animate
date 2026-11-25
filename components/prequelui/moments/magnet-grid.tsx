"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  clamp,
  cn,
  localPoint,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPointer,
  type MomentProps,
} from "./shared";

const SIZE = 6;
const CELL = 28;

export function MagnetGrid({ className, preview }: MomentProps) {
  const [point, setPoint] = usePreviewPointer(preview, SIZE * CELL, SIZE * CELL);
  const reduce = useHydratedReducedMotion();

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    setPoint(localPoint(event, event.currentTarget));
  };

  const key = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    const delta =
      event.key === "ArrowLeft"
        ? [-CELL, 0]
        : event.key === "ArrowRight"
          ? [CELL, 0]
          : event.key === "ArrowUp"
            ? [0, -CELL]
            : [0, CELL];
    setPoint((current) => ({
      x: clamp(current.x + delta[0], 0, SIZE * CELL),
      y: clamp(current.y + delta[1], 0, SIZE * CELL),
    }));
  };

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Magnet grid, move the pointer over the dots"
      onKeyDown={key}
      className={cn(
        surface,
        "cursor-crosshair rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      )}
    >
      <div
        className="relative"
        onPointerMove={move}
        onPointerLeave={() => setPoint({ x: SIZE * CELL / 2, y: SIZE * CELL / 2 })}
        style={{ width: SIZE * CELL, height: SIZE * CELL }}
      >
        {Array.from({ length: SIZE * SIZE }, (_, index) => {
          const column = index % SIZE;
          const row = Math.floor(index / SIZE);
          const x = column * CELL + CELL / 2;
          const y = row * CELL + CELL / 2;
          const dx = point.x - x;
          const dy = point.y - y;
          const distance = Math.hypot(dx, dy);
          const pull = clamp(1 - distance / 90, 0, 1);
          return (
            <motion.span
              key={index}
              className="absolute size-[5px] rounded-full bg-white"
              style={{ left: x - 2.5, top: y - 2.5 }}
              animate={
                reduce
                  ? { x: 0, y: 0, scale: 1, opacity: 0.45 }
                  : {
                      x: dx * pull * 0.34,
                      y: dy * pull * 0.34,
                      scale: 1 + pull * 1.15,
                      opacity: 0.35 + pull * 0.65,
                    }
              }
              transition={reduce ? { duration: 0 } : springSoft}
            />
          );
        })}
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border border-white/25"
          style={{ left: point.x - 26, top: point.y - 26, width: 52, height: 52 }}
          animate={{ scale: reduce ? 0 : [0.9, 1.08, 0.9], opacity: reduce ? 0 : 1 }}
          transition={reduce ? { duration: 0 } : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
