"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastProps = {
  trigger?: string;
  title?: string;
  description?: string;
  duration?: number;
  className?: string;
};

type ToastEntry = { id: number; title: string; description?: string };

const rise = { type: "spring", stiffness: 280, damping: 24 } as const;
const away = { duration: 0.2, ease: [0.33, 0.17, 0.67, 0.5] } as const;

export function Toast({
  trigger = "Show toast",
  title = "Changes saved",
  description,
  duration = 5000,
  className,
}: ToastProps) {
  const [toasts, setToasts] = React.useState<ToastEntry[]>([]);
  const reduce = useReducedMotion();
  const timers = React.useRef(new Map<number, number>());

  const dismiss = (id: number) => {
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const add = () => {
    const id = Date.now();
    setToasts((current) => [...current, { id, title, description }].slice(-4));
    timers.current.set(
      id,
      window.setTimeout(() => dismiss(id), duration),
    );
  };

  React.useEffect(
    () => () => {
      for (const timer of timers.current.values()) window.clearTimeout(timer);
      timers.current.clear();
    },
    [],
  );

  return (
    <div className={cn("flex w-full max-w-[420px] flex-col items-center gap-4", className)}>
      <button
        type="button"
        onClick={add}
        className="inline-flex h-9 items-center rounded-lg bg-foreground px-3.5 text-[13px] font-medium text-background"
      >
        {trigger}
      </button>
      <div className="relative h-[96px] w-full">
        <AnimatePresence initial={false}>
          {toasts.map((toast, index) => (
            <motion.div
              key={toast.id}
              layout
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96, filter: "blur(4px)" }}
              animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={
                reduce
                  ? { opacity: 0 }
                  : { opacity: 0, y: 12, scale: 0.96, filter: "blur(4px)", transition: away }
              }
              transition={
                reduce ? { duration: 0.2 } : { ...rise, delay: index * 0.03 }
              }
              className="absolute bottom-4 left-1/2 flex w-[280px] -translate-x-1/2 items-center gap-2 rounded-xl border bg-popover px-3 py-2.5 text-[13px] shadow-lg"
            >
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f9d63] text-white">
                <Check className="size-3" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate">{toast.title}</span>
                {toast.description && (
                  <span className="mt-0.5 block truncate text-[12px] text-muted-foreground">
                    {toast.description}
                  </span>
                )}
              </span>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => dismiss(toast.id)}
                className="shrink-0 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
