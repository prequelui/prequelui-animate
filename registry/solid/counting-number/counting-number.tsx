import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
import { animate } from "motion";

type Format = {
  decimals: number;
  decimalSeparator: string;
  thousandSeparator?: string;
  padLength: number;
};

export type CountingNumberTransition = {
  type?: "spring" | "tween" | "inertia" | "keyframes";
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
  duration?: number;
  delay?: number;
  ease?: string | number[];
  restDelta?: number;
  restSpeed?: number;
};

export type CountingNumberProps = {
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
  transition?: CountingNumberTransition;
  onCompleted?: () => void;
  class?: string;
};

const countSpring = {
  type: "spring" as const,
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

const srOnly =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0";

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

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function CountingNumber(props: CountingNumberProps) {
  let root: HTMLSpanElement | undefined;
  let visual: HTMLSpanElement | undefined;
  const [seen, setSeen] = createSignal(!(props.inView ?? false));
  const counter = {
    value: props.initiallyStable ? props.number : (props.fromNumber ?? 0),
  };
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const format = (): Format => ({
    decimals: props.decimalPlaces ?? 0,
    decimalSeparator: props.decimalSeparator ?? ".",
    thousandSeparator: props.thousandSeparator,
    padLength: props.padStart
      ? Math.floor(Math.abs(props.number)).toString().length
      : 0,
  });

  const write = (value: number) => {
    if (visual) visual.textContent = formatNumber(value, format());
  };

  const transition = () => props.transition ?? countSpring;

  const run = () => {
    if (!seen()) return;
    if (timer) clearTimeout(timer);
    controls?.stop?.();
    if (reduce()) {
      counter.value = props.number;
      write(counter.value);
      props.onCompleted?.();
      return;
    }
    timer = setTimeout(() => {
      controls = animate(
        counter,
        { value: props.number },
        {
          ...transition(),
          onUpdate: () => write(counter.value),
          onComplete: () => props.onCompleted?.(),
        } as Parameters<typeof animate>[2],
      );
    }, props.delay ?? 0);
  };

  onMount(() => {
    write(counter.value);
    if (!props.inView) {
      setSeen(true);
      run();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setSeen(visible);
        if (!visible) return;
        run();
        if (props.inViewOnce ?? true) observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
  });

  createEffect(
    on(
      () => props.number,
      () => {
        if (seen()) run();
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => [
        props.decimalPlaces,
        props.decimalSeparator,
        props.thousandSeparator,
        props.padStart,
      ],
      () => write(counter.value),
      { defer: true },
    ),
  );

  onCleanup(() => {
    if (timer) clearTimeout(timer);
    controls?.stop?.();
    observer?.disconnect();
  });

  return (
    <span
      ref={(node: HTMLSpanElement) => (root = node)}
      data-slot="counting-number"
      class={`inline-block tabular-nums ${props.class ?? ""}`}
    >
      <span
        ref={(node: HTMLSpanElement) => (visual = node)}
        aria-hidden="true"
      />
      <span class="sr-only" style={srOnly}>
        {formatNumber(props.number, format())}
      </span>
    </span>
  );
}
