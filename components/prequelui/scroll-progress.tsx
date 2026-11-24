"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { scrollSpring, useTempoTransition } from "./motion";

export type ScrollProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  containerRef?: React.RefObject<HTMLElement | null>;
  barClassName?: string;
  transition?: Transition;
};

export function ScrollProgress({
  containerRef,
  barClassName,
  transition,
  className,
  ...props
}: ScrollProgressProps) {
  const progress = useMotionValue(0);
  const spring = useTempoTransition(transition ?? scrollSpring);
  const smooth = useSpring(progress, spring);

  React.useEffect(() => {
    const target = containerRef?.current;
    const read = () => {
      if (target) {
        const max = target.scrollHeight - target.clientHeight;
        progress.set(max > 0 ? Math.min(1, Math.max(0, target.scrollTop / max)) : 0);
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
      }
    };
    read();
    const node: HTMLElement | Window = target ?? window;
    node.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      node.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [containerRef, progress]);

  return (
    <div
      role="progressbar"
      aria-label="Scroll progress"
      data-slot="scroll-progress"
      className={cn("h-1 w-full overflow-hidden bg-accent", className)}
      {...props}
    >
      <motion.div
        style={{ scaleX: smooth }}
        className={cn("h-full origin-left bg-foreground", barClassName)}
      />
    </div>
  );
}
