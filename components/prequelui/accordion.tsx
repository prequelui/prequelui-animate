"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  disclosureTween,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

type AccordionType = "single" | "multiple";

type AccordionContextValue = {
  values: string[];
  toggle: (value: string) => void;
  transition: Transition;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion(component: string) {
  const context = React.useContext(AccordionContext);
  if (!context) {
    throw new Error(`${component} must be used inside <Accordion>.`);
  }
  return context;
}

export type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  transition?: Transition;
};

function toArray(value: string | string[] | undefined) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function Accordion({
  type = "single",
  value,
  defaultValue,
  onValueChange,
  collapsible = true,
  transition,
  className,
  children,
  ...props
}: AccordionProps) {
  const [internal, setInternal] = React.useState<string[]>(() => toArray(defaultValue));
  const controlled = value !== undefined;
  const values = controlled ? toArray(value) : internal;
  const spring = useTempoTransition(transition ?? disclosureTween);

  const toggle = React.useCallback(
    (item: string) => {
      const open = values.includes(item);
      const next =
        type === "single"
          ? open
            ? collapsible
              ? []
              : values
            : [item]
          : open
            ? values.filter((entry) => entry !== item)
            : [...values, item];
      if (!controlled) setInternal(next);
      onValueChange?.(type === "single" ? (next[0] ?? "") : next);
    },
    [collapsible, controlled, onValueChange, type, values],
  );

  return (
    <AccordionContext.Provider value={{ values, toggle, transition: spring }}>
      <div data-slot="accordion" className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  disabled?: boolean;
};

const ItemContext = React.createContext<{ value: string; disabled: boolean; open: boolean } | null>(
  null,
);

export function AccordionItem({ value, disabled = false, className, children, ...props }: AccordionItemProps) {
  const accordion = useAccordion("AccordionItem");
  const open = accordion.values.includes(value);
  return (
    <ItemContext.Provider value={{ value, disabled, open }}>
      <div
        data-slot="accordion-item"
        data-state={open ? "open" : "closed"}
        className={cn("border-b last:border-b-0", className)}
        {...props}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
}

function useItem(component: string) {
  const item = React.useContext(ItemContext);
  if (!item) throw new Error(`${component} must be used inside <AccordionItem>.`);
  return item;
}

export type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  hideChevron?: boolean;
};

export function AccordionTrigger({
  hideChevron = false,
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const accordion = useAccordion("AccordionTrigger");
  const item = useItem("AccordionTrigger");
  const panelId = React.useId();
  return (
    <button
      type="button"
      data-slot="accordion-trigger"
      aria-expanded={item.open}
      aria-controls={panelId}
      disabled={item.disabled}
      onClick={() => accordion.toggle(item.value)}
      className={cn(
        "flex w-full items-center justify-between gap-4 py-3.5 text-left text-[13.5px] font-medium outline-none transition-colors focus-visible:text-foreground disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {hideChevron ? null : (
        <motion.span
          aria-hidden="true"
          animate={{ rotate: item.open ? 180 : 0 }}
          transition={accordion.transition}
          className="text-muted-foreground"
        >
          <ChevronDown className="size-4" />
        </motion.span>
      )}
    </button>
  );
}

export type AccordionPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  duration?: number;
  blur?: number;
  keepMounted?: boolean;
};

export function AccordionPanel({
  duration,
  blur = 2,
  keepMounted = false,
  className,
  children,
  ...props
}: AccordionPanelProps) {
  const accordion = useAccordion("AccordionPanel");
  const item = useItem("AccordionPanel");
  const reduce = useReduceMotion();
  const durationSpring = useTempoTransition({
    duration: duration ?? 0.35,
    ease: disclosureTween.ease,
  });
  const spring = duration ? durationSpring : accordion.transition;
  const panelId = React.useId();

  return (
    <AnimatePresence initial={false}>
      {(item.open || keepMounted) && (
        <motion.div
          key="panel"
          id={panelId}
          role="region"
          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0, filter: `blur(${blur}px)` }}
          animate={
            item.open
              ? reduce
                ? { opacity: 1 }
                : { height: "auto", opacity: 1, filter: "blur(0px)" }
              : reduce
                ? { opacity: 0 }
                : { height: 0, opacity: 0, filter: `blur(${blur}px)` }
          }
          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0, filter: `blur(${blur}px)` }}
          transition={
            reduce
              ? { duration: 0.2 }
              : {
                  height: spring,
                  opacity: { duration: 0.25, ease: disclosureTween.ease },
                  filter: { duration: 0.25, ease: disclosureTween.ease },
                }
          }
          className="overflow-hidden"
          {...(props as Record<string, unknown>)}
        >
          <div className={cn("pb-4 pr-6 text-[13px] leading-6 text-muted-foreground", className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
