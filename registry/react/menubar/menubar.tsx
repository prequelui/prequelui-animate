"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type MenubarItem = { label: string; shortcut?: string; onSelect?: () => void; separator?: boolean };
export type MenubarMenu = { label: string; items: MenubarItem[] };
export type MenubarProps = { menus?: MenubarMenu[]; className?: string };

const FALLBACK: MenubarMenu[] = [
  { label: "File", items: [{ label: "New file", shortcut: "⌘N" }, { label: "Open", shortcut: "⌘O" }, { separator: true, label: "sep" }, { label: "Save", shortcut: "⌘S" }] },
  { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z" }, { label: "Redo", shortcut: "⇧⌘Z" }] },
  { label: "View", items: [{ label: "Zoom in" }, { label: "Zoom out" }] },
];

export function Menubar({ menus = FALLBACK, className }: MenubarProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  const reduce = useReducedMotion();
  const root = React.useRef<HTMLDivElement>(null);

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
    <div ref={root} role="menubar" className={cn("flex items-center gap-1 rounded-lg border p-1", className)}>
      {menus.map((menu, index) => (
        <div key={menu.label} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === index}
            onClick={() => setOpen(open === index ? null : index)}
            onPointerEnter={() => open !== null && setOpen(index)}
            className={cn("h-7 rounded-md px-2.5 text-[13px] font-medium transition-colors", open === index ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            {menu.label}
          </button>
          <AnimatePresence>
            {open === index && (
              <motion.div
                role="menu"
                initial={reduce ? { opacity: 0 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15, ease: [0, 0, 0.58, 1] } }}
                transition={{ duration: 0.22, ease: [0.215, 0.61, 0.355, 1] }}
                className="absolute left-0 top-full z-40 mt-1 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl"
              >
                {menu.items.map((item, itemIndex) =>
                  item.separator ? (
                    <div key={`sep-${itemIndex}`} role="separator" className="my-1 h-px bg-border" />
                  ) : (
                    <motion.button
                      key={item.label}
                      type="button"
                      role="menuitem"
                      initial={reduce ? false : { opacity: 0, y: -4, filter: "blur(2px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1], delay: itemIndex * 0.03 }}
                      onClick={() => {
                        item.onSelect?.();
                        setOpen(null);
                      }}
                      className="flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                    >
                      <span>{item.label}</span>
                      {item.shortcut && <span className="font-mono text-[13px] text-muted-foreground">{item.shortcut}</span>}
                    </motion.button>
                  ),
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
