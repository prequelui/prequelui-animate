"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  localPoint,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

type Ripple = { id: number; x: number; y: number };

export function RipplePad({ className, preview }: MomentProps) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const counter = useRef(0);
  const timers = useRef<number[]>([]);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 900, 2300);

  useEffect(
    () => () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    },
    [],
  );

  const spawn = (x: number, y: number) => {
    const id = ++counter.current;
    setRipples((current) => [...current.slice(-3), { id, x, y }]);
    const timer = window.setTimeout(() => {
      setRipples((current) => current.filter((ripple) => ripple.id !== id));
      timers.current = timers.current.filter((entry) => entry !== timer);
    }, 820);
    timers.current.push(timer);
  };

  useEffect(() => {
    if (pulse) spawn(88, 56);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulse]);

  return (
    <div className={cn(surface, className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Tap the pad to send a ripple"
        onClick={(event) => {
          const point = localPoint(event, event.currentTarget);
          spawn(point.x, point.y);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            spawn(88, 56);
          }
        }}
        className="relative h-[112px] w-[178px] cursor-pointer overflow-hidden rounded-2xl border border-white/12 bg-white/8 outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/6 blur-lg"
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[13px] uppercase tracking-[0.18em] text-white/40">
          Tap anywhere
        </span>
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              aria-hidden="true"
              className="pointer-events-none absolute rounded-full border border-white/70"
              style={{
                left: ripple.x - 12,
                top: ripple.y - 12,
                width: 24,
                height: 24,
              }}
              initial={{ scale: 0.2, opacity: 0.9 }}
              animate={{ scale: reduce ? 1 : 5.4, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: reduce ? 0.2 : 0.78,
                ease: [0.23, 1, 0.32, 1],
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
