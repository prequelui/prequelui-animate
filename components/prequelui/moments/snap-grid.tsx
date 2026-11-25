"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  clamp,
  cn,
  localPoint,
  springSnap,
  surface,
  useHydratedReducedMotion,
  usePreviewPointer,
  type MomentProps,
} from "./shared";

const SIZE = 5;
const CELL = 32;

export function SnapGrid({ className, preview }: MomentProps) {
  const [point, setPoint] = usePreviewPointer(preview, SIZE * CELL, SIZE * CELL);
  const reduce = useHydratedReducedMotion();

  const targetX = Math.round(point.x / CELL) * CELL;
  const targetY = Math.round(point.y / CELL) * CELL;

  const dots = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      const x = column * CELL + CELL / 2;
      const y = row * CELL + CELL / 2;
      const dx = targetX - x;
      const dy = targetY - y;
      const distance = Math.hypot(dx, dy);
      const pull = clamp(1 - distance / (CELL * 2.1), 0, 1);
      dots.push({
        key: `${row}-${column}`,
        x,
        y,
        offsetX: dx * pull * 0.28,
        offsetY: dy * pull * 0.28,
        scale: 1 + pull * 0.75,
        opacity: 0.35 + pull * 0.65,
      });
    }
  }

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    setPoint(localPoint(event, event.currentTarget));
  };

  const key = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? CELL * 2 : CELL;
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
      aria-label="Snap grid, use arrow keys to move the magnet"
      onKeyDown={key}
      className={cn(
        surface,
        "cursor-crosshair overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      )}
    >
      <div
        className="relative"
        onPointerMove={move}
        onPointerLeave={() => setPoint({ x: SIZE * CELL / 2, y: SIZE * CELL / 2 })}
        style={{ width: SIZE * CELL, height: SIZE * CELL }}
      >
        {dots.map((dot) => (
          <motion.span
            key={dot.key}
            className="absolute size-[6px] rounded-full bg-white"
            style={{ left: dot.x - 3, top: dot.y - 3 }}
            animate={
              reduce
                ? { x: 0, y: 0, scale: 1, opacity: 0.6 }
                : {
                    x: dot.offsetX,
                    y: dot.offsetY,
                    scale: dot.scale,
                    opacity: dot.opacity,
                  }
            }
            transition={reduce ? { duration: 0 } : springSnap}
          />
        ))}
        <motion.span
          aria-hidden="true"
          className="absolute left-0 top-0 size-4 rounded-full border border-white/40"
          animate={{ x: targetX - 8, y: targetY - 8, opacity: reduce ? 0 : 1 }}
          transition={reduce ? { duration: 0 } : springSnap}
        />
      </div>
    </div>
  );
}
