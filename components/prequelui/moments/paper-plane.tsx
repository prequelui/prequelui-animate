"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

export function PaperPlane({ className, preview }: MomentProps) {
  const [flying, setFlying] = useState(false);
  const timer = useRef(0);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1500, 3000);

  useEffect(() => {
    if (preview && pulse) setFlying(true);
  }, [preview, pulse]);

  useEffect(() => {
    if (!flying) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFlying(false), reduce ? 200 : 1600);
    return () => window.clearTimeout(timer.current);
  }, [flying, reduce]);

  return (
    <div className={cn(surface, className)}>
      <button
        type="button"
        aria-label="Send the paper plane"
        onClick={() => setFlying(true)}
        className="relative h-[108px] w-[190px] overflow-hidden rounded-xl border border-white/10 bg-[#101013] outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 190 108"
          className="absolute inset-0 size-full"
        >
          <path
            d="M24 84 C 70 54, 104 38, 158 24"
            fill="none"
            stroke="rgba(255,255,255,.16)"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
          <motion.path
            d="M24 84 C 70 54, 104 38, 158 24"
            fill="none"
            stroke="rgba(255,255,255,.75)"
            strokeWidth="1.5"
            strokeDasharray="4 5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: flying ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 1.1, ease: [0.23, 1, 0.32, 1] }}
          />
        </svg>

        <motion.span
          className="absolute left-4 top-[78px] block"
          animate={
            reduce
              ? { x: 0, y: 0, rotate: 0 }
              : flying
                ? { x: 128, y: -58, rotate: -18, opacity: [1, 1, 0.2] }
                : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={
            reduce ? { duration: 0 } : { duration: 1.15, ease: [0.22, 1, 0.36, 1] }
          }
        >
          <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden="true">
            <path
              d="M1 10.5 25 1 17 21l-5.4-7.1L1 10.5Z"
              fill="white"
              stroke="white"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <path d="m11.6 13.9 5.2-5.2" stroke="#101013" strokeWidth="1" />
          </svg>
        </motion.span>

        <motion.span
          aria-hidden="true"
          className="absolute right-6 top-5 size-1.5 rounded-full bg-white"
          animate={{ opacity: flying ? [0, 1, 0] : 0.3, scale: flying ? 1.6 : 1 }}
          transition={reduce ? { duration: 0 } : { duration: 1.1 }}
        />

        <AnimatePresence>
          {!flying ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-2 left-3 text-[10px] uppercase tracking-[0.18em] text-white/35"
            >
              Tap to send
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>
    </div>
  );
}
