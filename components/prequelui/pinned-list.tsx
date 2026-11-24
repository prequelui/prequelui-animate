"use client";

import * as React from "react";
import { LayoutGroup, motion } from "motion/react";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { pinnedSpring, useReduceMotion } from "./motion";

export type PinnedItem = {
  id: string;
  label: string;
  pinned: boolean;
};

export type PinnedListProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> & {
  items?: PinnedItem[];
  defaultItems?: PinnedItem[];
  onItemsChange?: (items: PinnedItem[]) => void;
  pinnedLabel?: string;
  unpinnedLabel?: string;
};

const fallbackItems: PinnedItem[] = [
  { id: "aurora", label: "Aurora", pinned: true },
  { id: "atlas", label: "Atlas", pinned: true },
  { id: "beacon", label: "Beacon", pinned: false },
  { id: "canvas", label: "Canvas", pinned: false },
];

export function PinnedList({
  items: itemsProp,
  defaultItems = fallbackItems,
  onItemsChange,
  pinnedLabel = "Pinned",
  unpinnedLabel = "Everything else",
  className,
  ...props
}: PinnedListProps) {
  const [internal, setInternal] = React.useState(defaultItems);
  const controlled = itemsProp !== undefined;
  const items = controlled ? itemsProp : internal;
  const [movingId, setMovingId] = React.useState<string | null>(null);
  const reduce = useReduceMotion();

  const toggle = (id: string) => {
    setMovingId(id);
    const next = items.map((item) =>
      item.id === id ? { ...item, pinned: !item.pinned } : item,
    );
    if (!controlled) setInternal(next);
    onItemsChange?.(next);
  };

  const groups = [
    { key: true, title: pinnedLabel },
    { key: false, title: unpinnedLabel },
  ];

  return (
    <LayoutGroup>
      <div
        data-slot="pinned-list"
        className={cn("w-full max-w-[300px] space-y-4", className)}
        {...props}
      >
        {groups.map((group) => (
          <div key={group.title}>
            <p className="mb-1.5 text-[13px] uppercase tracking-[0.14em] text-muted-foreground">
              {group.title}
            </p>
            <div className="min-h-9 space-y-1">
              {items
                .filter((item) => item.pinned === group.key)
                .map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    layoutId={`pinned-item-${item.id}`}
                    layout={reduce ? false : true}
                    onClick={() => toggle(item.id)}
                    onLayoutAnimationComplete={() => {
                      if (movingId === item.id) setMovingId(null);
                    }}
                    transition={reduce ? { duration: 0 } : pinnedSpring}
                    style={{ zIndex: movingId === item.id ? 10 : 1 }}
                    className="flex w-full items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-left text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <motion.span
                        animate={{ opacity: item.pinned ? 1 : 0, scale: item.pinned ? 1 : 0.8 }}
                        transition={{ duration: reduce ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
                        className="text-muted-foreground"
                      >
                        <Pin className="size-3" />
                      </motion.span>
                      <span className="truncate">{item.label}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
                      {item.pinned ? <PinOff className="size-3" /> : <Pin className="size-3" />}
                      {item.pinned ? "Unpin" : "Pin"}
                    </span>
                  </motion.button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </LayoutGroup>
  );
}
