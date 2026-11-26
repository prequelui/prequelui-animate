"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  cn,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const TILES = Array.from({ length: 8 }, (_, index) => index);

export function DominoRow({ className, preview }: MomentProps) {
  const [fallen, setFallen] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1500, 3000);
  const down = preview ? pulse : fallen;

  return (
    <div className={cn(surface, "flex-col gap-4", className)}>
      <button
        type="button"
        aria-pressed={down}
        aria-label="Topple the dominoes"
        onClick={() => setFallen((value) => !value)}
        className="flex h-[92px] w-[188px] items-end justify-center gap-[7px] outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {TILES.map((tile) => (
          <motion.span
            key={tile}
            className="block h-[62px] w-[11px] origin-bottom rounded-[2px] border border-white/20 bg-white/90"
            animate={{ rotate: down ? 76 : 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : {
                    duration: 0.32,
                    ease: [0.4, 0, 0.9, 0.5],
                    delay: down ? tile * 0.075 : (TILES.length - tile) * 0.045,
                  }
            }
          />
        ))}
      </button>
      <span className="text-[13px] uppercase tracking-[0.18em] text-white/45">
        {down ? "Falling" : "Standing"}
      </span>
    </div>
  );
}
