"use client";

import { Flower2, Leaf, Snowflake, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useId, useRef, useState } from "react";
import {
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewStep,
  type MomentProps,
} from "./shared";

const TABS = [
  { label: "Spring", copy: "A soft curve that settles.", Icon: Flower2 },
  { label: "Summer", copy: "Short, warm and direct.", Icon: Sun },
  { label: "Autumn", copy: "A slower, falling rhythm.", Icon: Leaf },
  { label: "Winter", copy: "Still, quiet and exact.", Icon: Snowflake },
];

const SLOT = 44;

export function LeafTabs({ className, preview }: MomentProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useHydratedReducedMotion();
  const step = usePreviewStep(preview, TABS.length, 1500);
  const index = preview ? step : active;

  const select = (next: number) => {
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const key = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      select((active + 1) % TABS.length);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      select((active - 1 + TABS.length) % TABS.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      select(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      select(TABS.length - 1);
    }
  };

  return (
    <div className={cn(surface, "flex-col gap-0", className)}>
      <div
        role="tablist"
        aria-label="Leaf tabs"
        onKeyDown={key}
        className="flex items-end gap-1"
      >
        {TABS.map((tab, tabIndex) => {
          const selected = index === tabIndex;
          return (
            <motion.button
              key={tab.label}
              ref={(node) => {
                tabRefs.current[tabIndex] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tabIndex}`}
              aria-label={tab.label}
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(tabIndex)}
              animate={
                reduce
                  ? { y: selected ? -4 : 0, rotate: 0, scale: 1 }
                  : { y: selected ? -9 : 0, rotate: selected ? -5 : 0, scale: selected ? 1.03 : 1 }
              }
              transition={reduce ? { duration: 0 } : springSoft}
              style={{ transformOrigin: "bottom left", width: SLOT }}
              className={cn(
                "flex h-8 items-center justify-center rounded-tl-[18px] rounded-tr-[18px] rounded-b-[7px] border border-b-0 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/60",
                selected
                  ? "border-white/20 bg-white text-black shadow-[0_-6px_16px_rgba(0,0,0,.25)]"
                  : "border-white/10 bg-white/8 text-white/45 hover:bg-white/12",
              )}
            >
              <tab.Icon className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
            </motion.button>
          );
        })}
      </div>
      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${index}`}
        className="flex h-[58px] w-[188px] flex-col justify-center rounded-xl rounded-tl-none border border-white/10 bg-white/8 px-3"
      >
        <motion.span
          key={TABS[index].label}
          initial={reduce ? false : { opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          className="text-[12px] font-medium"
        >
          {TABS[index].label}
        </motion.span>
        <motion.span
          key={`${TABS[index].label}-copy`}
          initial={reduce ? false : { opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduce ? 0 : 0.22, delay: reduce ? 0 : 0.03 }}
          className="mt-0.5 text-[10px] text-white/45"
        >
          {TABS[index].copy}
        </motion.span>
      </div>
    </div>
  );
}
