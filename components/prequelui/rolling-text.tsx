"use client";

import * as React from "react";
import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";
import {
  splitGraphemes,
  srOnlyStyle,
  useReduceMotion,
  useSeen,
  useTempo,
  useTempoTransition,
} from "./motion";

export type RollingTextProps = Omit<React.ComponentProps<"span">, "children"> & {
  text: string;
  transition?: Transition;
  delay?: number;
  inView?: boolean;
  inViewOnce?: boolean;
};

const CHAR: React.CSSProperties = {
  position: "absolute",
  display: "inline-block",
  backfaceVisibility: "hidden",
};

export function RollingText({
  text,
  transition,
  delay = 0,
  inView = false,
  inViewOnce = true,
  className,
  ...props
}: RollingTextProps) {
  const reduce = useReduceMotion();
  const tempo = useTempo();
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref, inView, inViewOnce);
  const tween = useTempoTransition(
    transition ?? { duration: 0.5, delay: 0.1, ease: [0.23, 1, 0.32, 1] },
  );
  const step = Number(tween.delay ?? 0) * tempo;
  const rolled = seen || reduce;

  const words = React.useMemo(
    () =>
      text
        .split(/(\s+)/)
        .filter(Boolean)
        .map((part) =>
          /^\s+$/.test(part)
            ? { space: true as const, part }
            : { space: false as const, chars: splitGraphemes(part) },
        ),
    [text],
  );

  let charIndex = 0;

  return (
    <span
      ref={ref}
      data-slot="rolling-text"
      className={cn("inline", className)}
      {...props}
    >
      <span aria-hidden="true">
        {words.map((word, wordIndex) => {
          if (word.space) {
            return <span key={`space-${wordIndex}`}>{word.part}</span>;
          }
          return (
            <span
              key={`word-${wordIndex}`}
              className="inline-block whitespace-nowrap"
            >
              {word.chars.map((char, index) => {
                const charDelay = delay / 1000 + charIndex++ * step;
                const label = char === " " ? "\u00A0" : char;
                return (
                  <span
                    key={`char-${wordIndex}-${index}`}
                    className="relative inline-block"
                    style={{ perspective: 9999999, transformStyle: "preserve-3d" }}
                  >
                    <motion.span
                      style={{ ...CHAR, transformOrigin: "50% 25%" }}
                      initial={reduce ? false : { rotateX: 0 }}
                      animate={rolled ? { rotateX: 90 } : undefined}
                      transition={
                        reduce ? { duration: 0 } : { ...tween, delay: charDelay }
                      }
                    >
                      {label}
                    </motion.span>
                    <motion.span
                      style={{ ...CHAR, transformOrigin: "50% 100%" }}
                      initial={reduce ? false : { rotateX: 90 }}
                      animate={rolled ? { rotateX: 0 } : undefined}
                      transition={
                        reduce
                          ? { duration: 0 }
                          : { ...tween, delay: charDelay + 0.3 * tempo }
                      }
                    >
                      {label}
                    </motion.span>
                    <span className="invisible">{label}</span>
                  </span>
                );
              })}
            </span>
          );
        })}
      </span>
      <span className="sr-only" style={srOnlyStyle()}>
        {text}
      </span>
    </span>
  );
}
