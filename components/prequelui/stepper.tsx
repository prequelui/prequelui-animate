"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useReduceMotion } from "./motion";

export type StepperStep = {
  id: string;
  title: string;
  description?: string;
  content?: React.ReactNode;
};

export type StepperProps = Omit<React.ComponentProps<"div">, "onChange"> & {
  steps: StepperStep[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  controls?: boolean;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  onComplete?: () => void;
  minHeight?: number;
};

const clamp = (value: number, max: number) => Math.min(max, Math.max(0, value));

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
      <motion.path
        d="M3.4 8.4 6.6 11.5 12.6 4.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
      />
    </svg>
  );
}

export function Stepper({
  steps,
  value,
  defaultValue = 0,
  onValueChange,
  controls = true,
  backLabel = "Back",
  nextLabel = "Continue",
  finishLabel = "Finish",
  onComplete,
  minHeight = 112,
  className,
  ...props
}: StepperProps) {
  const [internal, setInternal] = React.useState(() =>
    clamp(defaultValue, Math.max(0, steps.length - 1)),
  );
  const current = clamp(value ?? internal, Math.max(0, steps.length - 1));
  const previous = React.useRef(current);
  const reduce = useReduceMotion();
  const id = React.useId().replace(/:/g, "");
  const direction = current >= previous.current ? 1 : -1;
  const step = steps[current];

  React.useEffect(() => {
    previous.current = current;
  }, [current]);

  const go = React.useCallback(
    (next: number) => {
      const safe = clamp(next, Math.max(0, steps.length - 1));
      if (safe === current) return;
      if (value === undefined) setInternal(safe);
      onValueChange?.(safe);
    },
    [current, onValueChange, steps.length, value],
  );

  const last = steps.length - 1;

  return (
    <div
      data-slot="stepper"
      className={cn("w-full max-w-[440px]", className)}
      {...props}
    >
      <ol className="flex w-full items-start" aria-label="Progress">
        {steps.map((item, index) => {
          const state =
            index < current ? "complete" : index === current ? "current" : "upcoming";
          return (
            <li
              key={item.id}
              className="relative flex min-w-0 flex-1 flex-col items-center"
            >
              {index < last ? (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-[15px] -ml-px h-px w-full overflow-hidden bg-border"
                >
                  <motion.span
                    className="block h-full w-full origin-left bg-primary"
                    initial={false}
                    animate={{ scaleX: index < current ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.1, 1] }}
                  />
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => go(index)}
                aria-current={state === "current" ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${item.title}`}
                className="group relative z-10 flex flex-col items-center gap-2 rounded-lg px-1 py-0.5 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <motion.span
                  className={cn(
                    "flex size-[30px] items-center justify-center rounded-full border text-[13px] font-medium transition-colors",
                    state === "complete" &&
                      "border-primary bg-primary text-primary-foreground",
                    state === "current" &&
                      "border-primary bg-background text-foreground",
                    state === "upcoming" &&
                      "border-border bg-muted/40 text-muted-foreground",
                  )}
                  initial={false}
                  animate={
                    state === "current" && !reduce ? { scale: 1.08 } : { scale: 1 }
                  }
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                >
                  {state === "complete" ? <CheckIcon /> : index + 1}
                </motion.span>
                <span className="flex min-w-0 flex-col">
                  <span
                    className={cn(
                      "truncate text-[13px] leading-4",
                      state === "upcoming"
                        ? "text-muted-foreground"
                        : "font-medium text-foreground",
                    )}
                  >
                    {item.title}
                  </span>
                  {item.description ? (
                    <span className="mt-0.5 hidden truncate text-[13px] leading-4 text-muted-foreground sm:block">
                      {item.description}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <div
        className="relative mt-6 overflow-hidden rounded-xl border bg-background"
        style={{ minHeight }}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step?.id ?? current}
            id={`stepper-panel-${id}`}
            role="region"
            aria-live="polite"
            aria-label={step ? `${step.title} step` : undefined}
            initial={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 18, filter: "blur(3px)" }
            }
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={
              reduce
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -18, filter: "blur(2px)" }
            }
            transition={{ duration: reduce ? 0.15 : 0.26, ease: [0.23, 1, 0.32, 1] }}
            className="p-4 text-[13px] leading-5 text-muted-foreground"
          >
            {step?.content ?? (
              <p className="text-foreground">{step?.title}</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {controls ? (
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[13px] font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
          >
            {backLabel}
          </button>
          <span className="text-[13px] tabular-nums text-muted-foreground">
            {Math.min(current + 1, steps.length)} / {steps.length}
          </span>
          <button
            type="button"
            onClick={() => {
              if (current === last) onComplete?.();
              else go(current + 1);
            }}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {current === last ? finishLabel : nextLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
