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

const SIZE = 4;
const CELL = 34;

export function BlocksScale({ className, preview }: MomentProps) {
  const [point, setPoint] = usePreviewPointer(preview, SIZE * CELL, SIZE * CELL);
  const reduce = useHydratedReducedMotion();

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    setPoint(localPoint(event, event.currentTarget));
  };

  const key = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = CELL;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = moves[event.key];
    if (!delta) return;
    event.preventDefault();
    setPoint((current) => ({
      x: clamp(current.x + delta[0], 0, SIZE * CELL),
      y: clamp(current.y + delta[1], 0, SIZE * CELL),
    }));
  };

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Blocks scale, move the pointer over the grid"
      onKeyDown={key}
      className={cn(
        surface,
        "cursor-crosshair rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      )}
    >
      <div
        className="grid gap-[6px]"
        onPointerMove={move}
        onPointerLeave={() => setPoint({ x: SIZE * CELL / 2, y: SIZE * CELL / 2 })}
        style={{
          gridTemplateColumns: `repeat(${SIZE}, ${CELL - 6}px)`,
        }}
      >
        {Array.from({ length: SIZE * SIZE }, (_, index) => {
          const column = index % SIZE;
          const row = Math.floor(index / SIZE);
          const x = column * CELL + CELL / 2;
          const y = row * CELL + CELL / 2;
          const distance = Math.hypot(point.x - x, point.y - y);
          const closeness = clamp(1 - distance / 90, 0, 1);
          return (
            <motion.span
              key={index}
              className="rounded-[6px] bg-white"
              style={{ width: CELL - 6, height: CELL - 6 }}
              animate={
                reduce
                  ? { scale: 1, opacity: 0.4 }
                  : {
                      scale: 1 + closeness * 0.42,
                      opacity: 0.3 + closeness * 0.7,
                    }
              }
              transition={reduce ? { duration: 0 } : springSoft}
            />
          );
        })}
      </div>
    </div>
  );
}
