"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useBackgroundPlayback } from "./shared";

export type GradientBackgroundProps = React.ComponentProps<"div"> & {
  speed?: number;
  paused?: boolean;
  gradient?: string;
};

const DEFAULT_GRADIENT =
  "linear-gradient(120deg, #312e81 0%, #6d28d9 24%, #be185d 48%, #c2410c 72%, #0f766e 100%)";

export function GradientBackground({
  speed = 1,
  paused = false,
  gradient = DEFAULT_GRADIENT,
  className,
  children,
  ...props
}: GradientBackgroundProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { playing: live, reduce } = useBackgroundPlayback(ref);
  const playing = live && !paused;
  const duration = 16 / Math.max(0.1, speed);

  return (
    <div
      ref={ref}
      data-slot="gradient-background"
      className={cn("relative size-full overflow-hidden bg-[#0a0910]", className)}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        animate={
          playing
            ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }
            : { backgroundPosition: "0% 50%" }
        }
        transition={
          playing
            ? { duration, ease: "easeInOut", repeat: Infinity }
            : { duration: 0 }
        }
        className="absolute -inset-[35%] opacity-90 blur-[10px]"
        style={{
          backgroundImage: gradient,
          backgroundSize: "400% 400%",
          backgroundPosition: reduce ? "35% 50%" : undefined,
          willChange: "background-position",
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={
          playing
            ? { x: ["-12%", "14%", "-12%"], y: ["-8%", "10%", "-8%"], scale: [1, 1.25, 1] }
            : { x: "-12%", y: "-8%" }
        }
        transition={
          playing
            ? { duration: duration * 1.6, ease: "easeInOut", repeat: Infinity }
            : { duration: 0 }
        }
        className="absolute left-[8%] top-[4%] size-[70%] rounded-full opacity-70 blur-[60px]"
        style={{
          background: "radial-gradient(circle, rgba(45,212,191,0.75), transparent 68%)",
          willChange: "transform",
        }}
      />
      <motion.div
        aria-hidden="true"
        animate={
          playing
            ? { x: ["10%", "-16%", "10%"], y: ["12%", "-10%", "12%"], scale: [1.1, 0.9, 1.1] }
            : { x: "10%", y: "12%" }
        }
        transition={
          playing
            ? { duration: duration * 2.1, ease: "easeInOut", repeat: Infinity }
            : { duration: 0 }
        }
        className="absolute bottom-[2%] right-[2%] size-[74%] rounded-full opacity-70 blur-[70px]"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.72), transparent 66%)",
          willChange: "transform",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(5,4,10,0.6))]"
      />
      {children}
    </div>
  );
}
