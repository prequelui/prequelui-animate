"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

export function FlipCoin({ className, preview }: MomentProps) {
  const [heads, setHeads] = useState(true);
  const [flips, setFlips] = useState(0);
  const pulse = usePreviewPulse(preview, 1400, 3000);
  const reduce = useHydratedReducedMotion();
  const previous = useRef(pulse);

  useEffect(() => {
    if (preview && pulse && !previous.current) {
      setHeads((value) => !value);
      setFlips((value) => value + 1);
    }
    previous.current = pulse;
  }, [preview, pulse]);

  const flip = () => {
    setHeads((value) => !value);
    setFlips((value) => value + 1);
  };

  const rotation = (heads ? 0 : 180) + flips * 720;

  return (
    <div className={cn(surface, "flex-col gap-3", className)}>
      <button
        type="button"
        aria-label={`Coin showing ${heads ? "heads" : "tails"}, flip it`}
        onClick={flip}
        className="flex size-[92px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        style={{ perspective: 700 }}
      >
        <motion.span
          className="relative block size-[62px]"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: rotation, y: reduce ? 0 : [0, -18, 0] }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  rotateY: { type: "spring", stiffness: 120, damping: 16 },
                  y: { duration: 1.05, ease: [0.22, 1, 0.36, 1] },
                }
          }
        >
          <span
            className="absolute inset-0 flex items-center justify-center rounded-full border border-white/25 bg-white text-[20px] font-semibold text-black shadow-[0_10px_24px_rgba(0,0,0,.4)]"
            style={{ backfaceVisibility: "hidden" }}
          >
            H
          </span>
          <span
            className="absolute inset-0 flex items-center justify-center rounded-full border border-white/20 bg-[#1a1a1f] text-[20px] font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,.4)]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            T
          </span>
        </motion.span>
      </button>
      <span
        aria-live="polite"
        className="text-[13px] uppercase tracking-[0.18em] text-white/45"
      >
        {heads ? "Heads" : "Tails"}
      </span>
    </div>
  );
}
