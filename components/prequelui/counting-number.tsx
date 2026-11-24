"use client";

import * as React from "react";
import {
  animate,
  useMotionValue,
  useMotionValueEvent,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";
import {
  srOnlyStyle,
  useReduceMotion,
  useSeen,
  useTempoTransition,
} from "./motion";

type Format = {
  decimals: number;
  decimalSeparator: string;
  thousandSeparator?: string;
  padLength: number;
};

function formatNumber(value: number, options: Format) {
  const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
  const fixed = Math.abs(value).toFixed(decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  const padded = integer.padStart(padLength, "0");
  const grouped =
    thousandSeparator === undefined
      ? padded
      : padded.replace(/\B(?=(\d{3})+$)/g, thousandSeparator);
  return fraction
    ? `${sign}${grouped}${decimalSeparator}${fraction}`
    : `${sign}${grouped}`;
}

const countSpring: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

export type CountingNumberProps = Omit<React.ComponentProps<"span">, "children"> & {
  number: number;
  fromNumber?: number;
  padStart?: boolean;
  decimalPlaces?: number;
  decimalSeparator?: string;
  thousandSeparator?: string;
  inView?: boolean;
  inViewOnce?: boolean;
  delay?: number;
  initiallyStable?: boolean;
  transition?: Transition;
  onCompleted?: () => void;
};

export function CountingNumber({
  number,
  fromNumber = 0,
  padStart = false,
  decimalPlaces = 0,
  decimalSeparator = ".",
  thousandSeparator,
  inView = false,
  inViewOnce = true,
  delay = 0,
  initiallyStable = false,
  transition,
  onCompleted,
  className,
  ...props
}: CountingNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const visualRef = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref, inView, inViewOnce);
  const reduce = useReduceMotion();
  const spring = useTempoTransition(transition ?? countSpring);
  const value = useMotionValue(initiallyStable ? number : fromNumber);

  const format = React.useMemo<Format>(
    () => ({
      decimals: decimalPlaces,
      decimalSeparator,
      thousandSeparator,
      padLength: padStart ? Math.floor(Math.abs(number)).toString().length : 0,
    }),
    [decimalPlaces, decimalSeparator, number, padStart, thousandSeparator],
  );

  const write = React.useCallback(
    (latest: number) => {
      const node = visualRef.current;
      if (node) node.textContent = formatNumber(latest, format);
    },
    [format],
  );

  useMotionValueEvent(value, "change", write);

  React.useLayoutEffect(() => {
    write(value.get());
  }, [write, value]);

  const springRef = React.useRef(spring);
  React.useEffect(() => {
    springRef.current = spring;
  }, [spring]);

  React.useEffect(() => {
    if (!seen) return;
    if (reduce) {
      value.jump(number);
      onCompleted?.();
      return;
    }
    let controls: ReturnType<typeof animate> | undefined;
    const timer = window.setTimeout(() => {
      controls = animate(value, number, {
        ...springRef.current,
        onComplete: onCompleted,
      } as Transition);
    }, delay);
    return () => {
      window.clearTimeout(timer);
      controls?.stop();
    };
  }, [delay, number, onCompleted, reduce, seen, value]);

  React.useEffect(() => () => value.stop(), [value]);

  const finalText = formatNumber(number, format);

  return (
    <span
      ref={ref}
      data-slot="counting-number"
      className={cn("inline-block tabular-nums", className)}
      {...props}
    >
      <span aria-hidden="true" ref={visualRef} />
      <span className="sr-only" style={srOnlyStyle()}>
        {finalText}
      </span>
    </span>
  );
}
