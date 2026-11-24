"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useBackgroundPlayback, useCanvasSize } from "./shared";

const CELL = 14;

type Ripple = { x: number; y: number; start: number };

function contour(
  path: Path2D,
  x: number,
  y: number,
  size: number,
  a: number,
  b: number,
  c: number,
  d: number,
  level: number,
) {
  const top = () => [x + ((level - a) / (b - a)) * size, y] as const;
  const right = () => [x + size, y + ((level - b) / (c - b)) * size] as const;
  const bottom = () => [x + ((level - d) / (c - d)) * size, y + size] as const;
  const left = () => [x, y + ((level - a) / (d - a)) * size] as const;
  const line = (p: readonly [number, number], q: readonly [number, number]) => {
    path.moveTo(p[0], p[1]);
    path.lineTo(q[0], q[1]);
  };

  const code =
    (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
  switch (code) {
    case 0:
    case 15:
      return;
    case 1:
    case 14:
      line(left(), bottom());
      return;
    case 2:
    case 13:
      line(bottom(), right());
      return;
    case 3:
    case 12:
      line(left(), right());
      return;
    case 4:
    case 11:
      line(top(), right());
      return;
    case 6:
    case 9:
      line(top(), bottom());
      return;
    case 7:
    case 8:
      line(left(), top());
      return;
    default: {
      const center = (a + b + c + d) / 4;
      if ((code === 5) === center > level) {
        line(left(), top());
        line(bottom(), right());
      } else {
        line(left(), bottom());
        line(top(), right());
      }
    }
  }
}

export type TopographyBackgroundProps = React.ComponentProps<"div"> & {
  speed?: number;
  paused?: boolean;
  levels?: number;
  scale?: number;
  peak?: number;
  interactive?: boolean;
  lineColor?: string;
};

export function TopographyBackground({
  speed = 1,
  paused = false,
  levels = 14,
  scale = 1,
  peak = 1,
  interactive = true,
  lineColor,
  className,
  children,
  ...props
}: TopographyBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;
  const timeRef = React.useRef(0);
  const ripplesRef = React.useRef<Ripple[]>([]);
  const pointerRef = React.useRef({ x: 0, y: 0, hx: 0, hy: 0, raised: 0, raisedTarget: 0, placed: false });
  const drawRef = React.useRef<(time: number) => void>(() => {});
  const optionsRef = React.useRef({ levels, scale, peak, lineColor });
  optionsRef.current = { levels, scale, peak, lineColor };

  const draw = React.useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      const container = ref.current;
      if (!canvas || !container) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      if (width < 2 || height < 2) return;
      const dpr = canvas.width / Math.max(1, width);
      const cols = Math.ceil(width / CELL) + 1;
      const rows = Math.ceil(height / CELL) + 1;
      const field = new Float32Array(cols * rows);
      const options = optionsRef.current;
      const feature = 170 * Math.max(0.2, options.scale);
      const tz = time * 0.00008 * Math.max(0.1, speed);
      const pointer = pointerRef.current;

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < cols; column++) {
          const x = column * CELL;
          const y = row * CELL;
          const nx = x / feature;
          const ny = y / feature;
          let value =
            Math.sin(nx * 1.7 + tz) * 0.55 +
            Math.sin(ny * 2.1 - tz * 0.8) * 0.45 +
            Math.sin((nx + ny) * 1.15 + tz * 0.55) * 0.3 +
            Math.sin(nx * 3.1 - ny * 2.3 + tz * 1.3) * 0.18;
          value /= 1.48;
          if (pointer.raised > 0.001) {
            const distance = Math.hypot(x - pointer.hx, y - pointer.hy);
            value += pointer.raised * options.peak * 0.9 * Math.exp(-distance / 100);
          }
          for (const ripple of ripplesRef.current) {
            const progress = Math.min(1, Math.max(0, (time - ripple.start) / 2600));
            const reach = Math.hypot(width, height) * 0.8;
            const distance = Math.hypot(x - ripple.x, y - ripple.y) - progress * reach;
            value +=
              0.75 *
              (1 - progress) *
              Math.cos((distance / 58) * 1.8) *
              Math.exp(-(distance * distance) / (2 * 58 * 58));
          }
          field[row * cols + column] = value;
        }
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const color =
        options.lineColor ??
        getComputedStyle(container).color ??
        (document.documentElement.classList.contains("dark") ? "#e5e5e5" : "#1c1c1c");
      const count = Math.max(4, Math.round(options.levels));
      const step = 1.8 / count;
      const minor = new Path2D();
      const major = new Path2D();

      for (let levelIndex = -count; levelIndex <= count; levelIndex++) {
        const level = levelIndex * step;
        const path = levelIndex % 5 === 0 ? major : minor;
        for (let row = 0; row < rows - 1; row++) {
          for (let column = 0; column < cols - 1; column++) {
            const a = field[row * cols + column] as number;
            const b = field[row * cols + column + 1] as number;
            const c = field[(row + 1) * cols + column + 1] as number;
            const d = field[(row + 1) * cols + column] as number;
            const lowest = Math.min(a, b, c, d);
            const highest = Math.max(a, b, c, d);
            if (level < lowest || level > highest) continue;
            contour(path, column * CELL, row * CELL, CELL, a, b, c, d, level);
          }
        }
      }

      ctx.strokeStyle = color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;
      ctx.stroke(minor);
      ctx.globalAlpha = 0.68;
      ctx.lineWidth = 1.4;
      ctx.stroke(major);
      ctx.globalAlpha = 1;
    },
    [speed],
  );

  drawRef.current = draw;

  useCanvasSize(ref, canvasRef, () => {
    drawRef.current(reduce ? 0 : timeRef.current);
  });

  React.useEffect(() => {
    if (!playing) {
      drawRef.current(reduce ? 0 : timeRef.current);
      return;
    }
    let frame = 0;
    let last = performance.now();
    let waited = 0;
    const tick = (now: number) => {
      const delta = Math.min(64, now - last);
      last = now;
      waited += delta;
      if (waited >= 33) {
        timeRef.current += waited;
        waited = 0;
        const pointer = pointerRef.current;
        pointer.hx += (pointer.x - pointer.hx) * 0.12;
        pointer.hy += (pointer.y - pointer.hy) * 0.12;
        pointer.raised += ((interactive ? pointer.raisedTarget : 0) - pointer.raised) * 0.08;
        drawRef.current(timeRef.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [interactive, playing, reduce]);

  const point = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <div
      ref={ref}
      data-slot="topography-background"
      className={cn("relative size-full overflow-hidden bg-[#f5f2ec] text-[#1b1b1f] dark:bg-[#0b0b0f] dark:text-[#e8e6e1]", className)}
      {...props}
      onPointerMove={(event) => {
        if (!interactive || reduce) return;
        const { x, y } = point(event);
        const pointer = pointerRef.current;
        if (!pointer.placed) {
          pointer.hx = x;
          pointer.hy = y;
          pointer.placed = true;
        }
        pointer.x = x;
        pointer.y = y;
        pointer.raisedTarget = 1;
      }}
      onPointerLeave={() => {
        pointerRef.current.raisedTarget = 0;
      }}
      onPointerDown={(event) => {
        if (!interactive || reduce) return;
        const { x, y } = point(event);
        ripplesRef.current = [
          ...ripplesRef.current.slice(-3),
          { x, y, start: timeRef.current },
        ];
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}
