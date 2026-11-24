"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { cursorEntry, cursorExit, cursorLabel, useReduceMotion } from "./motion";

export type CursorProps = React.ComponentProps<"div"> & {
  label?: React.ReactNode;
  dotSize?: number;
  labelGap?: number;
  hideNative?: boolean;
};

export function Cursor({
  label,
  dotSize = 12,
  labelGap = 14,
  hideNative = true,
  className,
  children,
  onPointerMove,
  onPointerEnter,
  onPointerLeave,
  ...props
}: CursorProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReduceMotion();
  const [inside, setInside] = React.useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const labelX = useSpring(x, cursorLabel);
  const labelY = useSpring(y, cursorLabel);
  const dotX = useTransform(x, (value) => value - dotSize / 2);
  const dotY = useTransform(y, (value) => value - dotSize / 2);
  const tipX = useTransform(labelX, (value) => value + labelGap);
  const tipY = useTransform(labelY, (value) => value + labelGap - 8);

  return (
    <div
      ref={ref}
      data-slot="cursor"
      className={cn("relative", hideNative && "cursor-none", className)}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set(event.clientX - rect.left);
        y.set(event.clientY - rect.top);
      }}
      onPointerEnter={(event) => {
        onPointerEnter?.(event);
        setInside(true);
      }}
      onPointerLeave={(event) => {
        onPointerLeave?.(event);
        setInside(false);
      }}
      {...props}
    >
      {children}
      <AnimatePresence>
        {inside ? (
          <React.Fragment key="cursor">
            <motion.span
              aria-hidden="true"
              data-slot="cursor-dot"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={reduce ? { duration: 0 } : cursorEntry}
              style={{ x: dotX, y: dotY, width: dotSize, height: dotSize }}
              className="pointer-events-none absolute left-0 top-0 z-50 rounded-full bg-foreground"
            />
            {label ? (
              <motion.span
                aria-hidden="true"
                data-slot="cursor-label"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={reduce ? { duration: 0 } : cursorExit}
                style={{ x: tipX, y: tipY }}
                className="pointer-events-none absolute left-0 top-0 z-50 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[13px] font-medium text-background"
              >
                {label}
              </motion.span>
            ) : null}
          </React.Fragment>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
