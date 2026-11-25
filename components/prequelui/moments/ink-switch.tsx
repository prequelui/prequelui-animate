"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const TRACK = 72;
const PAD = 4;
const KNOB = 28;
const INK = TRACK - PAD * 2;

export function InkSwitch({ className, preview }: MomentProps) {
  const [on, setOn] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1100, 2600);
  const filled = preview ? pulse : on;

  return (
    <div className={cn(surface, "flex-col gap-4", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={filled}
        aria-label="Ink switch"
        onClick={() => setOn((value) => !value)}
        className="relative h-9 w-[72px] overflow-hidden rounded-full border border-white/12 bg-white/5 p-1 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <motion.span
          aria-hidden="true"
          className="absolute left-1 top-1 h-7 bg-white"
          style={{ originX: 0, width: INK }}
          animate={
            reduce
              ? { scaleX: filled ? 1 : KNOB / INK, borderRadius: 16 }
              : {
                  scaleX: filled ? 1 : KNOB / INK,
                  borderRadius: filled ? 18 : 48,
                }
          }
          transition={reduce ? { duration: 0 } : springSoft}
        />
        {[0.28, 0.52, 0.74].map((position, index) => (
          <motion.span
            key={position}
            aria-hidden="true"
            className="absolute top-1/2 size-1 -translate-y-1/2 rounded-full bg-black/25"
            style={{ left: `${position * 100}%` }}
            animate={reduce ? { opacity: 0 } : { opacity: filled ? [0, 0, 0.5] : 0, scale: filled ? 1 : 0.4 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.5, delay: index * 0.06, ease: "easeOut" }
            }
          />
        ))}
        <motion.span
          aria-hidden="true"
          className="absolute left-1 top-1 size-7 rounded-full shadow-[0_2px_8px_rgba(0,0,0,.35)]"
          animate={
            reduce
              ? {
                  x: filled ? KNOB + 8 : 0,
                  backgroundColor: filled ? "#111114" : "#ffffff",
                }
              : {
                  x: filled ? KNOB + 8 : 0,
                  backgroundColor: filled ? "#111114" : "#ffffff",
                }
          }
          transition={reduce ? { duration: 0 } : springSoft}
        />
        <span className="sr-only">{filled ? "On" : "Off"}</span>
      </button>
      <span className="text-[12px] uppercase tracking-[0.18em] text-white/45">
        {filled ? "Inked" : "Dry"}
      </span>
    </div>
  );
}
