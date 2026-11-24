"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useBackgroundPlayback, useCanvasSize } from "./shared";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
};

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  target: number;
  color: string;
  size: number;
  trail: { x: number; y: number }[];
};

const PALETTE = ["#f97316", "#f43f5e", "#a855f7", "#22d3ee", "#facc15", "#34d399"];

export type FireworksBackgroundProps = React.ComponentProps<"div"> & {
  speed?: number;
  paused?: boolean;
  interactive?: boolean;
  population?: number;
  colors?: string[];
  particleCount?: number;
};

export function FireworksBackground({
  speed = 1,
  paused = false,
  interactive = true,
  population = 1,
  colors = PALETTE,
  particleCount = 64,
  className,
  children,
  ...props
}: FireworksBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;
  const rocketsRef = React.useRef<Rocket[]>([]);
  const sparksRef = React.useRef<Spark[]>([]);
  const nextLaunchRef = React.useRef(0);
  const drawRef = React.useRef<(clearOnly?: boolean) => void>(() => {});
  const rate = Math.max(0.1, speed);

  const explode = React.useCallback(
    (x: number, y: number, color: string) => {
      const count = Math.round(particleCount * Math.min(1.6, Math.max(0.4, rate)));
      for (let index = 0; index < count; index++) {
        const angle = Math.random() * Math.PI * 2;
        const velocity = 0.9 + Math.random() * 4.4;
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * velocity,
          vy: Math.sin(angle) * velocity,
          alpha: 1,
          decay: 0.005 + Math.random() * 0.01,
          size: 1.2 + Math.random() * 2.8,
          color,
        });
      }
    },
    [particleCount, rate],
  );

  const launch = React.useCallback(
    (x: number, target: number, color?: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      rocketsRef.current.push({
        x,
        y: rect.height * 1.02,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(3.4 + Math.random() * 2.2) * rate,
        target,
        color: color ?? colors[Math.floor(Math.random() * colors.length)] ?? PALETTE[0],
        size: 1.8 + Math.random() * 1.8,
        trail: [],
      });
    },
    [colors, rate],
  );

  const draw = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width < 2 || height < 2) return;
    const dpr = canvas.width / Math.max(1, width);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const background = ctx.createRadialGradient(
      width / 2,
      height * 0.8,
      0,
      width / 2,
      height * 0.8,
      Math.max(width, height) * 0.8,
    );
    background.addColorStop(0, "#10101c");
    background.addColorStop(1, "#040408");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    for (const rocket of rocketsRef.current) {
      if (rocket.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(rocket.trail[0]!.x, rocket.trail[0]!.y);
        for (const point of rocket.trail) ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = rocket.size;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      }
    }
    for (const spark of sparksRef.current) {
      ctx.globalAlpha = Math.max(0, spark.alpha);
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }, []);

  drawRef.current = draw;

  useCanvasSize(ref, canvasRef, () => {
    if (reduce) {
      sparksRef.current = [];
      rocketsRef.current = [];
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const spots = [0.3, 0.5, 0.72];
        for (const spot of spots) {
          explode(rect.width * spot, rect.height * (0.3 + Math.random() * 0.25), colors[0] ?? PALETTE[0]);
        }
        for (let step = 0; step < 22; step++) {
          for (const spark of sparksRef.current) {
            spark.x += spark.vx;
            spark.y += spark.vy;
            spark.vy += 0.05;
            spark.vx *= 0.985;
            spark.vy *= 0.985;
            spark.alpha *= 0.94;
          }
        }
      }
      drawRef.current();
    }
  });

  React.useEffect(() => {
    if (!playing) {
      if (reduce) drawRef.current();
      return;
    }
    let frame = 0;
    let last = performance.now();
    const first = canvasRef.current?.getBoundingClientRect();
    if (first) {
      explode(
        first.width * 0.5,
        first.height * 0.3,
        colors[1] ?? colors[0] ?? PALETTE[0],
      );
      nextLaunchRef.current = performance.now() + 260;
    }
    const tick = (now: number) => {
      const delta = Math.min(64, now - last);
      last = now;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      if (now > nextLaunchRef.current) {
        if (population > 0 && Math.random() < population) {
          launch(
            rect.width * (0.12 + Math.random() * 0.76),
            rect.height * (0.12 + Math.random() * 0.3),
          );
        }
        nextLaunchRef.current = now + (260 + Math.random() * 520) / Math.max(0.2, population);
      }
      for (let index = rocketsRef.current.length - 1; index >= 0; index--) {
        const rocket = rocketsRef.current[index]!;
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > 18) rocket.trail.shift();
        rocket.x += rocket.vx * rate;
        rocket.y += rocket.vy * rate;
        rocket.vy += 0.028 * delta * 0.06;
        if (rocket.vy >= 0 || rocket.y <= rocket.target) {
          explode(rocket.x, rocket.y, rocket.color);
          rocketsRef.current.splice(index, 1);
        }
      }
      for (let index = sparksRef.current.length - 1; index >= 0; index--) {
        const spark = sparksRef.current[index]!;
        spark.vx *= 0.985;
        spark.vy *= 0.985;
        spark.vy += 0.045;
        spark.x += spark.vx * rate;
        spark.y += spark.vy * rate;
        spark.alpha -= spark.decay;
        if (spark.alpha <= 0) sparksRef.current.splice(index, 1);
      }
      drawRef.current();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [explode, launch, playing, population, rate, reduce]);

  return (
    <div
      ref={ref}
      data-slot="fireworks-background"
      className={cn("relative size-full overflow-hidden bg-[#040408]", className)}
      {...props}
      onClick={(event) => {
        if (!interactive || !playing) return;
        const rect = event.currentTarget.getBoundingClientRect();
        launch(event.clientX - rect.left, event.clientY - rect.top);
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}
