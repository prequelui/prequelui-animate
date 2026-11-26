"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  cn,
  springBounce,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

export function Bookmark({ className, preview }: MomentProps) {
  const [saved, setSaved] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1100, 2600);
  const on = preview ? pulse : saved;

  return (
    <div className={cn(surface, "flex-col gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Bookmark this page"
        onClick={() => setSaved((value) => !value)}
        className="group flex h-[88px] w-[88px] items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ perspective: 420 }}
      >
        <motion.svg
          width="50"
          height="68"
          viewBox="0 0 50 68"
          animate={
            reduce
              ? { rotateY: 0, y: 0, scale: 1 }
              : { rotateY: on ? 26 : 0, y: on ? 2 : 0, scale: on ? 1.04 : 1 }
          }
          transition={reduce ? { duration: 0 } : springSoft}
          className="drop-shadow-[0_12px_22px_rgba(0,0,0,.45)]"
        >
          <motion.path
            d="M7 6 H43 V62 L25 49 L7 62 Z"
            fill={on ? "#ffffff" : "rgba(255,255,255,.06)"}
            stroke="rgba(255,255,255,.68)"
            strokeWidth="2"
            strokeLinejoin="round"
            animate={{ fill: on ? "#ffffff" : "rgba(255,255,255,.06)" }}
            transition={{ duration: reduce ? 0 : 0.26 }}
          />
          <motion.path
            d="M7 6 L14 6 L14 62 L7 62 Z"
            fill="rgba(0,0,0,.18)"
            stroke="none"
            initial={false}
            animate={{ opacity: on ? 0.55 : 0 }}
            transition={{ duration: reduce ? 0 : 0.24 }}
          />
          <motion.path
            d="M17 21 H35"
            fill="none"
            stroke={on ? "#111114" : "rgba(255,255,255,.5)"}
            strokeWidth="2"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: on ? 1 : 0.32, opacity: on ? 1 : 0.6 }}
            transition={{ duration: reduce ? 0 : 0.3 }}
          />
          <motion.path
            d="M17 30 H35"
            fill="none"
            stroke={on ? "#111114" : "rgba(255,255,255,.5)"}
            strokeWidth="2"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: on ? 1 : 0.32, opacity: on ? 1 : 0.6 }}
            transition={{ duration: reduce ? 0 : 0.3, delay: reduce ? 0 : 0.06 }}
          />
        </motion.svg>
      </button>
      <motion.span
        key={on ? "saved" : "idle"}
        initial={reduce ? false : { opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? { duration: 0 } : springBounce}
        className="text-[13px] uppercase tracking-[0.18em] text-white/45"
      >
        {on ? "Saved" : "Save"}
      </motion.span>
    </div>
  );
}
