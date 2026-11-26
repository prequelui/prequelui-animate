"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  springFast,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

export function StretchToggle({ className, preview }: MomentProps) {
  const [checked, setChecked] = useState(false);
  const [stretch, setStretch] = useState(false);
  const timer = useRef(0);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1000, 2600);
  const on = preview ? pulse : checked;

  useEffect(() => {
    if (preview) return;
    setStretch(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStretch(false), 240);
    return () => window.clearTimeout(timer.current);
  }, [checked, preview]);

  return (
    <div className={cn(surface, "flex-col gap-4", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Stretch toggle"
        onClick={() => setChecked((value) => !value)}
        className={cn(
          "relative h-9 w-[70px] rounded-full p-1 outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/50",
          on ? "bg-white" : "bg-white/15",
        )}
      >
        <motion.span
          className={cn(
            "block h-7 w-7 rounded-full",
            on ? "bg-black" : "bg-white",
          )}
          style={{ originX: 0.5 }}
          animate={{
            x: on ? 34 : 0,
            scaleX: stretch && !reduce ? 1.12 : 1,
          }}
          transition={reduce ? { duration: 0 } : springFast}
        />
      </button>
      <span className="text-[13px] uppercase tracking-[0.18em] text-white/45">
        {on ? "Stretched" : "Resting"}
      </span>
    </div>
  );
}
