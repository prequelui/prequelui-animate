"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  clamp,
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const HEIGHT = 86;
const WAVE = 32;

export function TideProgress({ className, preview }: MomentProps) {
  const [level, setLevel] = useState(38);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1600, 3200);
  const shown = preview ? (pulse ? 92 : 28) : level;

  const move = (event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setLevel(clamp(((event.clientX - rect.left) / rect.width) * 100, 4, 100));
  };

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setLevel((current) => Math.min(100, current + 8));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setLevel((current) => Math.max(4, current - 8));
    }
  };

  return (
    <div className={cn(surface, className)}>
      <div
        role="progressbar"
        tabIndex={0}
        aria-label="Tide progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(shown)}
        aria-valuetext={`${Math.round(shown)} percent`}
        onPointerMove={move}
        onKeyDown={key}
        className="relative h-[86px] w-[206px] overflow-hidden rounded-xl border border-white/12 bg-white/4 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <motion.div
          className="absolute inset-0 bg-white/25"
          animate={{ clipPath: `inset(${100 - shown}% 0 0 0)` }}
          transition={reduce ? { duration: 0 } : springSoft}
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-8"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent 0 6px, rgba(255,255,255,.55) 6px 9px)",
            maskImage: "linear-gradient(to bottom, black, transparent)",
          }}
          animate={
            reduce
              ? { x: 0, y: (HEIGHT * (100 - shown)) / 100 - WAVE / 2 }
              : {
                  x: [0, -18, 0],
                  y: (HEIGHT * (100 - shown)) / 100 - WAVE / 2,
                }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  x: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
                  y: springSoft,
                }
          }
        />
        <span className="absolute bottom-2 left-3 text-[13px] uppercase tracking-[0.16em] text-white/50">
          Tide {Math.round(shown)}%
        </span>
      </div>
    </div>
  );
}
