"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewStep,
  type MomentProps,
} from "./shared";

const ITEMS = ["Sketch the gesture", "Tune the spring", "Check reduced motion"];

export function Checklist({ className, preview }: MomentProps) {
  const [done, setDone] = useState<number[]>([]);
  const reduce = useHydratedReducedMotion();
  const step = usePreviewStep(preview, ITEMS.length + 1, 1100);
  const checked = preview ? ITEMS.map((_, index) => index).filter((index) => index < step) : done;

  const toggle = (index: number) => {
    setDone((current) =>
      current.includes(index)
        ? current.filter((entry) => entry !== index)
        : [...current, index],
    );
  };

  return (
    <div className={cn(surface, "flex-col items-stretch justify-center gap-1.5 px-3", className)}>
      {ITEMS.map((item, index) => {
        const on = checked.includes(index);
        return (
          <button
            key={item}
            type="button"
            role="checkbox"
            aria-checked={on}
            onClick={() => toggle(index)}
            className="group flex h-[30px] w-[190px] items-center gap-2.5 rounded-lg px-1 text-left outline-none transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <span
              className={cn(
                "relative flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                on ? "border-white bg-white" : "border-white/25 bg-transparent",
              )}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                <motion.path
                  d="M2.4 6.2 4.9 8.7 9.7 3.4"
                  fill="none"
                  stroke="#111114"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={false}
                  animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                />
              </svg>
            </span>
            <span className="relative min-w-0 flex-1 truncate text-[11px] text-white/70">
              {item}
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-1/2 h-px bg-white/60"
                style={{ originX: 0 }}
                animate={{ scaleX: on ? 1 : 0 }}
                transition={reduce ? { duration: 0 } : springSoft}
              />
            </span>
          </button>
        );
      })}
    </div>
  );
}
