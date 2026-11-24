"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { seeded, useBackgroundPlayback, useCanvasSize } from "./shared";

const GLYPHS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·+-*/<>[]{}";

type TrailPoint = { x: number; y: number; at: number };
type Wave = { x: number; y: number; at: number; strength: number };

export type GlyphBackgroundProps = React.ComponentProps<"div"> & {
  speed?: number;
  paused?: boolean;
  interactive?: boolean;
  fontSize?: number;
  glowColor?: string;
  shapeColor?: string;
};

export function GlyphBackground({
  speed = 1,
  paused = false,
  interactive = true,
  fontSize = 11,
  glowColor,
  shapeColor,
  className,
  children,
  ...props
}: GlyphBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;
  const timeRef = React.useRef(0);
  const trailRef = React.useRef<TrailPoint[]>([]);
  const wavesRef = React.useRef<Wave[]>([]);
  const drawRef = React.useRef<(time: number) => void>(() => {});
  const optionsRef = React.useRef({ fontSize, glowColor, shapeColor });
  optionsRef.current = { fontSize, glowColor, shapeColor };

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
      const { fontSize: size, glowColor, shapeColor } = optionsRef.current;
      const cellHeight = size * 1.35;
      const cellWidth = size * 0.72;
      const columns = Math.ceil(width / cellWidth);
      const rows = Math.ceil(height / cellHeight);
      const computed = getComputedStyle(container).color || "#e5e5e5";
      const base = glowColor ?? computed;
      const accent = shapeColor ?? "rgb(34 211 238)";
      const trail = trailRef.current;
      const waves = wavesRef.current;
      const epoch = Math.floor(time / 720);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const brightness = (x: number, y: number) => {
        let value = 0.055;
        for (const point of trail) {
          const age = (time - point.at) / 700;
          if (age < 0 || age > 1) continue;
          const dx = x - point.x;
          const dy = y - point.y;
          value += 0.55 * (1 - age) * (1 - age) * Math.exp(-(dx * dx + dy * dy) / 3200);
        }
        for (const wave of waves) {
          const age = (time - wave.at) / 4000;
          if (age < 0 || age > 1) continue;
          const radius = (560 * age) / (1 + 0.66 * age);
          const distance = Math.hypot(x - wave.x, y - wave.y) - radius;
          value +=
            Math.exp(-(distance * distance) / 180) *
            Math.exp(-Math.max(0, age - 0.35) / 1.2) *
            wave.strength;
        }
        return Math.min(1, value);
      };

      const passes = [
        { from: 0.05, to: 0.12, color: base, alpha: 0.09 },
        { from: 0.12, to: 0.3, color: base, alpha: 0.22 },
        { from: 0.3, to: 0.62, color: base, alpha: 0.48 },
        { from: 0.62, to: 1.01, color: accent, alpha: 0.8 },
      ];

      for (const pass of passes) {
        ctx.globalAlpha = pass.alpha;
        ctx.fillStyle = pass.color;
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column < columns; column++) {
            const x = column * cellWidth;
            const y = row * cellHeight;
            const value = brightness(x + cellWidth / 2, y + cellHeight / 2);
            if (value < pass.from || value >= pass.to) continue;
            const index = row * columns + column;
            const glyph =
              GLYPHS[
                Math.floor(seeded(index + epoch * 977, 1.3) * GLYPHS.length)
              ] ?? "·";
            ctx.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
          }
        }
      }
      ctx.globalAlpha = 1;
    },
    [],
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
        trailRef.current = trailRef.current.filter(
          (point) => timeRef.current - point.at < 700,
        );
        drawRef.current(timeRef.current);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduce]);

  const point = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  return (
    <div
      ref={ref}
      data-slot="glyph-background"
      className={cn(
        "relative size-full overflow-hidden bg-[#f6f4ef] text-[#232227] dark:bg-[#08080c] dark:text-[#e9e7e2]",
        className,
      )}
      {...props}
      onPointerMove={(event) => {
        if (!interactive || reduce) return;
        const { x, y } = point(event);
        const trail = trailRef.current;
        const last = trail[trail.length - 1];
        if (last && Math.hypot(x - last.x, y - last.y) < 16) return;
        trailRef.current = [...trail.slice(-11), { x, y, at: timeRef.current }];
      }}
      onPointerDown={(event) => {
        if (!interactive || reduce) return;
        const { x, y } = point(event);
        wavesRef.current = [
          ...wavesRef.current.slice(-5),
          { x, y, at: timeRef.current + 80, strength: 0.55 },
          { x, y, at: timeRef.current, strength: 1 },
        ];
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_88%)]"
      />
      {children}
    </div>
  );
}
