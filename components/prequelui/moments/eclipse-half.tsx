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

export function EclipseHalf({ className, preview }: MomentProps) {
  const [eclipsed, setEclipsed] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1300, 2800);
  const on = preview ? pulse : eclipsed;

  return (
    <div className={cn(surface, "flex-col gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Eclipse the light"
        onClick={() => setEclipsed((value) => !value)}
        className="relative flex size-[90px] items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#0b0b0e] outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <motion.span
          aria-hidden="true"
          className="absolute size-[56px] rounded-full bg-white"
          style={{ boxShadow: "0 0 34px 8px rgba(255,255,255,.32)" }}
          animate={{ scale: on ? [1, 1.04, 1] : 1, opacity: on ? 0.55 : 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2.4, repeat: on ? Infinity : 0, ease: "easeInOut" }
          }
        />
        <motion.span
          aria-hidden="true"
          className="absolute size-[56px] rounded-full bg-[#0b0b0e]"
          style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.12)" }}
          animate={{ x: on ? 27 : 76 }}
          transition={reduce ? { duration: 0 } : springSoft}
        />
        <span
          aria-live="polite"
          className="absolute bottom-1.5 text-[13px] uppercase tracking-[0.12em] text-white/40"
        >
          {on ? "Eclipse" : "Sun"}
        </span>
      </button>
    </div>
  );
}
