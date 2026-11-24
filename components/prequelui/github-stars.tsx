"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { Github, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { swapTween, useReduceMotion } from "./motion";

export type GitHubStarsProps = Omit<React.ComponentProps<"a">, "href"> & {
  repo?: string;
  href?: string;
  count?: number | null;
  defaultCount?: number | null;
  label?: string;
  showLabel?: boolean;
};

function formatCount(value: number) {
  if (value < 1000) return String(value);
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function GitHubStars({
  repo,
  href,
  count,
  defaultCount = null,
  label = "GitHub",
  showLabel = true,
  className,
  ...props
}: GitHubStarsProps) {
  const reduce = useReduceMotion();
  const [live, setLive] = React.useState<number | null>(defaultCount);

  React.useEffect(() => {
    if (count !== undefined || !repo) return;
    let active = true;
    fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: "application/vnd.github+json" },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && data && typeof data.stargazers_count === "number") {
          setLive(data.stargazers_count);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [count, repo]);

  const value = count !== undefined ? count : live;
  const destination = href ?? (repo ? `https://github.com/${repo}` : undefined);

  return (
    <a
      data-slot="github-stars"
      href={destination}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={repo ? `${label} stars on GitHub` : "GitHub"}
      className={cn(
        "group inline-flex h-8 items-center gap-1.5 rounded-full border bg-background px-2.5 text-[13px] text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
      {...props}
    >
      <Github className="size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
      {showLabel ? <span className="truncate">{label}</span> : null}
      <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-border" />
      <span
        aria-hidden="true"
        className="inline-flex items-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-12 group-hover:scale-110 motion-reduce:transition-none"
      >
        <Star className="size-3.5 shrink-0 transition-colors group-hover:fill-current" />
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value ?? "star"}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={reduce ? { duration: 0 } : swapTween}
          className="tabular-nums"
        >
          {value === null || value === undefined ? "Star" : formatCount(value)}
        </motion.span>
      </AnimatePresence>
    </a>
  );
}
