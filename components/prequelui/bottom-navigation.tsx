"use client";

import * as React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { selectionSpring, useReduceMotion } from "./motion";

type BottomNavContextValue = {
  value: string;
  setValue: (value: string) => void;
  id: string;
};

const BottomNavContext = React.createContext<BottomNavContextValue | null>(null);

function useBottomNav(component: string) {
  const context = React.useContext(BottomNavContext);
  if (!context) throw new Error(`${component} must be used inside <BottomNavigation>.`);
  return context;
}

export type BottomNavigationProps = React.HTMLAttributes<HTMLElement> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  hideOnScroll?: boolean;
};

export function BottomNavigation({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  hideOnScroll = false,
  className,
  children,
  ...props
}: BottomNavigationProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const [hidden, setHidden] = React.useState(false);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : internal;
  const id = React.useId().replace(/:/g, "");
  const reduce = useReduceMotion();
  const lastY = React.useRef(0);

  const setValue = React.useCallback(
    (next: string) => {
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  React.useEffect(() => {
    if (!hideOnScroll) return;
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 24 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll]);

  return (
    <BottomNavContext.Provider value={{ value, setValue, id }}>
      <motion.nav
        data-slot="bottom-navigation"
        animate={{ y: hidden && !reduce ? 110 : 0 }}
        transition={selectionSpring}
        className={cn(
          "flex w-full max-w-[340px] items-center justify-between gap-1 rounded-2xl border bg-background p-1.5 shadow-sm",
          className,
        )}
        {...(props as Record<string, unknown>)}
      >
        {children}
      </motion.nav>
    </BottomNavContext.Provider>
  );
}

export type BottomNavigationItemProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  icon?: React.ReactNode;
  label: string;
};

export function BottomNavigationItem({
  value,
  icon,
  label,
  className,
  onClick,
  ...props
}: BottomNavigationItemProps) {
  const nav = useBottomNav("BottomNavigationItem");
  const active = nav.value === value;
  return (
    <button
      type="button"
      aria-current={active ? "page" : undefined}
      data-state={active ? "active" : "inactive"}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) nav.setValue(value);
      }}
      className={cn(
        "relative flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      {...props}
    >
      {active ? (
        <motion.span
          layoutId={`${nav.id}-highlight`}
          className="absolute inset-0 rounded-xl bg-accent"
          transition={selectionSpring}
          aria-hidden="true"
        />
      ) : null}
      <span className="relative flex items-center justify-center [&_svg]:size-4">{icon}</span>
      <span className="relative text-[13px] font-medium">{label}</span>
    </button>
  );
}
