"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  cn,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

export function JellyPad({ className, preview }: MomentProps) {
  const [wave, setWave] = useState(0);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 900, 2600);

  useEffect(() => {
    if (pulse) setWave((value) => value + 1);
  }, [pulse]);

  return (
    <div className={cn(surface, className)}>
      <button
        type="button"
        aria-label="Press the jelly pad"
        onClick={() => setWave((value) => value + 1)}
        style={{ width: 160, height: 112 }}
        className="group relative flex items-center justify-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <motion.span
          key={wave}
          aria-hidden="true"
          className="absolute inset-0 rounded-3xl border border-white/15 bg-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,.35),inset_0_-20px_34px_rgba(0,0,0,.22)]"
          initial={false}
          animate={
            reduce || wave === 0
              ? { scaleX: 1, scaleY: 1, rotate: 0, borderRadius: 24 }
              : {
                  scaleX: [1, 1.14, 0.9, 1.05, 0.98, 1],
                  scaleY: [1, 0.86, 1.1, 0.97, 1.01, 1],
                  rotate: [0, -2.5, 2, -1, 0.5, 0],
                  borderRadius: [24, 38, 16, 30, 22, 24],
                }
          }
          transition={{ duration: reduce ? 0 : 0.62, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute size-16 rounded-full bg-white/20 blur-xl"
          animate={
            reduce
              ? { opacity: 0.4, scale: 1 }
              : { opacity: [0.25, 0.5, 0.25], scale: [1, 1.12, 1] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <span className="pointer-events-none absolute inset-x-5 top-3 h-px rounded-full bg-white/35" />
        <motion.span
          key={`label-${wave}`}
          className="relative z-10 text-[13px] uppercase tracking-[0.22em] text-white/85"
          animate={
            reduce || wave === 0
              ? { y: 0, opacity: 1 }
              : { y: [0, 3, -1, 0], opacity: [0.8, 1, 1] }
          }
          transition={{ duration: reduce ? 0 : 0.5 }}
        >
          Press
        </motion.span>
      </button>
    </div>
  );
}
