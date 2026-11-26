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

const PETALS = Array.from({ length: 7 }, (_, index) => index);

export function BloomToggle({ className, preview }: MomentProps) {
  const [checked, setChecked] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1100, 2600);
  const on = preview ? pulse : checked;

  return (
    <div className={cn(surface, "flex-col gap-4", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Bloom toggle"
        onClick={() => setChecked((value) => !value)}
        className={cn(
          "relative h-9 w-[74px] rounded-full p-1 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/50",
          on ? "bg-white/25" : "bg-white/10",
        )}
      >
        <motion.span
          className="relative z-10 block size-7 rounded-full bg-white"
          animate={{ x: on ? 38 : 0 }}
          transition={reduce ? { duration: 0 } : springSoft}
        >
          <span aria-hidden="true" className="absolute inset-0">
            {PETALS.map((index) => {
              const angle = (360 / PETALS.length) * index;
              return (
                <motion.span
                  key={index}
                  className="absolute left-1/2 top-1/2 size-[9px] rounded-full bg-white/80"
                  style={{
                    rotate: angle,
                    translateX: "-50%",
                    translateY: "-50%",
                  }}
                  animate={
                    reduce
                      ? { opacity: on ? 1 : 0, scale: on ? 1 : 0 }
                      : {
                          opacity: on ? 1 : 0,
                          scale: on ? 1 : 0,
                          x: on ? Math.cos((angle * Math.PI) / 180) * 16 : 0,
                          y: on ? Math.sin((angle * Math.PI) / 180) * 16 : 0,
                        }
                  }
                  transition={
                    reduce
                      ? { duration: 0 }
                      : { ...springSoft, delay: index * 0.025 }
                  }
                />
              );
            })}
          </span>
        </motion.span>
      </button>
      <span className="text-[13px] uppercase tracking-[0.18em] text-white/45">
        {on ? "Bloom" : "Rest"}
      </span>
    </div>
  );
}
