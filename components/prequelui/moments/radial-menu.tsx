"use client";

import { motion } from "motion/react";
import { Copy, EyeOff, Move, Pencil, Share2, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  cn,
  springBounce,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const ITEMS = [
  { label: "Edit", angle: -90, Icon: Pencil },
  { label: "Copy", angle: -30, Icon: Copy },
  { label: "Share", angle: 30, Icon: Share2 },
  { label: "Tag", angle: 90, Icon: Tag },
  { label: "Move", angle: 150, Icon: Move },
  { label: "Hide", angle: 210, Icon: EyeOff },
];
const RADIUS = 48;

export function RadialMenu({ className, preview }: MomentProps) {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1400, 3000);
  const shown = preview ? pulse : open;
  const trigger = useRef<HTMLButtonElement | null>(null);
  const items = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (open) items.current[0]?.focus();
  }, [open]);

  const close = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) trigger.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close(true);
      return;
    }
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const backward = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !backward) return;
    event.preventDefault();
    const current = items.current.findIndex((node) => node === document.activeElement);
    const next =
      (current + (forward ? 1 : -1) + ITEMS.length) % ITEMS.length;
    items.current[next]?.focus();
  };

  return (
    <div className={cn(surface, "flex-col gap-2", className)}>
      <div
        className="relative flex size-[148px] items-center justify-center"
        onKeyDown={onKeyDown}
      >
        <div role="menu" aria-label="Moment actions" className="absolute inset-0">
          {ITEMS.map((item, index) => {
            const radians = (item.angle * Math.PI) / 180;
            const x = Math.cos(radians) * RADIUS;
            const y = Math.sin(radians) * RADIUS;
            return (
              <motion.button
                key={item.label}
                ref={(node) => {
                  items.current[index] = node;
                }}
                type="button"
                role="menuitem"
                tabIndex={shown ? 0 : -1}
                aria-hidden={!shown}
                aria-label={item.label}
                onClick={() => {
                  setChosen(item.label);
                  close(true);
                }}
                animate={
                  reduce
                    ? {
                        x: shown ? x : 0,
                        y: shown ? y : 0,
                        scale: shown ? 1 : 0.4,
                        opacity: shown ? 1 : 0,
                      }
                    : {
                        x: shown ? x : 0,
                        y: shown ? y : 0,
                        scale: shown ? 1 : 0,
                        opacity: shown ? 1 : 0,
                      }
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : { ...springBounce, delay: shown ? index * 0.025 : 0 }
                }
                style={{ pointerEvents: shown ? "auto" : "none" }}
                className="absolute left-1/2 top-1/2 -ml-[17px] -mt-[17px] flex size-[34px] items-center justify-center rounded-full border border-white/12 bg-[#1c1c21] text-white/70 outline-none hover:bg-white hover:text-black focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <item.Icon className="size-3.5" aria-hidden="true" />
              </motion.button>
            );
          })}
        </div>

        <button
          ref={trigger}
          type="button"
          aria-haspopup="menu"
          aria-expanded={shown}
          aria-label={shown ? "Close the radial menu" : "Open the radial menu"}
          onClick={() => setOpen((value) => !value)}
          className="relative z-10 flex size-[46px] items-center justify-center rounded-full bg-white text-black outline-none focus-visible:ring-2 focus-visible:ring-black/40"
        >
          <motion.span
            className="block h-[2px] w-4 rounded-full bg-black"
            animate={{ rotate: shown ? 45 : 0, y: shown ? 0 : -3 }}
            transition={reduce ? { duration: 0 } : springBounce}
          />
          <motion.span
            className="absolute block h-[2px] w-4 rounded-full bg-black"
            animate={{ rotate: shown ? -45 : 0, y: shown ? 0 : 3 }}
            transition={reduce ? { duration: 0 } : springBounce}
          />
        </button>
      </div>
      <span
        aria-live="polite"
        className="text-[12px] uppercase tracking-[0.18em] text-white/45"
      >
        {chosen ?? (shown ? "Choose" : "Actions")}
      </span>
    </div>
  );
}
