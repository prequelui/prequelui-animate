"use client";

import * as React from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "./motion";

export type SpotlightCardProps = React.ComponentProps<"div"> & {
  color?: string;
  size?: number;
  intensity?: number;
  alwaysOn?: boolean;
};

export function SpotlightCard({
  color = "rgba(255,255,255,0.16)",
  size = 280,
  intensity = 1,
  alwaysOn = false,
  className,
  children,
  style,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...props
}: SpotlightCardProps) {
  const reduce = useReduceMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 260, damping: 34, mass: 0.5 });
  const springY = useSpring(pointerY, { stiffness: 260, damping: 34, mass: 0.5 });
  const [active, setActive] = React.useState(alwaysOn);

  const gradient = useMotionTemplate`radial-gradient(${size}px circle at ${springX}px ${springY}px, ${color}, transparent 68%)`;

  const update = (event: React.PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  React.useEffect(() => {
    if (!alwaysOn || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    pointerX.set(rect.width / 2);
    pointerY.set(rect.height / 2);
  }, [alwaysOn, pointerX, pointerY]);

  return (
    <div
      ref={ref}
      data-slot="spotlight-card"
      className={cn(
        "relative isolate overflow-hidden rounded-xl border bg-card text-card-foreground",
        className,
      )}
      style={style}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (event.pointerType === "touch") return;
        update(event);
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        if (reduce || event.pointerType === "touch") return;
        update(event);
        setActive(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        if (alwaysOn) return;
        setActive(false);
      }}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        data-slot="spotlight-card-light"
        className="pointer-events-none absolute -inset-px z-0 rounded-[inherit]"
        animate={{ opacity: active && !reduce ? intensity : alwaysOn ? intensity : 0 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        style={{ background: gradient }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_38%)]"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
