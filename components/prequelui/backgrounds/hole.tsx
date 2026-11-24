"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { seeded, useBackgroundPlayback, useCanvasSize } from "./shared";

type Particle = { x: number; y: number; vy: number; size: number; alpha: number };

export type HoleBackgroundProps = React.ComponentProps<"div"> & {
  speed?: number;
  paused?: boolean;
  rings?: number;
  particles?: number;
  strokeColor?: string;
};

export function HoleBackground({
  speed = 1,
  paused = false,
  rings = 34,
  particles = 80,
  strokeColor = "255,255,255",
  className,
  children,
  ...props
}: HoleBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;
  const timeRef = React.useRef(0);
  const particlesRef = React.useRef<Particle[]>([]);
  const drawRef = React.useRef<(time: number) => void>(() => {});
  const rate = Math.max(0.1, speed);

  const spawn = React.useCallback(
    (width: number, height: number): Particle => ({
      x: width / 2 + (seeded(particlesRef.current.length + Math.random() * 100, 1.3) - 0.5) * width * 0.42,
      y: height * (0.2 + Math.random() * 0.8),
      vy: 0.35 + Math.random() * 1.1,
      size: 0.7 + seeded(Math.random() * 100, 2.7) * 2.2,
      alpha: 0.2 + Math.random() * 0.7,
    }),
    [],
  );

  const draw = React.useCallback(
    (time: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const dpr = canvas.width / Math.max(1, canvas.getBoundingClientRect().width);
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      if (width < 2 || height < 2) return;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      const background = ctx.createRadialGradient(
        width / 2,
        height * 0.42,
        0,
        width / 2,
        height * 0.42,
        Math.max(width, height) * 0.8,
      );
      background.addColorStop(0, "#14121f");
      background.addColorStop(0.55, "#0a0912");
      background.addColorStop(1, "#040408");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, width, height);

      const glow = ctx.createLinearGradient(0, height * 0.1, 0, height);
      glow.addColorStop(0, "rgba(34,211,238,0)");
      glow.addColorStop(0.35, "rgba(34,211,238,0.18)");
      glow.addColorStop(0.62, "rgba(244,114,182,0.16)");
      glow.addColorStop(1, "rgba(245,158,11,0)");
      ctx.fillStyle = glow;
      ctx.fillRect(width * 0.36, height * 0.08, width * 0.28, height * 0.92);

      const phase = (time * 0.000045 * rate) % 1;
      const count = Math.max(6, rings);
      for (let index = 0; index < count; index++) {
        const local = (index / count + phase) % 1;
        const scale = 1 - local;
        const cx = width / 2;
        const cy = height * 0.44 + local * height * 0.54;
        const rx = width * 0.74 * scale;
        const ry = height * 0.66 * scale;
        if (rx <= 0.5 || ry <= 0.5) continue;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${strokeColor},${0.03 + scale * 0.32})`;
        ctx.lineWidth = 1 + scale * 0.7;
        ctx.stroke();
      }

      if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: particles }, () => spawn(width, height));
      }
      for (const particle of particlesRef.current) {
        particle.y -= particle.vy * rate;
        if (particle.y < -4) {
          Object.assign(particle, spawn(width, height), { y: height + 4 });
        }
        const fade = Math.sin((particle.y / height) * Math.PI);
        ctx.beginPath();
        ctx.rect(particle.x, particle.y, particle.size, particle.size);
        ctx.fillStyle = `rgba(${strokeColor},${Math.max(0, particle.alpha * fade)})`;
        ctx.fill();
      }

      ctx.fillStyle = "rgba(255,255,255,0.018)";
      for (let line = 0; line < height; line += 3) {
        ctx.fillRect(0, line, width, 1);
      }
    },
    [particles, rate, rings, spawn, strokeColor],
  );

  drawRef.current = draw;

  useCanvasSize(ref, canvasRef, () => {
    particlesRef.current = [];
    drawRef.current(reduce ? 8000 : timeRef.current);
  });

  React.useEffect(() => {
    if (!playing) {
      drawRef.current(reduce ? 8000 : timeRef.current);
      return;
    }
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      timeRef.current += Math.min(64, now - last);
      last = now;
      drawRef.current(timeRef.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, reduce]);

  return (
    <div
      ref={ref}
      data-slot="hole-background"
      className={cn("relative size-full overflow-hidden bg-[#040408]", className)}
      {...props}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_72%,rgba(168,85,247,0.20),transparent_60%)] mix-blend-overlay"
      />
      {children}
    </div>
  );
}
