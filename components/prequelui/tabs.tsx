"use client";

import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  heightSpring,
  panelInTween,
  panelOutTween,
  selectionSpring,
  useReduceMotion,
  useTempoTransition,
} from "./motion";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  id: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs(component: string) {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error(`${component} must be used inside <Tabs>.`);
  return context;
}

export type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  transition?: Transition;
};

export function Tabs({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  transition,
  className,
  children,
  ...props
}: TabsProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : internal;
  const id = React.useId().replace(/:/g, "");
  const height = useTempoTransition(transition ?? heightSpring);

  const setValue = React.useCallback(
    (next: string) => {
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  return (
    <TabsContext.Provider value={{ value, setValue, id }}>
      <motion.div
        data-slot="tabs"
        layout
        transition={height}
        className={cn("w-full", className)}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </motion.div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
  indicatorTransition,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { indicatorTransition?: Transition }) {
  return (
    <IndicatorContext.Provider value={indicatorTransition}>
      <div
        role="tablist"
        data-slot="tabs-list"
        className={cn("flex items-center gap-1 rounded-lg bg-accent p-1", className)}
        {...props}
      >
        {children}
      </div>
    </IndicatorContext.Provider>
  );
}

const IndicatorContext = React.createContext<Transition | undefined>(undefined);

export type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
};

export function TabsTrigger({ value, className, children, onClick, ...props }: TabsTriggerProps) {
  const tabs = useTabs("TabsTrigger");
  const indicatorTransition = React.useContext(IndicatorContext);
  const indicator = useTempoTransition(indicatorTransition ?? selectionSpring);
  const active = tabs.value === value;
  return (
    <button
      type="button"
      role="tab"
      id={`${tabs.id}-trigger-${value}`}
      aria-selected={active}
      aria-controls={`${tabs.id}-panel-${value}`}
      data-state={active ? "active" : "inactive"}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) tabs.setValue(value);
      }}
      className={cn(
        "relative flex-1 rounded-md px-3 py-1.5 text-[13px] outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/40",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {active ? (
        <motion.span
          layoutId={`${tabs.id}-indicator`}
          className="absolute inset-0 rounded-md bg-background shadow-sm"
          transition={indicator}
          aria-hidden="true"
        />
      ) : null}
      <span className="relative">{children}</span>
    </button>
  );
}

export type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
  forceMount?: boolean;
};

export function TabsContent({
  value,
  forceMount = false,
  className,
  children,
  ...props
}: TabsContentProps) {
  const tabs = useTabs("TabsContent");
  const reduce = useReduceMotion();
  const active = tabs.value === value;
  const visible = active || forceMount;

  return (
    <div
      role="tabpanel"
      id={`${tabs.id}-panel-${value}`}
      aria-labelledby={`${tabs.id}-trigger-${value}`}
      data-state={active ? "active" : "inactive"}
      className={cn("relative", active || forceMount ? "mt-4" : "")}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {visible ? (
          <motion.div
            key={value}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 12, filter: "blur(5px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.2 } }
                : { opacity: 0, x: -12, filter: "blur(5px)", transition: panelOutTween }
            }
            transition={reduce ? { duration: 0.2 } : panelInTween}
            className={cn("outline-none", className)}
            {...(props as Record<string, unknown>)}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
