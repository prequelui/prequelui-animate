"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

const thumb = { type: "spring", stiffness: 300, damping: 25 } as const;

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  label = "Enable notifications",
  disabled = false,
  className,
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const value = checked ?? internal;
  const [pressed, setPressed] = React.useState(false);
  const reduce = useReducedMotion();

  const toggle = () => {
    if (disabled) return;
    const next = !value;
    if (checked === undefined) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <label className={cn("flex items-center gap-3 text-[13px]", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={typeof label === "string" ? label : undefined}
        disabled={disabled}
        onClick={toggle}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        className={cn(
          "relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
          value ? "bg-primary" : "bg-input",
        )}
      >
        <motion.span
          aria-hidden="true"
          animate={{ x: value ? 20 : 0, width: pressed && !reduce ? 24 : 20 }}
          transition={reduce ? { duration: 0 } : thumb}
          className="block h-5 rounded-full bg-background shadow-sm"
        />
      </button>
      {label && <span>{label}</span>}
    </label>
  );
}
