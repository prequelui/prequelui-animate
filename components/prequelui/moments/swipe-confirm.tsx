"use client";

import { Check, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  clamp,
  cn,
  localPoint,
  naturalWidth,
  springFast,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const TRACK = 214;
const PAD = 6;
const KNOB = 34;
const TRAVEL = TRACK - PAD * 2 - KNOB;

export function SwipeConfirm({ className, preview }: MomentProps) {
  const [progress, setProgress] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const dragging = useRef(false);
  const track = useRef<HTMLDivElement>(null);
  const resetTimer = useRef(0);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1500, 3000);
  const shown = preview ? (pulse ? 100 : 0) : progress;
  const done = preview ? pulse : confirmed;

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const confirm = () => {
    setProgress(100);
    setConfirmed(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      setConfirmed(false);
      setProgress(0);
    }, 1100);
  };

  const setFromEvent = (event: React.PointerEvent) => {
    const node = track.current;
    if (!node) return;
    const point = localPoint(event, node);
    const usable = Math.max(1, naturalWidth(node) - PAD * 2 - KNOB);
    const ratio = clamp((point.x - PAD - KNOB / 2) / usable, 0, 1);
    setProgress(Math.round(ratio * 100));
  };

  const release = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (progress >= 88) {
      confirm();
      return;
    }
    setProgress(0);
  };

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setProgress((current) => Math.min(100, current + 25));
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setProgress((current) => Math.max(0, current - 25));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (progress >= 75) confirm();
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setConfirmed(false);
      setProgress(0);
    }
  };

  return (
    <div className={cn(surface, className)}>
      <div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-label="Swipe to confirm"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={shown}
        aria-valuetext={done ? "Confirmed" : `${shown}%`}
        onKeyDown={key}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          setFromEvent(event);
        }}
        onPointerMove={(event) => {
          if (dragging.current) setFromEvent(event);
        }}
        onPointerUp={release}
        onPointerCancel={release}
        className="relative h-[46px] w-[214px] touch-none overflow-hidden rounded-full border border-white/12 bg-white/8 p-1.5 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-y-1.5 left-1.5 right-1.5 origin-left rounded-full bg-white/12"
          animate={{ scaleX: Math.max(0.001, shown / 100) }}
          transition={reduce ? { duration: 0 } : springFast}
          initial={false}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center pl-4 text-[13px] uppercase tracking-[0.18em] text-white/45">
          {done ? "Confirmed" : shown >= 88 ? "Release" : "Swipe to confirm"}
        </span>
        <motion.span
          className="absolute left-1.5 top-1.5 flex size-[34px] items-center justify-center rounded-full bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,.35)]"
          animate={{ x: (shown / 100) * TRAVEL }}
          transition={reduce ? { duration: 0 } : springFast}
        >
          {done ? (
            <Check className="size-4" strokeWidth={2.6} />
          ) : (
            <ChevronRight className="size-4" strokeWidth={2.4} />
          )}
        </motion.span>
      </div>
    </div>
  );
}
