"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { CountingNumber } from "./counting-number";
import { useReduceMotion, useSeen } from "./motion";

const arcSpring: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export type RadialProgressProps = React.ComponentProps<"div"> & {
  value: number;
  size?: number;
  strokeWidth?: number;
  from?: number;
  label?: string;
  showLabel?: boolean;
  showTicks?: boolean;
  ticks?: number;
  inView?: boolean;
  color?: string;
  trackColor?: string;
  transition?: Transition;
};

export function RadialProgress({
  value,
  size = 148,
  strokeWidth = 10,
  from = 0,
  label,
  showLabel = true,
  showTicks = true,
  ticks = 48,
  inView = true,
  color = "currentColor",
  trackColor = "currentColor",
  transition,
  className,
  style,
  ...props
}: RadialProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, inView, true);
  const reduce = useReduceMotion();
  const id = React.useId().replace(/:/g, "");
  const safe = clamp(value, 0, 100);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const spring = reduce ? { duration: 0 } : transition ?? arcSpring;
  const tickCount = Math.max(4, Math.round(ticks));

  return (
    <div
      ref={ref}
      data-slot="radial-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safe)}
      aria-label={label ?? "Progress"}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`radial-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeOpacity="0.12"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={`url(#radial-${id})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: seen ? safe / 100 : 0 }}
          transition={spring}
        />
        {showTicks
          ? Array.from({ length: tickCount }, (_, index) => {
              const angle = (index / tickCount) * 360;
              const major = index % 6 === 0;
              const active = (index / tickCount) * 100 <= safe;
              const inner = radius + strokeWidth / 2 + 4;
              const outer = inner + (major ? 5 : 2.5);
              return (
                <line
                  key={index}
                  x1={center}
                  y1={center - inner}
                  x2={center}
                  y2={center - outer}
                  stroke={color}
                  strokeOpacity={active ? 0.5 : 0.14}
                  strokeWidth={major ? 1.4 : 1}
                  strokeLinecap="round"
                  transform={`rotate(${angle} ${center} ${center})`}
                />
              );
            })
          : null}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
        <CountingNumber
          number={safe}
          fromNumber={from}
          inView={inView}
          thousandSeparator=","
          className="font-medium leading-none tracking-[-0.04em] tabular-nums"
          style={{ fontSize: Math.max(22, Math.round(size * 0.25)) }}
        />
        {showLabel ? (
          <span className="text-[13px] leading-4 text-muted-foreground">
            {label ?? "complete"}
          </span>
        ) : null}
      </div>
    </div>
  );
}
