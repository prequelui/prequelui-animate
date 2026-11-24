"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type CollapsibleProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
};

const resize = { duration: 0.45, ease: [0.4, 0, 0.1, 1] } as const;

export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  trigger = "Show details",
  children,
  className,
}: CollapsibleProps) {
  const [internal, setInternal] = React.useState(defaultOpen);
  const value = open ?? internal;
  const reduce = useReducedMotion();
  const id = React.useId();

  const toggle = () => {
    const next = !value;
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  };

  return (
    <div data-slot="collapsible" className={cn("w-full", className)}>
      <button
        type="button"
        aria-expanded={value}
        aria-controls={id}
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 py-3 text-left text-[13.5px] font-medium outline-none"
      >
        <span>{trigger}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: value ? 180 : 0 }}
          transition={resize}
          className="text-muted-foreground"
        >
          <ChevronDown className="size-4" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {value && (
          <motion.div
            id={id}
            role="region"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0.2 } : resize}
            className="overflow-hidden"
          >
            <div className="pb-3 text-[13px] leading-6 text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
