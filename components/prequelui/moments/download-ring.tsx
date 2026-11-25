"use client";

import { Check, Download } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DownloadRing({ className, preview }: MomentProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1700, 3200);

  const start = () => {
    if (done) return;
    window.clearInterval(timer.current);
    setProgress(0);
    setDone(false);
    if (reduce) {
      setProgress(100);
      return;
    }
    timer.current = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 100) {
          window.clearInterval(timer.current);
          return 100;
        }
        const next = Math.min(100, current + 2.4);
        if (next >= 100) window.clearInterval(timer.current);
        return next;
      });
    }, 32);
  };

  useEffect(() => {
    if (pulse) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulse]);

  useEffect(() => {
    if (progress < 100) return;
    setDone(true);
    const reset = window.setTimeout(() => {
      setDone(false);
      setProgress(0);
    }, 1200);
    return () => window.clearTimeout(reset);
  }, [progress]);

  useEffect(() => () => window.clearInterval(timer.current), []);

  const busy = progress > 0 && !done;

  return (
    <div className={cn(surface, className)}>
      <button
        type="button"
        aria-label={done ? "Download complete" : "Start the download"}
        aria-busy={busy}
        onClick={start}
        className="group relative flex size-[104px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 80 80"
          className="absolute inset-0 size-full -rotate-90"
        >
          <circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,.12)"
            strokeWidth="3"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={RADIUS}
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            initial={false}
            animate={{
              strokeDashoffset: CIRCUMFERENCE * (1 - (reduce ? (progress > 0 ? 1 : 0) : progress / 100)),
            }}
            transition={{ duration: reduce ? 0 : 0.18, ease: "linear" }}
          />
        </svg>
        <motion.span
          aria-hidden="true"
          className="absolute inset-2 rounded-full border border-white/10"
          initial={false}
          animate={
            reduce
              ? { opacity: 0.3, scale: 1 }
              : busy
                ? { opacity: [0.15, 0.45, 0.15], scale: [1, 1.06, 1] }
                : { opacity: 0.2, scale: 1 }
          }
          transition={
            reduce || !busy
              ? { duration: 0 }
              : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <motion.span
          className="relative z-10 flex items-center justify-center text-white"
          initial={false}
          animate={done ? { scale: [0.6, 1.14, 1], opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : done
                ? { duration: 0.34, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0 }
          }
        >
          {done ? (
            <Check className="size-6" strokeWidth={2.6} />
          ) : (
            <motion.span
              initial={false}
              animate={{
                y: reduce ? 0 : Math.min(8, progress * 0.1),
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 24 }}
            >
              <Download className="size-6" strokeWidth={2} />
            </motion.span>
          )}
        </motion.span>
        {done ? null : (
          <span className="absolute bottom-0.5 text-[10px] tabular-nums text-white/45">
            {Math.round(reduce && progress > 0 ? 100 : progress)}%
          </span>
        )}
      </button>
    </div>
  );
}
