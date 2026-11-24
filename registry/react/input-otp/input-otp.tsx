"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type InputOTPProps = {
  length?: number;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  className?: string;
};

const pop = { type: "spring", stiffness: 500, damping: 24 } as const;

export function InputOTP({
  length = 6,
  defaultValue = "",
  onChange,
  onComplete,
  className,
}: InputOTPProps) {
  const [values, setValues] = React.useState<string[]>(() =>
    Array.from({ length }, (_, index) => defaultValue[index] ?? ""),
  );
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);
  const reduce = useReducedMotion();

  const commit = (next: string[]) => {
    setValues(next);
    const value = next.join("");
    onChange?.(value);
    if (value.length === length) onComplete?.(value);
  };

  const write = (index: number, text: string) => {
    const chars = text.replace(/\D/g, "").slice(0, length - index).split("");
    if (!chars.length) return;
    const next = [...values];
    chars.forEach((char, offset) => {
      next[index + offset] = char;
    });
    commit(next);
    const focus = Math.min(length - 1, index + chars.length);
    refs.current[focus]?.focus();
  };

  return (
    <div className={cn("flex items-center gap-2", className)} role="group" aria-label="One-time code">
      {values.map((value, index) => (
        <motion.input
          key={index}
          ref={(node) => {
            refs.current[index] = node;
          }}
          value={value}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          initial={false}
          animate={{ scale: reduce ? 1 : value ? 1 : 0.97 }}
          transition={pop}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "");
            if (!digits) {
              const next = [...values];
              next[index] = "";
              commit(next);
              return;
            }
            write(index, digits);
            const input = event.target;
            requestAnimationFrame(() => input.blur());
          }}
          onKeyDown={(event) => {
            if (event.key === "Backspace") {
              event.preventDefault();
              const next = [...values];
              if (next[index]) {
                next[index] = "";
                commit(next);
              } else if (index > 0) {
                next[index - 1] = "";
                commit(next);
                refs.current[index - 1]?.focus();
              }
            }
          }}
          onPaste={(event) => {
            event.preventDefault();
            write(index, event.clipboardData.getData("text"));
          }}
          className="size-10 rounded-lg border bg-background text-center font-mono text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ))}
    </div>
  );
}
