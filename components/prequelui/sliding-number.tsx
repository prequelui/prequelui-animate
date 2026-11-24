"use client";

import * as React from "react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type SpringOptions,
  type Transition,
} from "motion/react";
import { cn } from "@/lib/utils";
import { srOnlyStyle, useReduceMotion, useSeen, useTempoTransition } from "./motion";

const rollerSpring: SpringOptions = { stiffness: 200, damping: 20, mass: 0.4 };
const countSpring: Transition = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

function digitAt(units: number, place: number) {
  return Math.floor(Math.abs(units) / place) % 10;
}

function Digit({ position, digit }: { position: MotionValue<number>; digit: number }) {
  const transform = useTransform(position, (latest) => {
    const current = ((latest % 10) + 10) % 10;
    let offset = (10 + digit - current) % 10;
    if (offset > 5) offset -= 10;
    return `translateY(${offset * 100}%)`;
  });
  return (
    <motion.span
      data-slot="sliding-number-digit"
      aria-hidden="true"
      style={{ transform }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {digit}
    </motion.span>
  );
}

function Roller({
  units,
  place,
  reduce,
  transition,
}: {
  units: MotionValue<number>;
  place: number;
  reduce: boolean;
  transition: SpringOptions;
}) {
  const [initial] = React.useState(() => digitAt(units.get(), place));
  const position = useSpring(initial, transition);

  React.useEffect(() => {
    const apply = (value: number) => {
      const digit = digitAt(value, place);
      if (reduce) position.jump(digit);
      else position.set(digit);
    };
    apply(units.get());
    return units.on("change", apply);
  }, [place, position, reduce, units]);

  return (
    <span
      data-slot="sliding-number-roller"
      className="relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums"
    >
      <span className="invisible">0</span>
      {Array.from({ length: 10 }, (_, digit) => (
        <Digit key={digit} position={position} digit={digit} />
      ))}
    </span>
  );
}

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
  let int = integer.padStart(padLength, "0");
  if (thousandSeparator !== undefined) {
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }
  return fraction
    ? `${sign}${int}${decimalSeparator}${fraction}`
    : `${sign}${int}`;
}

export type SlidingNumberProps = Omit<React.ComponentProps<"span">, "children"> & {
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
  transition?: SpringOptions;
  onNumberChange?: (value: number) => void;
  onCompleted?: () => void;
};

export function SlidingNumber({
  number,
  fromNumber,
  padStart = false,
  decimalPlaces = 0,
  decimalSeparator = ".",
  thousandSeparator,
  inView = false,
  inViewOnce = true,
  delay = 0,
  initiallyStable = false,
  transition,
  onNumberChange,
  onCompleted,
  className,
  ...props
}: SlidingNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const seen = useSeen(ref, inView, inViewOnce);
  const reduce = useReduceMotion();
  const roller = useTempoTransition(transition ?? (rollerSpring as Transition));
  const count = useTempoTransition(countSpring);

  const counting = fromNumber !== undefined;
  const factor = Math.pow(10, decimalPlaces);
  const toUnits = React.useCallback(
    (value: number) => Math.round(value * factor),
    [factor],
  );
  const initial = initiallyStable ? number : fromNumber ?? 0;
  const value = useMotionValue(initial);
  const units = useMotionValue(toUnits(initial));

  const [layout, setLayout] = React.useState(() => ({
    length: Math.floor(Math.abs(toUnits(initial)) / factor).toString().length,
    negative: toUnits(initial) < 0,
  }));

  React.useEffect(() => {
    return value.on("change", (latest) => units.set(toUnits(latest)));
  }, [toUnits, units, value]);

  React.useEffect(() => {
    return units.on("change", (latest) => {
      const next = {
        length: Math.floor(Math.abs(latest) / factor).toString().length,
        negative: latest < 0,
      };
      setLayout((current) =>
        current.length === next.length && current.negative === next.negative
          ? current
          : next,
      );
      onNumberChange?.(latest / factor);
    });
  }, [factor, onNumberChange, units]);

  const countRef = React.useRef(count);
  React.useEffect(() => {
    countRef.current = count;
  }, [count]);

  React.useEffect(() => {
    if (!seen) {
      if (!counting && !initiallyStable) value.jump(0);
      return;
    }
    if (reduce) {
      value.jump(number);
      onCompleted?.();
      return;
    }
    let controls: ReturnType<typeof animate> | undefined;
    const timer = window.setTimeout(() => {
      if (counting) {
        controls = animate(value, number, {
          ...countRef.current,
          onComplete: onCompleted,
        } as Transition);
      } else {
        value.jump(number);
        onCompleted?.();
      }
    }, delay);
    return () => {
      window.clearTimeout(timer);
      controls?.stop();
    };
  }, [counting, delay, initiallyStable, number, onCompleted, reduce, seen, value]);

  const shownLength = padStart
    ? Math.max(Math.floor(Math.abs(number)).toString().length, layout.length)
    : layout.length;

  const intPlaces = Array.from({ length: Math.max(1, shownLength) }, (_, index) =>
    Math.pow(10, shownLength - index - 1) * factor,
  );
  const decimalPlacesList = Array.from({ length: decimalPlaces }, (_, index) =>
    Math.pow(10, decimalPlaces - index - 1),
  );

  const format: Format = {
    decimals: decimalPlaces,
    decimalSeparator,
    thousandSeparator,
    padLength: padStart ? shownLength : 0,
  };

  return (
    <span
      ref={ref}
      data-slot="sliding-number"
      className={cn("inline-flex items-center tabular-nums", className)}
      {...props}
    >
      <span className="sr-only" style={srOnlyStyle()}>
        {formatNumber(number, format)}
      </span>
      {layout.negative && (
        <span aria-hidden="true" className="mr-1">
          -
        </span>
      )}
      {intPlaces.map((place, index) => {
        const right = intPlaces.length - index - 1;
        const separator =
          thousandSeparator !== undefined && right > 0 && right % 3 === 0;
        return (
          <React.Fragment key={`int-${place}`}>
            <Roller
              units={units}
              place={place}
              reduce={reduce}
              transition={roller as SpringOptions}
            />
            {separator && <span aria-hidden="true">{thousandSeparator}</span>}
          </React.Fragment>
        );
      })}
      {decimalPlaces > 0 && (
        <>
          <span aria-hidden="true">{decimalSeparator}</span>
          {decimalPlacesList.map((place) => (
            <Roller
              key={`dec-${place}`}
              units={units}
              place={place}
              reduce={reduce}
              transition={roller as SpringOptions}
            />
          ))}
        </>
      )}
    </span>
  );
}
