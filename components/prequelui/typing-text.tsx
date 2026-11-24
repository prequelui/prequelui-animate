"use client";

import * as React from "react";
import { motion, useInView, type HTMLMotionProps } from "motion/react";
import { cn } from "@/lib/utils";
import {
  splitGraphemes,
  srOnlyStyle,
  usePageVisible,
  useReduceMotion,
  useSeen,
} from "./motion";

type Phase = "typing" | "holding" | "erasing" | "done";
type Cursor = { index: number; count: number; phase: Phase };
type TypingContextValue = { typing: boolean; canBlink: boolean };

const TypingContext = React.createContext<TypingContextValue | null>(null);

export type TypingTextProps = React.ComponentProps<"span"> & {
  text: string | string[];
  duration?: number;
  delay?: number;
  holdDelay?: number;
  loop?: boolean;
  inView?: boolean;
  inViewOnce?: boolean;
};

export function TypingText({
  text,
  duration = 100,
  delay = 0,
  holdDelay = 1000,
  loop = false,
  inView = false,
  inViewOnce = true,
  className,
  children,
  ...props
}: TypingTextProps) {
  const reduce = useReduceMotion();
  const pageVisible = usePageVisible();
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref, inView, inViewOnce);
  const onScreen = useInView(ref, { initial: true });

  const texts = React.useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const segments = React.useMemo(() => texts.map(splitGraphemes), [texts]);
  const [cursor, setCursor] = React.useState<Cursor>({
    index: 0,
    count: 0,
    phase: "typing",
  });
  const [ready, setReady] = React.useState(delay === 0);

  React.useEffect(() => {
    setCursor({ index: 0, count: 0, phase: "typing" });
    setReady(delay === 0);
  }, [delay, segments]);

  React.useEffect(() => {
    if (ready) return;
    if (inView && !seen) return;
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay, inView, ready, seen]);

  React.useEffect(() => {
    if (reduce) {
      const index = loop ? 0 : segments.length - 1;
      const count = segments[index]?.length ?? 0;
      setCursor((current) =>
        current.index === index &&
        current.count === count &&
        current.phase === "done"
          ? current
          : { index, count, phase: "done" },
      );
      return;
    }
    if (!ready) return;
    if (inView && !seen) return;
    if (!pageVisible || (loop && !onScreen)) return;
    if (cursor.phase === "done") return;

    const length = segments[cursor.index]?.length ?? 0;
    const isLast = cursor.index === segments.length - 1;
    let timer: ReturnType<typeof setTimeout>;

    if (cursor.phase === "typing") {
      if (cursor.count < length) {
        timer = setTimeout(
          () =>
            setCursor((current) => ({
              ...current,
              count: Math.min(current.count + 1, length),
            })),
          duration,
        );
      } else if (isLast && !loop) {
        setCursor((current) => ({ ...current, phase: "done" }));
      } else {
        timer = setTimeout(
          () => setCursor((current) => ({ ...current, phase: "holding" })),
          holdDelay,
        );
      }
    } else if (cursor.phase === "holding") {
      timer = setTimeout(
        () => setCursor((current) => ({ ...current, phase: "erasing" })),
        Math.max(60, duration),
      );
    } else if (cursor.phase === "erasing") {
      if (cursor.count > 0) {
        timer = setTimeout(
          () =>
            setCursor((current) => ({
              ...current,
              count: Math.max(0, current.count - 1),
            })),
          Math.max(40, duration * 0.55),
        );
      } else {
        timer = setTimeout(
          () =>
            setCursor({
              index: isLast ? 0 : cursor.index + 1,
              count: 0,
              phase: "typing",
            }),
          Math.max(120, duration),
        );
      }
    }

    return () => clearTimeout(timer);
  }, [cursor, duration, holdDelay, inView, loop, onScreen, pageVisible, ready, reduce, seen, segments]);

  const typing =
    !reduce && cursor.phase === "typing" && cursor.count > 0 && cursor.count < (segments[cursor.index]?.length ?? 0);
  const value = React.useMemo(
    () => ({ typing, canBlink: !reduce && pageVisible && onScreen && cursor.phase !== "done" }),
    [cursor.phase, onScreen, pageVisible, reduce, typing],
  );
  const srText = texts.join(", ");
  const current = segments[cursor.index] ?? [];
  const visible = current.slice(0, cursor.count).join("");

  return (
    <TypingContext.Provider value={value}>
      <span
        ref={ref}
        data-slot="typing-text"
        className={cn("inline", className)}
        {...props}
      >
        <span className="sr-only" style={srOnlyStyle()}>
          {srText}
        </span>
        <span aria-hidden="true">{visible}</span>
        {children}
      </span>
    </TypingContext.Provider>
  );
}

export type TypingTextCursorProps = Omit<HTMLMotionProps<"span">, "children">;

export function TypingTextCursor({ className, style, ...props }: TypingTextCursorProps) {
  const context = React.useContext(TypingContext);
  const typing = context?.typing ?? false;
  const canBlink = context?.canBlink ?? true;

  return (
    <motion.span
      data-slot="typing-text-cursor"
      aria-hidden="true"
      animate={typing || !canBlink ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
      transition={
        typing || !canBlink
          ? { duration: 0.1 }
          : { duration: 1, repeat: Infinity, ease: "linear", times: [0, 0.5, 0.5, 1] }
      }
      className={cn(
        "ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-foreground",
        className,
      )}
      style={style}
      {...props}
    />
  );
}

export function useTypingText() {
  return React.useContext(TypingContext);
}
