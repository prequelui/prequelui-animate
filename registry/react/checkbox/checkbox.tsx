"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

const checkSpring = { type: "spring", stiffness: 500, damping: 24 } as const;

export function Checkbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label = "Accept terms",
  disabled = false,
  className,
}: CheckboxProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const value = checked ?? internal;
  const reduce = useReducedMotion();

  const toggle = () => {
    if (disabled) return;
    const next = !value;
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <label className={cn("flex items-center gap-2.5 text-[13px]", className)}>
      <button
        type="button"
        role="checkbox"
        aria-checked={value}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative flex size-4 items-center justify-center rounded-[4px] border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          value ? "border-foreground" : "border-input",
        )}
      >
        {value && (
          <motion.span
            aria-hidden="true"
            initial={reduce ? false : { scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={checkSpring}
            className="absolute inset-0 rounded-[3px] bg-foreground"
          />
        )}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative size-3 text-background"
        >
          <motion.path
            d="m5 12 4 4L19 6"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: value ? 1 : 0 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.25, ease: [0.23, 1, 0.32, 1] }
            }
          />
        </svg>
      </button>
      <span>{label}</span>
    </label>
  );
}
