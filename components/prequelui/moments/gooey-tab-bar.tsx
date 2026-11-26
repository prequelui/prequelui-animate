"use client";

import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  cn,
  springFast,
  surface,
  useHydratedReducedMotion,
  usePreviewStep,
  type MomentProps,
} from "./shared";

const TABS = ["Home", "Search", "Saved", "You"];
const SLOT = 48;

export function GooeyTabBar({ className, preview }: MomentProps) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const reduce = useHydratedReducedMotion();
  const step = usePreviewStep(preview, TABS.length, 1500);
  const index = preview ? step : active;

  const select = (next: number) => {
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const key = (event: React.KeyboardEvent<HTMLDivElement>) => {
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
    <div
      role="tablist"
      aria-label="Gooey tabs"
      onKeyDown={key}
      className={cn(
        surface,
        "rounded-2xl border border-white/10 bg-[#141417] p-1.5",
        className,
      )}
    >
      <div className="relative flex" style={{ width: SLOT * TABS.length }}>
        <motion.span
          aria-hidden="true"
          className="absolute top-0 h-9 rounded-xl bg-white"
          style={{ width: SLOT - 8 }}
          animate={{ x: index * SLOT + 4 }}
          transition={reduce ? { duration: 0 } : springFast}
        />
        <motion.span
          aria-hidden="true"
          className="absolute top-1 h-7 rounded-full bg-white/35 blur-[6px]"
          style={{ width: SLOT - 20 }}
          animate={{ x: index * SLOT + 10, scaleX: [1, 1.35, 1] }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  x: springFast,
                  scaleX: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
                }
          }
        />
        {TABS.map((tab, tabIndex) => (
          <button
            key={tab}
            ref={(node) => {
              tabRefs.current[tabIndex] = node;
            }}
            type="button"
            role="tab"
            aria-selected={index === tabIndex}
            tabIndex={index === tabIndex ? 0 : -1}
            onClick={() => setActive(tabIndex)}
            className={cn(
              "relative z-10 flex h-9 items-center justify-center text-[13px] font-medium transition-colors",
              index === tabIndex ? "text-black" : "text-white/55",
            )}
            style={{ width: SLOT }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
