"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import {
  cn,
  springFast,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const ITEMS = ["Profile", "Settings", "Sign out"];

export function MenuMorph({ className, preview }: MomentProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const items = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1300, 2800);
  const shown = preview ? pulse : open;

  useEffect(() => {
    if (!open) return;
    items.current[0]?.focus();
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  const move = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.current.filter(Boolean) as HTMLButtonElement[];
    if (enabled.length === 0) return;
    const current = enabled.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = (current + step + enabled.length) % enabled.length;
      enabled[next]?.focus();
    }
    if (event.key === "Home") {
      event.preventDefault();
      enabled[0]?.focus();
    }
    if (event.key === "End") {
      event.preventDefault();
      enabled[enabled.length - 1]?.focus();
    }
  };

  return (
    <div className={cn(surface, "flex-col justify-start gap-1.5", className)}>
      <button
        ref={trigger}
        type="button"
        aria-expanded={shown}
        aria-controls={panelId}
        aria-haspopup="menu"
        aria-label="Toggle the menu"
        onClick={() => setOpen((value) => !value)}
        className="relative flex size-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-white/12 bg-[#141417] outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <motion.span
          className="block h-[2px] w-5 rounded-full bg-white"
          animate={
            reduce
              ? { rotate: shown ? 45 : 0, y: 0 }
              : { rotate: shown ? 45 : 0, y: shown ? 7 : 0 }
          }
          transition={reduce ? { duration: 0 } : springFast}
        />
        <motion.span
          className="block h-[2px] w-5 rounded-full bg-white"
          animate={{ opacity: shown ? 0 : 1, scaleX: shown ? 0.2 : 1 }}
          transition={reduce ? { duration: 0 } : springFast}
        />
        <motion.span
          className="block h-[2px] w-5 rounded-full bg-white"
          animate={
            reduce
              ? { rotate: shown ? -45 : 0, y: 0 }
              : { rotate: shown ? -45 : 0, y: shown ? -7 : 0 }
          }
          transition={reduce ? { duration: 0 } : springFast}
        />
      </button>

      <AnimatePresence>
        {shown ? (
          <motion.div
            id={panelId}
            role="menu"
            aria-label="Account"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -6, scaleY: 0.55 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4, scaleY: 0.65 }}
            transition={reduce ? { duration: 0 } : springFast}
            style={{ transformOrigin: "top" }}
            onKeyDown={move}
            className="w-[142px] overflow-hidden rounded-xl border border-white/10 bg-[#17171b] p-1 shadow-[0_12px_26px_rgba(0,0,0,.4)]"
          >
            {ITEMS.map((item, index) => (
              <button
                key={item}
                ref={(node) => {
                  items.current[index] = node;
                }}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  setOpen(false);
                  trigger.current?.focus();
                }}
                className="flex h-7 w-full items-center rounded-lg px-2.5 text-left text-[13px] text-white/65 transition-colors hover:bg-white/10 hover:text-white focus-visible:bg-white/10 focus-visible:text-white focus-visible:outline-none"
              >
                {item}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
