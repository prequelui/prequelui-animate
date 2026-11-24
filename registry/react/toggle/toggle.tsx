"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ToggleProps = {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  children?: React.ReactNode;
  className?: string;
};

const press = { type: "spring", stiffness: 550, damping: 30 } as const;

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  children = "Live preview",
  className,
}: ToggleProps) {
  const [internal, setInternal] = React.useState(defaultPressed);
  const value = pressed ?? internal;
  const reduce = useReducedMotion();

  const toggle = () => {
    const next = !value;
    if (pressed === undefined) setInternal(next);
    onPressedChange?.(next);
  };

  return (
    <motion.button
      type="button"
      aria-pressed={value}
      onClick={toggle}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={press}
      className={cn(
        "relative inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-colors duration-200",
        value
          ? "bg-primary text-primary-foreground"
          : "bg-background text-muted-foreground hover:bg-accent",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "block size-2 rounded-full transition-colors duration-200",
          value ? "bg-[#7ee2a8]" : "bg-muted-foreground/50",
        )}
      />
      {children}
    </motion.button>
  );
}
