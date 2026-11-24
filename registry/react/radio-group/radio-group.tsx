"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type RadioGroupItem = {
  value: string;
  label: string;
  hint?: string;
};

export type RadioGroupProps = {
  items?: RadioGroupItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

const FALLBACK: RadioGroupItem[] = [
  { value: "standard", label: "Standard", hint: "5–7 business days" },
  { value: "express", label: "Express", hint: "2–3 business days" },
  { value: "overnight", label: "Overnight", hint: "Next business day" },
];

const dot = { type: "spring", stiffness: 200, damping: 16 } as const;
const press = { type: "spring", stiffness: 550, damping: 30 } as const;

export function RadioGroup({
  items = FALLBACK,
  value,
  defaultValue = "standard",
  onValueChange,
  className,
}: RadioGroupProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const reduce = useReducedMotion();

  const choose = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <div role="radiogroup" className={cn("flex flex-col gap-2", className)}>
      {items.map((item) => {
        const active = item.value === current;
        return (
          <motion.button
            key={item.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => choose(item.value)}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={press}
            className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-accent"
          >
            <span className="flex size-4 items-center justify-center rounded-full border">
              <motion.span
                aria-hidden="true"
                animate={reduce ? { scale: active ? 1 : 0 } : { scale: active ? 1 : 0 }}
                transition={reduce ? { duration: 0.15 } : dot}
                className="size-2 rounded-full bg-foreground"
              />
            </span>
            <span className="flex-1">{item.label}</span>
            {item.hint && (
              <span className="text-[13px] text-muted-foreground">{item.hint}</span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
