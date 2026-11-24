"use client";

import * as React from "react";
import {
  motion,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import {
  splitGraphemes,
  srOnlyStyle,
  useReduceMotion,
  useSeen,
  useTempo,
  useTempoTransition,
} from "./motion";

type SplittingBaseProps = Omit<
  HTMLMotionProps<"span">,
  "children" | "initial" | "animate" | "transition"
> & {
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  transition?: Transition;
  stagger?: number;
  delay?: number;
  disableAnimation?: boolean;
  inView?: boolean;
  inViewOnce?: boolean;
};

export type SplittingTextProps = SplittingBaseProps &
  (
    | { type?: "chars" | "words"; text: string }
    | { type?: "lines"; text: string[] }
  );

const HIDDEN: TargetAndTransition = { x: 150, opacity: 0 };
const SHOWN: TargetAndTransition = { x: 0, opacity: 1 };
const STEP = { chars: 0.05, words: 0.2, lines: 0.3 } as const;

export function SplittingText({
  text,
  type = "chars",
  initial = HIDDEN,
  animate = SHOWN,
  transition,
  stagger,
  delay = 0,
  disableAnimation = false,
  inView = false,
  inViewOnce = true,
  className,
  ...props
}: SplittingTextProps) {
  const reduce = useReduceMotion();
  const tempo = useTempo();
  const tween = useTempoTransition(transition ?? { duration: 0.7, ease: [0.23, 1, 0.32, 1] });
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref, inView, inViewOnce);
  const still = disableAnimation || reduce;
  const kind = Array.isArray(text) ? "lines" : type;
  const gap = (stagger ?? STEP[kind] * tempo) as number;
  const base = delay / 1000;

  const variants: Variants = {
    hidden: still ? animate : initial,
    visible: (index: number) => ({
      ...animate,
      transition: still ? { duration: 0 } : { ...tween, delay: base + index * gap },
    }),
  };

  const piece = (content: React.ReactNode, index: number) => (
    <motion.span
      key={index}
      custom={index}
      variants={variants}
      className="inline-block will-change-transform"
      style={{ whiteSpace: kind === "chars" ? "pre" : undefined }}
    >
      {content}
    </motion.span>
  );

  let visual: React.ReactNode;

  if (Array.isArray(text)) {
    visual = text.map((line, index) => (
      <React.Fragment key={`line-${index}`}>
        {piece(line, index)}
        {index < text.length - 1 ? <br /> : null}
      </React.Fragment>
    ));
  } else if (kind === "words") {
    const words = text.match(/\S+\s*/g) ?? [];
    visual = words.map((word, index) => (
      <React.Fragment key={`word-${index}`}>
        {piece(word.trim(), index)}
        {/\s$/.test(word) ? " " : null}
      </React.Fragment>
    ));
  } else {
    let charIndex = 0;
    visual = text.split(/(\s+)/).map((token, wordIndex) => {
      if (!token) return null;
      if (/^\s+$/.test(token)) return <span key={`space-${wordIndex}`}>{token}</span>;
      return (
        <span
          key={`word-${wordIndex}`}
          className="inline-block whitespace-nowrap"
        >
          {splitGraphemes(token).map((char) => piece(char, charIndex++))}
        </span>
      );
    });
  }

  const label = Array.isArray(text) ? text.join(" ") : text;

  return (
    <motion.span
      ref={ref}
      data-slot="splitting-text"
      initial="hidden"
      animate={seen || still ? "visible" : "hidden"}
      className={cn("inline", className)}
      {...props}
    >
      <span aria-hidden="true">{visual}</span>
      <span className="sr-only" style={srOnlyStyle()}>
        {label}
      </span>
    </motion.span>
  );
}
