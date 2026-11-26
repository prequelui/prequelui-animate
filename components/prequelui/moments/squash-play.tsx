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

export function SquashPlay({ className, preview }: MomentProps) {
  const [playing, setPlaying] = useState(false);
  const [squash, setSquash] = useState(0);
  const timer = useRef(0);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1200, 2700);
  const active = preview ? pulse : playing;

  useEffect(() => {
    if (pulse) setSquash((value) => value + 1);
  }, [pulse]);

  const press = () => {
    setPlaying((value) => !value);
    if (!reduce) setSquash((value) => value + 1);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className={cn(surface, "flex-col gap-3", className)}>
      <button
        type="button"
        aria-pressed={active}
        aria-label={active ? "Pause" : "Play"}
        onClick={press}
        className="flex size-[88px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <motion.span
          key={squash}
          className="flex size-[74px] items-center justify-center bg-white text-black"
          initial={{ scale: 1, borderRadius: 37 }}
          animate={{
            scale: reduce || squash === 0 ? 1 : [1, 0.78, 1.06, 1],
            rotate: reduce || squash === 0 ? 0 : [0, -3, 2, 0],
            borderRadius: active ? 20 : 37,
          }}
          transition={
            squash === 0
              ? { duration: 0 }
              : { duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <motion.span
            className="flex items-center gap-[5px]"
            animate={{ rotate: active ? 0 : 0 }}
            transition={reduce ? { duration: 0 } : springFast}
          >
            {active ? (
              <>
                <span className="block h-5 w-[5px] rounded-full bg-black" />
                <span className="block h-5 w-[5px] rounded-full bg-black" />
              </>
            ) : (
              <span
                className="block h-0 w-0"
                style={{
                  borderTop: "11px solid transparent",
                  borderBottom: "11px solid transparent",
                  borderLeft: "17px solid black",
                  marginLeft: 4,
                }}
              />
            )}
          </motion.span>
        </motion.span>
      </button>
      <span
        aria-live="polite"
        className="text-[13px] uppercase tracking-[0.18em] text-white/45"
      >
        {active ? "Playing" : "Paused"}
      </span>
    </div>
  );
}
