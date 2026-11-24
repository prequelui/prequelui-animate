"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { thumbSpring, useReduceMotion } from "./motion";

export type SwitchProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> & {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function Switch({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  className,
  onClick,
  ...props
}: SwitchProps) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const controlled = checkedProp !== undefined;
  const checked = controlled ? checkedProp : internal;
  const reduce = useReduceMotion();
  const [pressed, setPressed] = React.useState(false);

  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (!controlled) setInternal(next);
    onCheckedChange?.(next);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) toggle();
      }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className,
      )}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        animate={{
          x: checked ? 20 : 0,
          width: pressed && !reduce ? 26 : 20,
        }}
        transition={reduce ? { duration: 0 } : thumbSpring}
        className="block size-5 rounded-full bg-background shadow-sm"
      />
    </button>
  );
}
