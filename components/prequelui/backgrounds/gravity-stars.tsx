"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useBackgroundPlayback, useCanvasSize } from "./shared";

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  glow: number;
};

export type GravityStarsBackgroundProps = React.ComponentProps<"div"> & {
  speed?: number;
  paused?: boolean;
  starsCount?: number;
  starsSize?: number;
  starsOpacity?: number;
  mouseInfluence?: number;
  gravityStrength?: number;
  gravity?: "attract" | "repel";
  glowIntensity?: number;
  interactive?: boolean;
  starColor?: string;
};

export function GravityStarsBackground({
  speed = 1,
  paused = false,
  starsCount = 80,
  starsSize = 2,
  starsOpacity = 0.75,
  mouseInfluence = 110,
  gravityStrength = 80,
  gravity = "attract",
  glowIntensity = 14,
  interactive = true,
  starColor = "#f8fafc",
  className,
  children,
  ...props
}: GravityStarsBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;
  const starsRef = React.useRef<Star[]>([]);
  const mouseRef = React.useRef({ x: -9999, y: -9999 });
  const drawRef = React.useRef<() => void>(() => {});
  const rate = Math.max(0.1, speed);

  const create = React.useCallback(
    (width: number, height: number): Star => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = (0.16 + Math.random() * 0.4) * rate;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        size: 1 + Math.random() * starsSize,
        opacity: starsOpacity,
        glow: 1,
      };
    },
    [rate, starsOpacity, starsSize],
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
    ctx.fillStyle = starColor;
    ctx.shadowColor = starColor;
    let blur = -1;
    for (const star of starsRef.current) {
      const next = glowIntensity * star.glow * 2;
      if (Math.abs(next - blur) > 1) {
        ctx.shadowBlur = next;
        blur = next;
      }
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [glowIntensity, starColor]);

  drawRef.current = draw;

  useCanvasSize(ref, canvasRef, () => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: starsCount }, () =>
        create(rect.width, rect.height),
      );
    }
    if (reduce) drawRef.current();
  });

  React.useEffect(() => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && starsRef.current.length !== starsCount) {
      starsRef.current = Array.from({ length: starsCount }, () =>
        create(rect.width, rect.height),
      );
    }
  }, [create, starsCount]);

  React.useEffect(() => {
    if (!playing) {
      drawRef.current();
      return;
    }
    let frame = 0;
    const tick = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouse = mouseRef.current;
      for (const star of starsRef.current) {
        const dx = mouse.x - star.x;
        const dy = mouse.y - star.y;
        const distance = Math.hypot(dx, dy);
        if (distance > 0 && distance < mouseInfluence) {
          const force = (mouseInfluence - distance) / mouseInfluence;
          const push = (force * gravityStrength * 0.0012) / rate;
          const direction = gravity === "attract" ? 1 : -1;
          star.vx += (dx / distance) * push * direction;
          star.vy += (dy / distance) * push * direction;
          star.opacity = Math.min(1, starsOpacity + force * 0.4);
          star.glow = 1 + force * 2;
        } else {
          star.opacity = Math.max(starsOpacity * 0.3, star.opacity - 0.02);
          star.glow = Math.max(1, star.glow - 0.06);
        }
        star.x += star.vx * rate;
        star.y += star.vy * rate;
        star.vx += (Math.random() - 0.5) * 0.0015;
        star.vy += (Math.random() - 0.5) * 0.0015;
        star.vx *= 0.999;
        star.vy *= 0.999;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;
      }
      drawRef.current();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [gravity, gravityStrength, mouseInfluence, playing, rate, starsOpacity]);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mouseRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  return (
    <div
      ref={ref}
      data-slot="gravity-stars-background"
      className={cn(
        "relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#191826_0%,#06060b_72%)]",
        className,
      )}
      {...props}
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        mouseRef.current = { x: -9999, y: -9999 };
      }}
    >
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}
