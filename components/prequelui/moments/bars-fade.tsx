"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const BARS = [38, 62, 78, 48, 88, 66, 34];

export function BarsFade({ className, preview }: MomentProps) {
  const [pressed, setPressed] = useState(false);
  const timer = useRef(0);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 820, 2500);
  const lit = pressed || pulse;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const play = () => {
    setPressed(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPressed(false), 820);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Play the bars fade"
      onClick={play}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          play();
        }
      }}
      className={cn(
        surface,
        "cursor-pointer rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      )}
    >
      <div className="flex h-[76px] items-center gap-[7px]">
        {BARS.map((height, index) => (
          <motion.span
            key={index}
            className="w-[9px] rounded-full bg-current"
            style={{ height }}
            animate={
              reduce
                ? { opacity: 1, scaleY: 1 }
                : {
                    opacity: lit ? 1 : 0.28,
                    scaleY: lit ? 1 : 0.42,
                  }
            }
            transition={
              reduce
                ? { duration: 0 }
                : { ...springSoft, delay: lit ? index * 0.045 : index * 0.02 }
            }
          />
        ))}
      </div>
    </div>
  );
}
