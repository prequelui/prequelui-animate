"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ROW = 26;

export function Odometer({ className, preview }: MomentProps) {
  const [value, setValue] = useState(128);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 900, 2400);

  useEffect(() => {
    if (pulse) setValue((current) => (current + 37) % 1000);
  }, [pulse]);

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowUp" || event.key === "ArrowRight") {
      event.preventDefault();
      setValue((current) => (current + 1) % 1000);
    }
    if (event.key === "ArrowDown" || event.key === "ArrowLeft") {
      event.preventDefault();
      setValue((current) => (current - 1 + 1000) % 1000);
    }
  };

  return (
    <div className={cn(surface, className)}>
      <button
        type="button"
        aria-label={`Odometer, current value ${value}. Click or use arrow keys to change it.`}
        onClick={() => setValue((current) => (current + 37) % 1000)}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          setValue((current) => (current + 37) % 1000);
        }}
        onKeyDown={key}
        className="flex items-center gap-1 rounded-xl border border-white/12 bg-[#111114] px-4 py-3 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {[100, 10, 1].map((place) => {
          const digit = Math.floor(value / place) % 10;
          return (
            <span
              key={place}
              className="relative block h-[26px] w-[18px] overflow-hidden"
              aria-hidden="true"
            >
              <motion.span
                className="absolute inset-x-0 top-0 flex flex-col items-center"
                animate={{ y: -digit * ROW }}
                transition={reduce ? { duration: 0 } : springSoft}
              >
                {DIGITS.map((number) => (
                  <span
                    key={number}
                    className="flex h-[26px] items-center justify-center text-[20px] tabular-nums text-white"
                  >
                    {number}
                  </span>
                ))}
              </motion.span>
            </span>
          );
        })}
        <span aria-live="polite" className="sr-only">
          {value}
        </span>
      </button>
    </div>
  );
}
