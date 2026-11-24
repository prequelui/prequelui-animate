"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavigationItem = { label: string; content: React.ReactNode };
export type NavigationMenuProps = { items?: NavigationItem[]; className?: string };

const FALLBACK: NavigationItem[] = [
  { label: "Components", content: "Every primitive, with the same motion contract." },
  { label: "Templates", content: "Full pages built on the same tokens." },
  { label: "Docs", content: "Installation, accessibility and API references." },
];

const soft = [0.215, 0.61, 0.355, 1] as const;

export function NavigationMenu({ items = FALLBACK, className }: NavigationMenuProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  const reduce = useReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    if (open === null) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(null);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className={cn("relative w-full max-w-sm", className)}
      onPointerLeave={() => {
        timer.current = window.setTimeout(() => setOpen(null), 180);
      }}
      onPointerEnter={() => window.clearTimeout(timer.current)}
    >
      <div role="menubar" className="flex items-center gap-1 rounded-lg border p-1">
        {items.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-expanded={open === index}
            onClick={() => setOpen(open === index ? null : index)}
            onPointerEnter={() => setOpen(index)}
            className={cn("flex h-7 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium transition-colors", open === index ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {item.label}
            <ChevronDown className={cn("size-3 transition-transform", open === index && "rotate-180")} />
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div
            key="viewport"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -4, filter: "blur(2px)" }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: [0, 0, 0.58, 1] } }}
            transition={{ duration: 0.24, ease: soft }}
            className="absolute left-0 top-full z-40 mt-1.5 w-full overflow-hidden rounded-xl border bg-background p-4 shadow-xl"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={open}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4, transition: { duration: 0.1 } }}
                transition={{ duration: 0.2, ease: soft }}
                className="text-[13px] leading-6 text-muted-foreground"
              >
                {items[open]?.content}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
