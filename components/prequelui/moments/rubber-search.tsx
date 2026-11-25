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

const MOMENT_NAMES = [
  "Bars Fade",
  "Bloom Toggle",
  "Snap Grid",
  "Card Fan",
  "Gooey Tab Bar",
  "Blocks Scale",
  "Stretch Toggle",
  "Merge Drops",
  "Paper Plane",
  "Detent Dial",
  "Domino Row",
  "Pebble Rating",
  "Jelly Pad",
  "Swipe Confirm",
  "Bookmark",
  "Depth Stack",
  "Menu Morph",
  "Elastic String",
  "Ripple Pad",
  "Worm Dots",
  "Download Ring",
  "Leaf Tabs",
  "Bell Toggle",
  "Ink Switch",
  "Rocker Switch",
  "Scrub Wave",
  "Squash Play",
  "Rubber Search",
  "Odometer",
  "Tide Progress",
  "Eclipse Half",
  "Magnet Grid",
  "Checklist",
  "Flip Coin",
  "Radial Menu",
  "Dot Revolve",
];

export function RubberSearch({ className, preview }: MomentProps) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const reduce = useHydratedReducedMotion();
  const pulse = usePreviewPulse(preview, 1400, 3000);
  const active = preview ? pulse : focused;
  const hits = query
    ? MOMENT_NAMES.filter((name) =>
        name.toLowerCase().includes(query.trim().toLowerCase()),
      ).length
    : MOMENT_NAMES.length;

  return (
    <div className={cn(surface, className)}>
      <label className="relative block w-[214px]">
        <span className="sr-only">Rubber search</span>
        <motion.span
          aria-hidden="true"
          className="absolute inset-1 rounded-full border border-white/15 bg-white/8"
          style={{ originX: 0.5 }}
          animate={{ scaleX: reduce ? 1 : active ? 1 : 0.84, scaleY: active ? 1.06 : 1 }}
          transition={reduce ? { duration: 0 } : springSoft}
        />
        <motion.span
          className="absolute left-3 top-1/2 z-10 -translate-y-1/2"
          animate={{ x: active ? -1 : 0, scale: active ? 1.08 : 1, rotate: active ? -8 : 0 }}
          transition={reduce ? { duration: 0 } : springSoft}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" aria-hidden="true">
            <circle cx="6.4" cy="6.4" r="4.6" fill="none" stroke="white" strokeWidth="1.5" />
            <path d="m10 10 3.2 3.2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.span>
        <input
          type="search"
          value={query}
          placeholder="Search moments"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => setQuery(event.target.value)}
          className="relative z-10 h-[44px] w-full bg-transparent pl-9 pr-3 text-[12px] text-white placeholder:text-white/35 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        <motion.span
          aria-live="polite"
          className="absolute right-3 top-1/2 z-10 -translate-y-1/2 text-[10px] uppercase tracking-[0.14em] text-white/35"
          animate={{ opacity: query ? 1 : 0.5 }}
        >
          {query ? `${hits} ${hits === 1 ? "hit" : "hits"}` : "Type"}
        </motion.span>
      </label>
    </div>
  );
}
