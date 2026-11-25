"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

export function BellToggle({ className, preview }: MomentProps) {
  const [muted, setMuted] = useState(false);
  const [swing, setSwing] = useState(0);
  const first = useRef(true);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1000, 2600);
  const shown = preview ? pulse : muted;

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!reduce) setSwing((value) => value + 1);
  }, [shown, reduce]);

  return (
    <div className={cn(surface, "flex-col gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={shown}
        aria-label="Mute the bell"
        onClick={() => setMuted((value) => !value)}
        className="relative flex h-[86px] w-[98px] items-center justify-center rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <AnimatePresence>
          {!shown ? (
            <motion.span
              key={`wave-${swing}`}
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40"
              initial={{ scale: 0.7, opacity: 0.5 }}
              animate={reduce || swing === 0 ? { scale: 1, opacity: 0 } : { scale: 1.7, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.8, ease: "easeOut" }}
            />
          ) : null}
        </AnimatePresence>
        <motion.span
          key={`bell-${swing}`}
          className="relative z-10"
          style={{ transformOrigin: "50% 12%" }}
          animate={
            reduce || swing === 0
              ? { rotate: 0 }
              : { rotate: [0, 18, -15, 9, -5, 0] }
          }
          transition={{ duration: reduce ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] }}
        >
          <svg width="38" height="42" viewBox="0 0 38 42" aria-hidden="true">
            <path
              d="M19 3c-7 0-11 5-11 12v7l-4 6h30l-4-6v-7c0-7-4-12-11-12Z"
              fill={shown ? "rgba(255,255,255,.22)" : "white"}
              stroke="white"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="19" cy="34" r="3" fill={shown ? "rgba(255,255,255,.4)" : "white"} />
            {shown ? (
              <path
                d="M10 8 L28 30"
                stroke="rgba(255,255,255,.75)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : null}
          </svg>
        </motion.span>
        <AnimatePresence>
          {shown ? (
            <motion.span
              aria-hidden="true"
              initial={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={reduce ? { opacity: 0 } : { scale: 0.4, opacity: 0 }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 24 }}
              className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold leading-none text-black"
            >
              ×
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>
      <span className="text-[12px] uppercase tracking-[0.18em] text-white/45">
        {shown ? "Muted" : "Ringing"}
      </span>
    </div>
  );
}
