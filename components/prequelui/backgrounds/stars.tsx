"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { cn } from "@/lib/utils";
import { seeded, useBackgroundPlayback } from "./shared";

export type StarsBackgroundProps = React.ComponentProps<"div"> & {
  speed?: number;
  paused?: boolean;
  starColor?: string;
  factor?: number;
  pointerEvents?: boolean;
};

const LAYERS = [
  { count: 1100, size: 1, multiplier: 1, opacity: 0.55 },
  { count: 480, size: 2, multiplier: 2, opacity: 0.75 },
  { count: 220, size: 3, multiplier: 3, opacity: 0.95 },
];

function buildShadows(count: number, salt: number) {
  const shadows: string[] = [];
  for (let index = 0; index < count; index++) {
    const x = Math.round((seeded(index + salt * 1000, 1.7) - 0.5) * 2800);
    const y = Math.round((seeded(index + salt * 1000, 2.9) - 0.5) * 2800);
    shadows.push(`${x}px ${y}px`);
  }
  return shadows.join(",");
}

function StarLayer({
  count,
  size,
  multiplier,
  opacity,
  speed,
  starColor,
  playing,
  reduce,
}: {
  count: number;
  size: number;
  multiplier: number;
  opacity: number;
  speed: number;
  starColor: string;
  playing: boolean;
  reduce: boolean;
}) {
  const shadows = React.useMemo(
    () => buildShadows(count, multiplier),
    [count, multiplier],
  );
  const duration = (50 * multiplier) / Math.max(0.1, speed);

  return (
    <motion.div
      aria-hidden="true"
      animate={playing ? { y: [0, -2000] } : { y: 0 }}
      transition={
        playing
          ? { duration, repeat: Infinity, ease: "linear" }
          : { duration: 0 }
      }
      className="absolute left-0 top-0 h-[2000px] w-full"
      style={{ willChange: "transform" }}
    >
      <div
        className="absolute rounded-full bg-transparent"
        style={{
          width: size,
          height: size,
          color: starColor,
          boxShadow: shadows,
          opacity: reduce ? opacity * 0.8 : opacity,
        }}
      />
      <div
        className="absolute top-[2000px] rounded-full bg-transparent"
        style={{
          width: size,
          height: size,
          color: starColor,
          boxShadow: shadows,
          opacity: reduce ? opacity * 0.8 : opacity,
        }}
      />
    </motion.div>
  );
}

export function StarsBackground({
  speed = 50,
  paused = false,
  starColor = "#f8fafc",
  factor = 0.05,
  pointerEvents = true,
  className,
  children,
  ...props
}: StarsBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;

  const offsetX = useMotionValue(0);
  const offsetY = useMotionValue(0);
  const x = useSpring(offsetX, { stiffness: 50, damping: 20 });
  const y = useSpring(offsetY, { stiffness: 50, damping: 20 });

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    offsetX.set(-(event.clientX - rect.left - rect.width / 2) * factor);
    offsetY.set(-(event.clientY - rect.top - rect.height / 2) * factor);
  };

  return (
    <div
      ref={ref}
      data-slot="stars-background"
      onPointerMove={onPointerMove}
      className={cn(
        "relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#17172a_0%,#05050a_75%)]",
        className,
      )}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        style={{ x, y }}
        className={cn("absolute inset-0", !pointerEvents && "pointer-events-none")}
      >
        {LAYERS.map((layer) => (
          <StarLayer
            key={layer.multiplier}
            {...layer}
            speed={speed}
            starColor={starColor}
            playing={playing}
            reduce={reduce}
          />
        ))}
      </motion.div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,10,0.7))]"
      />
      {children}
    </div>
  );
}
