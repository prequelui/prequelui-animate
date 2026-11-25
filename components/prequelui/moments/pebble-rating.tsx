"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  cn,
  springBounce,
  surface,
  useHydratedReducedMotion,
  usePreviewStep,
  type MomentProps,
} from "./shared";

const STONES = [
  "46% 54% 58% 42% / 55% 45% 55% 45%",
  "58% 42% 48% 52% / 44% 58% 42% 56%",
  "52% 48% 60% 40% / 48% 52% 48% 52%",
  "44% 56% 46% 54% / 58% 44% 56% 44%",
  "56% 44% 54% 46% / 46% 56% 44% 54%",
];

export function PebbleRating({ className, preview }: MomentProps) {
  const [rating, setRating] = useState(3);
  const radioRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useHydratedReducedMotion();
  const previewStep = usePreviewStep(preview, 6, 1200);
  const value = preview ? previewStep : rating;

  const select = (next: number) => {
    const clamped = Math.min(5, Math.max(0, next));
    setRating(clamped);
    radioRefs.current[Math.max(0, clamped - 1)]?.focus();
  };

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      select(rating + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      select(rating - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(1);
    }
    if (event.key === "End") {
      event.preventDefault();
      select(5);
    }
  };

  return (
    <div className={cn(surface, "flex-col gap-4", className)}>
      <div
        role="radiogroup"
        aria-label="Pebble rating"
        onKeyDown={key}
        className="flex items-center gap-2"
      >
        {STONES.map((shape, index) => {
          const filled = index < value;
          return (
            <motion.button
              key={index}
              ref={(node) => {
                radioRefs.current[index] = node;
              }}
              type="button"
              role="radio"
              aria-checked={filled}
              aria-label={`${index + 1} pebble${index === 0 ? "" : "s"}`}
              tabIndex={index === Math.max(0, value - 1) ? 0 : -1}
              onClick={() => setRating(index + 1)}
              whileTap={reduce ? undefined : { scale: 0.82, scaleY: 0.7 }}
              animate={
                reduce
                  ? { scale: 1, opacity: filled ? 1 : 0.28 }
                  : {
                      scale: filled ? 1 : 0.88,
                      opacity: filled ? 1 : 0.28,
                      y: filled ? 0 : 2,
                    }
              }
              transition={reduce ? { duration: 0 } : springBounce}
              className="size-8 bg-white"
              style={{ borderRadius: shape }}
            />
          );
        })}
      </div>
      <span className="text-[12px] uppercase tracking-[0.18em] text-white/45">
        {value} of 5
      </span>
    </div>
  );
}
