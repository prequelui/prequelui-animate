"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  type HTMLMotionProps,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";
import {
  splitGraphemes,
  srOnlyStyle,
  usePageVisible,
  useReduceMotion,
  useTempo,
  useTempoTransition,
} from "./motion";

type Letter = { id: string; label: string };

function matchLetters(
  previous: readonly Letter[],
  labels: readonly string[],
  makeId: () => string,
): Letter[] {
  const rows = previous.length;
  const cols = labels.length;
  const common: number[][] = Array.from({ length: rows + 1 }, () =>
    new Array<number>(cols + 1).fill(0),
  );
  for (let i = rows - 1; i >= 0; i--) {
    for (let j = cols - 1; j >= 0; j--) {
      common[i]![j] =
        previous[i]!.label === labels[j]
          ? common[i + 1]![j + 1]! + 1
          : Math.max(common[i + 1]![j]!, common[i]![j + 1]!);
    }
  }
  const kept = new Map<number, Letter>();
  for (let i = 0, j = 0; i < rows && j < cols; ) {
    if (previous[i]!.label === labels[j]) {
      kept.set(j++, previous[i++]!);
    } else if (common[i + 1]![j]! >= common[i]![j + 1]!) {
      i++;
    } else {
      j++;
    }
  }
  return labels.map((label, index) => kept.get(index) ?? { id: makeId(), label });
}

export type MorphingTextProps = Omit<HTMLMotionProps<"span">, "children"> & {
  text: string | string[];
  delay?: number;
  loop?: boolean;
  holdDelay?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  transition?: Transition;
};

export function MorphingText({
  text,
  delay = 0,
  loop = false,
  holdDelay = 2500,
  inView = false,
  inViewOnce = true,
  transition,
  className,
  ...props
}: MorphingTextProps) {
  const reduce = useReduceMotion();
  const tempo = useTempo();
  const pageVisible = usePageVisible();
  const ref = React.useRef<HTMLSpanElement>(null);
  const onScreen = useInView(ref);
  const entrySpring = useTempoTransition(transition ?? {
    type: "spring",
    stiffness: 300,
    damping: 30,
    opacity: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
    filter: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  });
  const exitTween = useTempoTransition({ duration: 0.15, ease: [0.23, 1, 0.32, 1] });

  const texts = React.useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [index, setIndex] = React.useState(0);
  const [started, setStarted] = React.useState(delay === 0);
  const uid = React.useId();
  const count = React.useRef(0);
  const makeId = React.useCallback(() => `${uid}-${count.current++}`, [uid]);

  React.useEffect(() => {
    if (started) return;
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay, started]);

  const last = !loop && index >= texts.length - 1;
  const playing = started && texts.length > 1 && !last && onScreen && pageVisible;

  React.useEffect(() => {
    if (!playing) return;
    const timer = setTimeout(
      () => setIndex((current) => (current + 1) % texts.length),
      holdDelay,
    );
    return () => clearTimeout(timer);
  }, [holdDelay, playing, texts.length]);

  const current = texts[Math.min(index, texts.length - 1)] ?? "";
  const [letters, setLetters] = React.useState<Letter[]>(() =>
    splitGraphemes(current).map((label) => ({ id: makeId(), label })),
  );
  const [shown, setShown] = React.useState(current);

  if (shown !== current) {
    setShown(current);
    setLetters((previous) => matchLetters(previous, splitGraphemes(current), makeId));
  }

  const known = React.useRef(new Set(letters.map((letter) => letter.id)));
  React.useLayoutEffect(() => {
    known.current = new Set(letters.map((letter) => letter.id));
  }, [letters]);

  let incoming = 0;
  const seenRef = React.useRef<Set<string>>(new Set());

  return (
    <motion.span
      ref={ref}
      data-slot="morphing-text"
      className={cn("relative inline-flex", className)}
      {...props}
    >
      <span className="sr-only" style={srOnlyStyle()}>
        {current}
      </span>
      <span aria-hidden="true" className="relative inline-flex">
        <AnimatePresence mode="popLayout" initial={false}>
          {letters.map((letter) => {
            const isKnown = known.current.has(letter.id) || seenRef.current.has(letter.id);
            if (!isKnown) seenRef.current.add(letter.id);
            const order = isKnown ? 0 : incoming++;
            const letterDelay = isKnown ? 0 : (0.08 + 0.012 * order) * tempo;
            return (
              <motion.span
                key={letter.id}
                layout="position"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: "0.12em", filter: "blur(6px)" }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? { opacity: 0, transition: exitTween }
                    : { opacity: 0, filter: "blur(6px)", transition: exitTween }
                }
                transition={
                  letterDelay
                    ? {
                        ...entrySpring,
                        opacity: { duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: letterDelay },
                        filter: { duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: letterDelay },
                        delay: letterDelay,
                      }
                    : entrySpring
                }
                className="inline-block whitespace-pre will-change-transform"
              >
                {letter.label}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </span>
    </motion.span>
  );
}
