"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { CountingNumber } from "./counting-number";
import { useReduceMotion, useSeen } from "./motion";

export type KpiCounterProps = React.ComponentProps<"div"> & {
  label: string;
  value: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  deltaSuffix?: string;
  points?: number[];
  inView?: boolean;
  hint?: string;
};

type Point = { x: number; y: number };

function smoothPath(points: Point[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

function Arrow({ up }: { up: boolean }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="size-3">
      <path
        d={up ? "M3 9 9 3M4.4 3H9v4.6" : "M3 3l6 6M4.4 9H9V4.4"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function KpiCounter({
  label,
  value,
  from = 0,
  prefix,
  suffix,
  decimals = 0,
  delta,
  deltaSuffix = "%",
  points = [18, 24, 21, 32, 29, 36, 34, 44, 48, 46, 57, 62],
  inView = true,
  hint,
  className,
  ...props
}: KpiCounterProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, inView, true);
  const reduce = useReduceMotion();
  const id = React.useId().replace(/:/g, "");
  const width = 240;
  const height = 62;

  const geometry = React.useMemo(() => {
    if (points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;
    const coords = points.map((point, index) => ({
      x: (index / (points.length - 1)) * width,
      y: height - 6 - ((point - min) / span) * (height - 14),
    }));
    const line = smoothPath(coords);
    const area = `${line} L ${width} ${height} L 0 ${height} Z`;
    return { line, area, coords };
  }, [points]);

  const up = (delta ?? 0) >= 0;

  return (
    <div
      ref={ref}
      data-slot="kpi-counter"
      className={cn(
        "flex w-full max-w-[300px] flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground",
        className,
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-[13px] leading-4 text-muted-foreground">
            {label}
          </span>
          <span className="flex items-baseline gap-0.5 text-[32px] font-medium leading-none tracking-[-0.03em]">
            {prefix ? <span className="text-[20px] text-muted-foreground">{prefix}</span> : null}
            <CountingNumber
              number={value}
              fromNumber={from}
              inView={inView}
              decimalPlaces={decimals}
              thousandSeparator=","
            />
            {suffix ? (
              <span className="text-[15px] font-normal text-muted-foreground">{suffix}</span>
            ) : null}
          </span>
        </div>
        {delta !== undefined ? (
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium tabular-nums",
              up
                ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/12 text-rose-600 dark:text-rose-400",
            )}
          >
            <Arrow up={up} />
            {Math.abs(delta)}
            {deltaSuffix}
          </motion.span>
        ) : null}
      </div>

      {geometry ? (
        <div className="relative">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="h-[62px] w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`kpi-${id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.26" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <motion.path
              key={`area-${value}`}
              d={geometry.area}
              fill={`url(#kpi-${id})`}
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: seen ? 1 : 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
            />
            <motion.path
              key={`line-${value}`}
              d={geometry.line}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: seen ? 1 : 0, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.9, ease: [0.33, 0, 0.2, 1] }}
            />
          </svg>
        </div>
      ) : null}

      {hint ? (
        <p className="text-[13px] leading-4 text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
