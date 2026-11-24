"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownItem = {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
  separator?: boolean;
};

export type DropdownMenuProps = {
  trigger?: string;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
};

const soft = [0.215, 0.61, 0.355, 1] as const;
const leave = [0, 0, 0.58, 1] as const;

export function DropdownMenu({
  trigger = "Actions",
  items,
  align = "start",
  className,
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative inline-block", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium"
      >
        {trigger}
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: leave } }}
            transition={{ duration: 0.22, ease: soft }}
            className={cn(
              "absolute top-full z-40 mt-1.5 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl",
              align === "end" ? "right-0" : "left-0",
            )}
          >
            {items.map((item, index) =>
              item.separator ? (
                <div key={`sep-${index}`} role="separator" className="my-1 h-px bg-border" />
              ) : (
                <motion.button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  initial={reduce ? false : { opacity: 0, y: -4, filter: "blur(2px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.22, ease: soft, delay: index * 0.03 }}
                  onClick={() => {
                    item.onSelect?.();
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                >
                  <span>{item.label}</span>
                  {item.shortcut && (
                    <span className="font-mono text-[13px] text-muted-foreground">{item.shortcut}</span>
                  )}
                </motion.button>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
