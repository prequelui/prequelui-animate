"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { PanelLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarItem = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

export type SidebarProps = {
  items?: SidebarItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
};

const FALLBACK: SidebarItem[] = [
  { value: "home", label: "Home" },
  { value: "projects", label: "Projects" },
  { value: "team", label: "Team" },
  { value: "settings", label: "Settings" },
];

const collapse = { duration: 0.28, ease: [0.77, 0, 0.175, 1] } as const;
const label = { duration: 0.14, ease: [0.23, 1, 0.32, 1] } as const;
const highlight = { type: "spring", stiffness: 300, damping: 30 } as const;

export function Sidebar({
  items = FALLBACK,
  value,
  defaultValue = "projects",
  onValueChange,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  className,
}: SidebarProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const [closed, setClosed] = React.useState(defaultCollapsed);
  const isClosed = collapsed ?? closed;
  const reduce = useReducedMotion();
  const baseId = React.useId();

  const select = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  const toggle = () => {
    const next = !isClosed;
    if (collapsed === undefined) setClosed(next);
    onCollapsedChange?.(next);
  };

  return (
    <div
      className={cn(
        "flex h-[190px] w-full max-w-[320px] overflow-hidden rounded-xl border bg-background",
        className,
      )}
    >
      <motion.div
        animate={{ width: isClosed ? 54 : 136 }}
        transition={reduce ? { duration: 0 } : collapse}
        className="flex shrink-0 flex-col overflow-hidden border-r bg-accent/40 p-2"
      >
        <div className="mb-3 flex h-7 items-center gap-2 overflow-hidden px-1">
          <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">
            P
          </span>
          <AnimatePresence initial={false}>
            {!isClosed && (
              <motion.span
                initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", x: -4 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", x: -4 }}
                transition={reduce ? { duration: 0.14 } : label}
                className="whitespace-nowrap text-[13px] font-medium"
              >
                Prequel
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {items.map((item) => {
          const active = item.value === current;
          return (
            <button
              key={item.value}
              type="button"
              aria-pressed={active}
              onClick={() => select(item.value)}
              className={cn(
                "relative mb-0.5 flex h-7 items-center gap-2 overflow-hidden rounded-md px-2 text-[13px] transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${baseId}-sidebar-active`}
                  className="absolute inset-0 rounded-md bg-background shadow-sm"
                  transition={reduce ? { duration: 0 } : highlight}
                />
              )}
              <span className="relative shrink-0">
                {item.icon ?? <span className="block size-1.5 rounded-full bg-current" />}
              </span>
              <AnimatePresence initial={false}>
                {!isClosed && (
                  <motion.span
                    initial={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", x: -4 }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, filter: "blur(0px)", x: 0 }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, filter: "blur(2px)", x: -4 }}
                    transition={
                      reduce
                        ? { duration: 0.14 }
                        : { ...label, delay: isClosed ? 0 : 0.14 }
                    }
                    className="relative whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </motion.div>
      <div className="flex min-w-0 flex-1 flex-col p-3">
        <div className="flex items-center justify-between">
          <p className="truncate text-[13px] font-medium">
            {items.find((item) => item.value === current)?.label ?? "Projects"}
          </p>
          <button
            type="button"
            aria-label="Toggle sidebar"
            aria-expanded={!isClosed}
            onClick={toggle}
            className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <PanelLeft className="size-3.5" />
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {[70, 92, 58].map((width) => (
            <div key={width} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-border" />
              <span className="h-1.5 rounded-full bg-accent" style={{ width: `${width}%` }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
