"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type SliderProps = {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  showValue?: boolean;
  onValueChange?: (value: number) => void;
  className?: string;
};

const slide = { type: "spring", stiffness: 400, damping: 32 } as const;
const stretch = 19 / 16;

export function Slider({
  value,
  defaultValue = 42,
  min = 0,
  max = 100,
  step = 1,
  label = "Volume",
  showValue = true,
  onValueChange,
  className,
}: SliderProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const [dragging, setDragging] = React.useState(false);
  const reduce = useReducedMotion();
  const track = React.useRef<HTMLDivElement>(null);
  const safeMax = max > min ? max : min + 1;
  const percent = Math.min(100, Math.max(0, ((current - min) / (safeMax - min)) * 100));

  const commit = (next: number) => {
    const snapped = Math.round((next - min) / step) * step + min;
    const clamped = Math.min(safeMax, Math.max(min, snapped));
    if (value === undefined) setInternal(clamped);
    onValueChange?.(clamped);
  };

  const fromClientX = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    commit(min + ratio * (safeMax - min));
  };

  const onPointerDown = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    fromClientX(event.clientX);
  };
  const onPointerMove = (event: React.PointerEvent) => {
    if (!dragging) return;
    fromClientX(event.clientX);
  };
  const stop = () => setDragging(false);

  const onKey = (event: React.KeyboardEvent) => {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? step
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -step
          : event.key === "Home"
            ? min - current
            : event.key === "End"
              ? safeMax - current
              : 0;
    if (!delta) return;
    event.preventDefault();
    commit(current + delta);
  };

  return (
    <div className={cn("w-full max-w-[360px]", className)}>
      <div className="mb-2 flex items-center justify-between text-[13px]">
        <span className="text-muted-foreground">{label}</span>
        {showValue && <span className="tabular-nums">{current}</span>}
      </div>
      <div
        ref={track}
        role="slider"
        tabIndex={0}
        aria-valuemin={min}
        aria-valuemax={safeMax}
        aria-valuenow={current}
        aria-label={label}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={onKey}
        className="relative flex h-6 w-full touch-none select-none items-center outline-none"
      >
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent">
          <motion.div
            initial={false}
            animate={{ width: `${percent}%` }}
            transition={reduce ? { duration: 0 } : slide}
            className="h-full rounded-full bg-foreground"
          />
        </div>
        <motion.span
          aria-hidden="true"
          initial={false}
          animate={{ left: `${percent}%`, width: dragging ? 12 * stretch : 12 }}
          transition={reduce ? { duration: 0 } : slide}
          style={{ marginLeft: -6 }}
          className={cn(
            "absolute top-1/2 block h-3 -translate-y-1/2 rounded-full border bg-background shadow-sm",
            dragging && "border-foreground/40",
          )}
        />
      </div>
    </div>
  );
}
