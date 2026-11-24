"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type PaginationProps = {
  pages?: number;
  defaultPage?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  className?: string;
};

const glide = { type: "spring", stiffness: 500, damping: 40 } as const;

export function Pagination({
  pages = 5,
  defaultPage = 1,
  page,
  onPageChange,
  className,
}: PaginationProps) {
  const [internal, setInternal] = React.useState(defaultPage);
  const value = page ?? internal;
  const reduce = useReducedMotion();
  const layout = React.useId();

  const go = (next: number) => {
    const clamped = Math.min(pages, Math.max(1, next));
    if (page === undefined) setInternal(clamped);
    onPageChange?.(clamped);
  };

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={value === 1}
        onClick={() => go(value - 1)}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40"
      >
        <ChevronLeft className="size-4" />
      </button>
      {Array.from({ length: pages }, (_, index) => index + 1).map((item) => (
        <button
          key={item}
          type="button"
          aria-current={item === value ? "page" : undefined}
          onClick={() => go(item)}
          className="relative flex size-8 items-center justify-center rounded-md text-[13px] font-medium"
        >
          {item === value && (
            <motion.span
              layoutId={`pagination-active-${layout}`}
              className="absolute inset-0 rounded-md border bg-background shadow-sm"
              transition={reduce ? { duration: 0 } : glide}
            />
          )}
          <span className={cn("relative", item === value ? "text-foreground" : "text-muted-foreground")}>
            {item}
          </span>
        </button>
      ))}
      <button
        type="button"
        aria-label="Next page"
        disabled={value === pages}
        onClick={() => go(value + 1)}
        className="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
