"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

export type TabsProps = {
  items?: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

const FALLBACK: TabItem[] = [
  { value: "overview", label: "Overview", content: "A calm summary of the workspace, its members and the latest activity." },
  { value: "activity", label: "Activity", content: "Every change, in order. Hover a row to see who made it and when." },
  { value: "settings", label: "Settings", content: "Name, visibility and notification preferences for this project." },
];

const selection = { type: "spring", stiffness: 300, damping: 30 } as const;
const panelIn = { duration: 0.3, ease: [0.25, 0.1, 0.35, 1] } as const;
const panelOut = { duration: 0.15, ease: [0, 0, 0.58, 1] } as const;
const resize = { duration: 0.45, ease: [0.4, 0, 0.1, 1] } as const;

export function Tabs({
  items = FALLBACK,
  value,
  defaultValue = "",
  onValueChange,
  className,
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue || items[0]?.value || "");
  const current = value ?? internal;
  const reduce = useReducedMotion();
  const baseId = React.useId();
  const active = items.find((item) => item.value === current) ?? items[0];
  const triggers = React.useRef<Array<HTMLButtonElement | null>>([]);

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };

  const onKey = (event: React.KeyboardEvent, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + items.length) % items.length;
    const item = items[next];
    if (!item) return;
    select(item.value);
    triggers.current[next]?.focus();
  };

  return (
    <motion.div
      layout
      transition={reduce ? { duration: 0 } : resize}
      className={cn("w-full max-w-[460px]", className)}
    >
      <div role="tablist" aria-label="Tabs" className="flex items-center gap-1 rounded-lg bg-accent p-1">
        {items.map((item, index) => {
          const selected = item.value === active?.value;
          return (
            <button
              key={item.value}
              ref={(node) => {
                triggers.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-trigger-${item.value}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.value}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(item.value)}
              onKeyDown={(event) => onKey(event, index)}
              className={cn(
                "relative flex-1 rounded-md px-3 py-1.5 text-[13px] outline-none transition-colors duration-200",
                selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-tabs-indicator`}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-md bg-background shadow-sm"
                  transition={reduce ? { duration: 0 } : selection}
                />
              )}
              <span className="relative">{item.label}</span>
            </button>
          );
        })}
      </div>
      <div className="relative mt-4 min-h-[72px] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {active && (
            <motion.div
              key={active.value}
              role="tabpanel"
              id={`${baseId}-panel-${active.value}`}
              aria-labelledby={`${baseId}-trigger-${active.value}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12, filter: "blur(5px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, x: -12, filter: "blur(5px)", transition: panelOut }
              }
              transition={reduce ? { duration: 0.2 } : panelIn}
              className="rounded-lg border bg-background p-4 text-[13px] leading-6 text-muted-foreground outline-none"
            >
              {active.content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
