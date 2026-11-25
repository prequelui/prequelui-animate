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

const DROPS = [
  { x: -38, size: 26, tone: "bg-white/80" },
  { x: 0, size: 34, tone: "bg-white" },
  { x: 38, size: 24, tone: "bg-white/60" },
];

export function MergeDrops({ className, preview }: MomentProps) {
  const [merged, setMerged] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1200, 2600);
  const joined = preview ? pulse : merged;

  return (
    <div className={cn(surface, "flex-col gap-4", className)}>
      <button
        type="button"
        aria-pressed={joined}
        aria-label="Merge the drops"
        onClick={() => setMerged((value) => !value)}
        className="relative flex h-[74px] w-[150px] items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ filter: "contrast(1.35) blur(0.1px)" }}
      >
        {DROPS.map((drop, index) => (
          <motion.span
            key={index}
            className={cn("absolute rounded-full", drop.tone)}
            style={{ width: drop.size, height: drop.size }}
            animate={
              reduce
                ? { x: joined ? 0 : drop.x, scale: 1 }
                : {
                    x: joined ? drop.x * 0.16 : drop.x,
                    scale: joined ? 1.12 : 1,
                  }
            }
            transition={
              reduce ? { duration: 0 } : { ...springSoft, delay: index * 0.02 }
            }
          />
        ))}
      </button>
      <span className="text-[12px] uppercase tracking-[0.18em] text-white/45">
        {joined ? "One bead" : "Three drops"}
      </span>
    </div>
  );
}
