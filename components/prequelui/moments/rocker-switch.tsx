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

export function RockerSwitch({ className, preview }: MomentProps) {
  const [on, setOn] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1100, 2600);
  const up = preview ? pulse : on;

  return (
    <div className={cn(surface, "flex-col gap-4", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={up}
        aria-label={`Rocker switch, ${up ? "on" : "off"}`}
        onClick={() => setOn((value) => !value)}
        className="flex h-[62px] w-[92px] items-center justify-center rounded-2xl border border-white/12 bg-[#111114] p-2 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ perspective: 500 }}
      >
        <motion.span
          className="relative flex h-[42px] w-[68px] items-center overflow-hidden rounded-xl border border-white/10"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateX: up ? 18 : -18 }}
          transition={reduce ? { duration: 0 } : springSoft}
        >
          <span className="flex h-1/2 w-full items-center justify-center bg-white/18 text-[13px] text-white/50">
            0
          </span>
          <span className="flex h-1/2 w-full items-center justify-center bg-white text-[13px] font-semibold text-black">
            I
          </span>
          <motion.span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[2px] w-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/25"
            animate={{ opacity: up ? 0.2 : 0.7 }}
          />
        </motion.span>
      </button>
      <span
        aria-live="polite"
        className="text-[13px] uppercase tracking-[0.18em] text-white/45"
      >
        {up ? "On" : "Off"}
      </span>
    </div>
  );
}
