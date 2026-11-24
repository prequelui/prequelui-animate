"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItemData = {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
};

export type AccordionProps = {
  items: AccordionItemData[];
  type?: "single" | "multiple";
  defaultValue?: string | string[];
  collapsible?: boolean;
  className?: string;
};

const heightSpring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  bounce: 0,
  restDelta: 0.01,
} as const;

const fade = { duration: 0.25, ease: [0.215, 0.61, 0.355, 1] } as const;

function toArray(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function Accordion({
  items,
  type = "single",
  defaultValue,
  collapsible = true,
  className,
}: AccordionProps) {
  const [open, setOpen] = React.useState<string[]>(() => toArray(defaultValue));
  const reduce = useReducedMotion();
  const baseId = React.useId();

  const toggle = (value: string) => {
    setOpen((current) => {
      const isOpen = current.includes(value);
      if (type === "single") {
        if (isOpen) return collapsible ? [] : current;
        return [value];
      }
      return isOpen ? current.filter((entry) => entry !== value) : [...current, value];
    });
  };

  return (
    <div data-slot="accordion" className={cn("w-full", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.value);
        const panelId = `${baseId}-${item.value}`;
        return (
          <div
            key={item.value}
            data-slot="accordion-item"
            data-state={isOpen ? "open" : "closed"}
            className="border-b last:border-b-0"
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(item.value)}
              className="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[13.5px] font-medium outline-none transition-colors focus-visible:text-foreground"
            >
              <span>{item.title}</span>
              <motion.span
                aria-hidden="true"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={heightSpring}
                className="text-muted-foreground"
              >
                <ChevronDown className="size-4" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  initial={
                    reduce
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0, filter: "blur(2px)" }
                  }
                  animate={
                    reduce
                      ? { opacity: 1 }
                      : { height: "auto", opacity: 1, filter: "blur(0px)" }
                  }
                  exit={
                    reduce
                      ? { opacity: 0 }
                      : { height: 0, opacity: 0, filter: "blur(2px)" }
                  }
                  transition={
                    reduce
                      ? { duration: 0.2 }
                      : { height: heightSpring, opacity: fade, filter: fade }
                  }
                  className="overflow-hidden"
                >
                  <div className="pb-4 pr-6 text-[13px] leading-6 text-muted-foreground">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
