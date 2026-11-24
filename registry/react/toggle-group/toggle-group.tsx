"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type ToggleGroupItem = {
  value: string;
  label: string;
};

export type ToggleGroupProps = {
  items?: Array<ToggleGroupItem | string>;
  type?: "single" | "multiple";
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  className?: string;
};

const FALLBACK = ["day", "week", "month"];
const selection = { type: "spring", stiffness: 300, damping: 30 } as const;
const press = { type: "spring", stiffness: 550, damping: 30 } as const;

function normalize(items: Array<ToggleGroupItem | string>): ToggleGroupItem[] {
  return items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );
}

function asArray(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function ToggleGroup({
  items = FALLBACK,
  type = "single",
  value,
  defaultValue,
  onValueChange,
  className,
}: ToggleGroupProps) {
  const options = normalize(items);
  const [internal, setInternal] = React.useState(() =>
    asArray(defaultValue ?? options[0]?.value),
  );
  const selected = asArray(value ?? internal);
  const reduce = useReducedMotion();
  const baseId = React.useId();

  const toggle = (next: string) => {
    let result: string[];
    if (type === "single") {
      result = selected.includes(next) ? [] : [next];
    } else {
      result = selected.includes(next)
        ? selected.filter((entry) => entry !== next)
        : [...selected, next];
    }
    if (value === undefined) setInternal(result);
    onValueChange?.(type === "single" ? (result[0] ?? "") : result);
  };

  return (
    <div role="group" className={cn("flex items-center rounded-lg bg-accent p-1", className)}>
      {options.map((item) => {
        const active = selected.includes(item.value);
        return (
          <motion.button
            key={item.value}
            type="button"
            aria-pressed={active}
            onClick={() => toggle(item.value)}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            transition={press}
            className={cn(
              "relative rounded-md px-3 py-1.5 text-[13px] capitalize transition-colors",
              active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId={`${baseId}-${type === "single" ? "group" : item.value}`}
                aria-hidden="true"
                className="absolute inset-0 rounded-md bg-background shadow-sm"
                transition={reduce ? { duration: 0 } : selection}
              />
            )}
            <span className="relative">{item.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
