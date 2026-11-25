"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  clamp,
  cn,
  localPoint,
  surface,
  useHydratedReducedMotion,
  usePreviewPointer,
  type MomentProps,
} from "./shared";

const DOTS = Array.from({ length: 7 }, (_, index) => index);
const WIDTH = 190;
const HEIGHT = 58;

export function WormDots({ className, preview }: MomentProps) {
  const [point, setPoint] = usePreviewPointer(preview, WIDTH, HEIGHT);
  const [dir, setDir] = useState(1);
  const lastX = useRef(WIDTH / 2);
  const reduce = useHydratedReducedMotion();

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    const next = localPoint(event, event.currentTarget);
    const direction = next.x >= lastX.current ? 1 : -1;
    if (direction !== dir) setDir(direction);
    lastX.current = next.x;
    setPoint(next);
  };

  const key = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const dx = event.key === "ArrowRight" ? 16 : event.key === "ArrowLeft" ? -16 : 0;
    const dy = event.key === "ArrowDown" ? 10 : event.key === "ArrowUp" ? -10 : 0;
    if (dx !== 0) {
      const direction = dx > 0 ? 1 : -1;
      if (direction !== dir) setDir(direction);
    }
    setPoint((current) => ({
      x: clamp(current.x + dx, 7, WIDTH - 7),
      y: clamp(current.y + dy, 12, HEIGHT - 12),
    }));
  };

  const headX = clamp(point.x, 18, WIDTH - 18);
  const headY = clamp(point.y, 14, HEIGHT - 14);

  return (
    <div
      role="group"
      tabIndex={0}
      aria-label="Worm dots, move the pointer or use arrow keys"
      onKeyDown={key}
      className={cn(
        surface,
        "overflow-hidden rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      )}
    >
      <div
        className="relative h-[58px] w-[190px] touch-none"
        onPointerMove={move}
        onPointerLeave={() => {
          lastX.current = WIDTH / 2;
          setPoint({ x: WIDTH / 2, y: HEIGHT / 2 });
        }}
      >
        {DOTS.map((index) => {
          const size = 12 - index * 0.65;
          const targetX =
            (reduce ? 64 + index * 11 : headX - index * 12 * dir) - size / 2;
          const targetY = (reduce ? HEIGHT / 2 : headY) - size / 2;
          return (
            <motion.span
              key={index}
              className="absolute left-0 top-0 rounded-full bg-white"
              style={{
                width: size,
                height: size,
                opacity: 1 - index * 0.07,
              }}
              animate={{ x: targetX, y: targetY }}
              transition={
                reduce
                  ? { duration: 0 }
                  : {
                      type: "spring",
                      stiffness: 680 - index * 70,
                      damping: 30 - index * 1.4,
                      mass: 1,
                    }
              }
            >
              {index === 0 ? (
                <>
                  <span
                    className="absolute top-[38%] size-[2px] rounded-full bg-black/70"
                    style={{ left: "28%" }}
                  />
                  <span
                    className="absolute top-[38%] size-[2px] rounded-full bg-black/70"
                    style={{ right: "28%" }}
                  />
                </>
              ) : null}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}
