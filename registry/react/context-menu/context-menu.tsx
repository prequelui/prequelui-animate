"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ContextMenuItem = {
  label: string;
  shortcut?: string;
  onSelect?: () => void;
  separator?: boolean;
};

export type ContextMenuProps = {
  items: ContextMenuItem[];
  children?: React.ReactNode;
};

export function ContextMenu({ items, children = "Right click here" }: ContextMenuProps) {
  const [position, setPosition] = React.useState<{ x: number; y: number } | null>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (!position) return;
    const close = () => setPosition(null);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [position]);

  return (
    <>
      <div
        onContextMenu={(event) => {
          event.preventDefault();
          setPosition({ x: event.clientX, y: event.clientY });
        }}
        className="flex h-24 w-64 items-center justify-center rounded-xl border border-dashed text-[13px] text-muted-foreground"
      >
        {children}
      </div>
      <AnimatePresence>
        {position && (
          <motion.div
            role="menu"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: [0, 0, 0.58, 1] } }}
            transition={{ duration: 0.22, ease: [0.215, 0.61, 0.355, 1] }}
            style={{ left: position.x, top: position.y }}
            className="fixed z-50 min-w-[190px] origin-top-left rounded-xl border bg-background p-1 shadow-xl"
            onPointerDown={(event) => event.stopPropagation()}
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
                  transition={{ duration: 0.2, ease: [0.215, 0.61, 0.355, 1], delay: index * 0.03 }}
                  onClick={() => {
                    item.onSelect?.();
                    setPosition(null);
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
    </>
  );
}
