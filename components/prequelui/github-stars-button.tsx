"use client";

import * as React from "react";
import { animate, motion, useInView } from "motion/react";
import { Github, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "./motion";

export type GitHubStarsButtonProps = React.ComponentProps<"button"> & {
  username?: string;
  repo?: string;
  value?: number;
  delay?: number;
  inView?: boolean;
};

export function GitHubStarsButton({
  username = "prequelui",
  repo = "prequelui-animate",
  value = 0,
  delay = 0,
  inView = true,
  className,
  onClick,
  ...props
}: GitHubStarsButtonProps) {
  const reduce = useReduceMotion();
  const ref = React.useRef<HTMLButtonElement>(null);
  const visible = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = React.useState(reduce ? value : 0);
  const [starred, setStarred] = React.useState(false);
  const [burst, setBurst] = React.useState(0);
  const start = React.useRef(false);

  React.useEffect(() => {
    if (!inView || !visible || start.current) return;
    start.current = true;
    if (reduce) {
      setCount(value);
      return;
    }
    const controls = animate(0, value, {
      type: "spring",
      stiffness: 90,
      damping: 50,
      delay: delay / 1000,
      onUpdate: (latest) => setCount(Math.round(latest)),
    });
    return () => controls.stop();
  }, [delay, inView, reduce, value, visible]);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Star ${username}/${repo} on GitHub`}
      data-slot="github-stars-button"
      className={cn(
        "relative inline-flex h-9 items-center gap-2 overflow-visible rounded-lg border bg-background px-3 text-[13px] font-medium",
        className,
      )}
      onClick={(event) => {
        onClick?.(event);
        setStarred((previous) => {
          setCount((current) => current + (previous ? -1 : 1));
          return !previous;
        });
        setBurst((current) => current + 1);
      }}
      {...props}
    >
      <Github className="size-4" aria-hidden="true" />
      <span>Star</span>
      <span className="h-4 w-px bg-border" aria-hidden="true" />
      <span className="relative flex items-center gap-1 tabular-nums text-muted-foreground">
        <motion.span
          animate={starred && !reduce ? { scale: [1, 1.35, 1], rotate: [0, 12, 0] } : {}}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex"
        >
          <Star
            className={cn(
              "size-3.5 transition-colors duration-300",
              starred ? "fill-[#f5b301] text-[#f5b301]" : "text-muted-foreground",
            )}
          />
        </motion.span>
        {count.toLocaleString("en-US")}
      </span>
      <span className="pointer-events-none absolute right-3 top-1/2" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <motion.span
            key={`${burst}-${index}`}
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
            animate={
              burst === 0 || reduce
                ? { opacity: 0 }
                : {
                    opacity: [1, 0],
                    x: Math.cos((index / 6) * Math.PI * 2) * 26,
                    y: Math.sin((index / 6) * Math.PI * 2) * 26,
                    scale: 0.35,
                  }
            }
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="absolute size-1 rounded-full bg-[#f5b301]"
          />
        ))}
      </span>
    </button>
  );
}

export function GitHubStarsButtonLogo(props: React.ComponentProps<typeof Github>) {
  return <Github {...props} />;
}

export function GitHubStarsButtonIcon(props: React.ComponentProps<typeof Star>) {
  return <Star {...props} />;
}
