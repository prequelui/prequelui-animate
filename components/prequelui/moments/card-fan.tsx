"use client";

import { motion } from "motion/react";
import { useState } from "react";
import {
  cn,
  springSoft,
  surface,
  useHydratedReducedMotion,
  usePreviewPulse,
  type MomentProps,
} from "./shared";

const CARDS = [
  { face: "A", tone: "bg-white text-black" },
  { face: "K", tone: "bg-white/85 text-black" },
  { face: "Q", tone: "bg-white/70 text-black" },
  { face: "J", tone: "bg-white/55 text-black" },
  { face: "10", tone: "bg-white/40 text-black" },
];

export function CardFan({ className, preview }: MomentProps) {
  const [open, setOpen] = useState(false);
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1200, 2600);
  const fanned = preview ? pulse : open;

  return (
    <div className={cn(surface, "flex-col gap-3", className)}>
      <button
        type="button"
        aria-pressed={fanned}
        aria-label="Fan the card deck"
        onClick={() => setOpen((value) => !value)}
        className="group relative h-[92px] w-[184px] outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        {CARDS.map((card, index) => {
          const middle = (CARDS.length - 1) / 2;
          const offset = index - middle;
          return (
            <motion.span
              key={card.face}
              className={cn(
                "absolute bottom-0 left-1/2 h-[74px] w-[50px] origin-bottom rounded-lg border border-black/10 shadow-lg",
                card.tone,
              )}
              style={{ marginLeft: -25 }}
              animate={
                reduce
                  ? { x: offset * 20, y: 0, rotate: offset * 6 }
                  : {
                      x: fanned ? offset * 30 : offset * 3,
                      y: fanned ? -Math.abs(offset) * 2 : -index * 1.5,
                      rotate: fanned ? offset * 15 : offset * 4,
                    }
              }
              transition={
                reduce ? { duration: 0 } : { ...springSoft, delay: index * 0.025 }
              }
            >
              <span className="absolute left-1.5 top-1 text-[13px] font-semibold">
                {card.face}
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-[16px]">
                {index % 2 === 0 ? "♠" : "♦"}
              </span>
            </motion.span>
          );
        })}
      </button>
      <span className="text-[13px] uppercase tracking-[0.18em] text-white/45">
        {fanned ? "Fan" : "Deck"}
      </span>
    </div>
  );
}
