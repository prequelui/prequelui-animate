"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectItem = { value: string; label: string };

export type SelectProps = {
  items?: Array<SelectItem | string>;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

const FALLBACK = ["Design", "Engineering", "Marketing", "Support"];
const soft = [0.215, 0.61, 0.355, 1] as const;
const leave = [0, 0, 0.58, 1] as const;

function normalize(items: Array<SelectItem | string>): SelectItem[] {
  return items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item,
  );
}

export function Select({
  items = FALLBACK,
  value,
  defaultValue = "",
  placeholder = "Select an option",
  onValueChange,
  className,
}: SelectProps) {
  const options = normalize(items);
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const reduce = useReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);
  const baseId = React.useId();
  const selected = options.find((option) => option.value === current);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => document.removeEventListener("pointerdown", onPointer);
  }, [open]);

  const choose = (option: SelectItem) => {
    if (value === undefined) setInternal(option.value);
    onValueChange?.(option.value);
    setOpen(false);
  };

  const onKey = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => Math.min(options.length - 1, index + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(0, index - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[active];
      if (option) choose(option);
    }
  };

  const lit = hovered ?? options[active]?.value;

  return (
    <div ref={root} className={cn("relative w-[220px] text-[13px]", className)} onKeyDown={onKey}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((state) => !state)}
        className="flex h-9 w-full items-center justify-between rounded-lg border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <span className={selected ? "" : "text-muted-foreground"}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="listbox"
            aria-label={placeholder}
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: leave } }}
            transition={reduce ? { duration: 0.15 } : { duration: 0.22, ease: soft }}
            style={{ transformOrigin: "top" }}
            className="absolute left-0 top-full z-40 mt-1.5 w-full rounded-xl border bg-popover p-1 shadow-lg"
          >
            {options.map((option, index) => {
              const isSelected = option.value === current;
              return (
                <motion.button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  initial={reduce ? false : { opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22, ease: soft, delay: index * 0.03 }}
                  onPointerEnter={() => {
                    setHovered(option.value);
                    setActive(index);
                  }}
                  onPointerLeave={() => setHovered(null)}
                  onClick={() => choose(option)}
                  className="relative flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-muted-foreground"
                >
                  {lit === option.value && (
                    <motion.span
                      layoutId={`${baseId}-select-highlight`}
                      className="absolute inset-0 rounded-md bg-accent"
                      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative">{option.label}</span>
                  {isSelected && <Check className="relative size-3.5" />}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
