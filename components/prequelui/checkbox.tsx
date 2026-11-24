"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { checkSpring, useReduceMotion } from "./motion";

export type CheckboxProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Checkbox({
  checked: checkedProp,
  defaultChecked = false,
  indeterminate = false,
  onCheckedChange,
  disabled = false,
  className,
  onClick,
  ...props
}: CheckboxProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const controlled = checkedProp !== undefined;
  const checked = controlled ? checkedProp : internal;
  const reduce = useReduceMotion();

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!controlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      data-state={indeterminate ? "indeterminate" : checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      className={cn(
        "relative flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-[6px] border outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        checked || indeterminate ? "border-primary bg-primary" : "bg-background",
        className,
      )}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ scale: checked || indeterminate ? 1 : 0, opacity: checked || indeterminate ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : checkSpring}
        className="absolute inset-0 bg-primary"
      />
      <svg viewBox="0 0 24 24" fill="none" className="relative size-3.5" aria-hidden="true">
        {indeterminate ? (
          <motion.path
            d="M6 12h12"
            stroke="var(--primary-foreground)"
            strokeWidth="2.4"
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <motion.path
            d="M5 12.5 10 17.5 19 7"
            stroke="var(--primary-foreground)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{
              pathLength: checked ? 1 : 0,
              opacity: checked ? 1 : 0,
            }}
            transition={{
              duration: reduce ? 0 : 0.3,
              ease: [0, 0, 0.58, 1],
              delay: reduce ? 0 : checked ? 0.2 : 0,
            }}
          />
        )}
      </svg>
    </button>
  );
}
