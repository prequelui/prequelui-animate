"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  cn,
  springSnap,
  surface,
  useHydratedReducedMotion,
  usePreviewStep,
  type MomentProps,
} from "./shared";

const DETENTS = 8;
const STEP_DEGREES = 360 / DETENTS;

export function DetentDial({ className, preview }: MomentProps) {
  const [step, setStep] = useState(1);
  const dragging = useRef(false);
  const dial = useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  const previewStep = usePreviewStep(preview, DETENTS, 1200);
  const value = preview ? previewStep : step;

  const angleFromEvent = (event: React.PointerEvent) => {
    const node = dial.current;
    if (!node) return null;
    const rect = node.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    const angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const normalised = (angle + 360) % 360;
    return Math.round(normalised / STEP_DEGREES) % DETENTS;
  };

  const move = (event: React.PointerEvent) => {
    if (!dragging.current) return;
    const next = angleFromEvent(event);
    if (next !== null) setStep(next);
  };

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      setStep((current) => (current + 1) % DETENTS);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      setStep((current) => (current - 1 + DETENTS) % DETENTS);
    }
  };

  return (
    <div className={cn(surface, className)}>
      <div
        ref={dial}
        role="slider"
        tabIndex={0}
        aria-label="Detent dial"
        aria-valuemin={0}
        aria-valuemax={DETENTS - 1}
        aria-valuenow={value}
        aria-valuetext={`Notch ${value + 1} of ${DETENTS}`}
        onKeyDown={key}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          const next = angleFromEvent(event);
          if (next !== null) setStep(next);
        }}
        onPointerMove={move}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        className="relative flex size-[122px] cursor-grab touch-none items-center justify-center rounded-full border border-white/12 bg-[#111114] outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {Array.from({ length: DETENTS }, (_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 h-[3px] w-[3px] rounded-full bg-white/30"
            style={{
              transform: `translate(-50%, -50%) rotate(${index * STEP_DEGREES}deg) translateY(-52px)`,
            }}
          />
        ))}
        <motion.span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[46px] w-[3px] origin-bottom rounded-full bg-white"
          style={{ marginLeft: -1.5, marginTop: -46 }}
          animate={{ rotate: value * STEP_DEGREES }}
          transition={reduce ? { duration: 0 } : springSnap}
        >
          <span className="absolute -left-[5px] top-0 size-[13px] rounded-full bg-white" />
        </motion.span>
        <span className="relative z-10 flex size-9 items-center justify-center rounded-full border border-white/15 bg-[#18181c] text-[13px] tabular-nums text-white/60">
          {value + 1}
        </span>
      </div>
    </div>
  );
}
