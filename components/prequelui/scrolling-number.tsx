"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import { srOnlyStyle, useReduceMotion, useSeen, useTempoTransition } from "./motion";

const bandSpring: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 30,
  restDelta: 0.001,
  restSpeed: 0.01,
};

export type ScrollingNumberProps = Omit<React.ComponentProps<"div">, "children"> & {
  number: number;
  fromNumber?: number;
  step?: number;
  itemsSize?: number;
  sideItemsCount?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  delay?: number;
  transition?: Transition;
  onCompleted?: () => void;
};

export function ScrollingNumber({
  number,
  fromNumber = 0,
  step = 1,
  itemsSize = 30,
  sideItemsCount = 2,
  inView = false,
  inViewOnce = true,
  delay = 0,
  transition,
  onCompleted,
  className,
  ...props
}: ScrollingNumberProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const seen = useSeen(ref, inView, inViewOnce);
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? bandSpring);
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    if (!seen) return;
    if (reduce) {
      setStarted(true);
      onCompleted?.();
      return;
    }
    const timer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay, onCompleted, reduce, seen]);

  const values = React.useMemo(() => {
    const size = Math.max(1, step);
    const from = Math.round(fromNumber / size) * size;
    const to = Math.round(number / size) * size;
    const direction = to >= from ? 1 : -1;
    const count = Math.abs(Math.round((to - from) / size)) + 1;
    return Array.from({ length: count }, (_, index) => from + index * size * direction);
  }, [fromNumber, number, step]);

  const targetIndex = values.length - 1;
  const height = itemsSize * (1 + sideItemsCount * 2);
  const initialY = sideItemsCount * itemsSize;
  const finalY = (sideItemsCount - targetIndex) * itemsSize;

  return (
    <div
      ref={ref}
      data-slot="scrolling-number"
      className={cn(
        "relative isolate inline-block overflow-hidden rounded-lg [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_76%,transparent)]",
        className,
      )}
      style={{ height }}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-1 top-1/2 z-10 -translate-y-1/2 rounded-md border bg-foreground/[0.06] dark:bg-background/20"
        style={{ height: itemsSize }}
      />
      <motion.div
        aria-hidden="true"
        animate={{ y: started ? finalY : initialY }}
        transition={reduce ? { duration: 0 } : spring}
        onAnimationComplete={() => {
          if (started) onCompleted?.();
        }}
        className="relative flex flex-col"
      >
        {values.map((value) => (
          <div
            key={value}
            className={cn(
              "flex shrink-0 items-center justify-center font-medium tabular-nums",
              value === number ? "text-foreground" : "text-muted-foreground/50",
            )}
            style={{ height: itemsSize }}
          >
            {value.toLocaleString("en-US")}
          </div>
        ))}
      </motion.div>
      <span className="sr-only" style={srOnlyStyle()}>
        {number.toLocaleString("en-US")}
      </span>
    </div>
  );
}
