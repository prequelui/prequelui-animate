import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import type { Accessor } from "solid-js";
import { animate } from "motion";

export type SlidingNumberTransition = {
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

export type SlidingNumberProps = {
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
  transition?: SlidingNumberTransition;
  onNumberChange?: (value: number) => void;
  onCompleted?: () => void;
  class?: string;
};

type Format = {
  decimals: number;
  decimalSeparator: string;
  thousandSeparator?: string;
  padLength: number;
};

const rollerSpring = { stiffness: 200, damping: 20, mass: 0.4 };
const countSpring = {
  type: "spring" as const,
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};
const digits = Array.from({ length: 10 }, (_, digit) => digit);

const srOnly =
  "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0";

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function digitAt(units: number, place: number) {
  return Math.floor(Math.abs(units) / place) % 10;
}

function formatNumber(value: number, options: Format) {
  const { decimals, decimalSeparator, thousandSeparator, padLength } = options;
  const fixed = Math.abs(value).toFixed(decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  let int = integer.padStart(padLength, "0");
  if (thousandSeparator !== undefined) {
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
  }
  return fraction ? `${sign}${int}${decimalSeparator}${fraction}` : `${sign}${int}`;
}

function Roller(props: {
  units: Accessor<number>;
  place: number;
  reduce: boolean;
  transition: SlidingNumberTransition;
}) {
  let root: HTMLSpanElement | undefined;
  let controls: ReturnType<typeof animate> | undefined;
  let position = digitAt(props.units(), props.place);
  const state = { p: position };

  const paint = (value: number) => {
    if (!root) return;
    const current = ((value % 10) + 10) % 10;
    root.querySelectorAll<HTMLElement>("[data-digit]").forEach((node) => {
      const digit = Number(node.getAttribute("data-digit"));
      let offset = (10 + digit - current) % 10;
      if (offset > 5) offset -= 10;
      node.style.transform = `translateY(${offset * 100}%)`;
    });
  };

  onMount(() => paint(position));

  createEffect(
    on(
      () => digitAt(props.units(), props.place),
      (target) => {
        if (!root) {
          position = target;
          state.p = target;
          return;
        }
        if (props.reduce) {
          controls?.stop?.();
          controls = undefined;
          position = target;
          state.p = target;
          paint(target);
          return;
        }
        controls?.stop?.();
        controls = animate(
          state,
          { p: target },
          {
            ...props.transition,
            onUpdate: () => {
              position = state.p;
              paint(position);
            },
          } as Parameters<typeof animate>[2],
        );
      },
      { defer: true },
    ),
  );

  onCleanup(() => controls?.stop?.());

  return (
    <span
      ref={(node: HTMLSpanElement) => (root = node)}
      data-slot="sliding-number-roller"
      class="relative inline-block w-[1ch] overflow-y-clip leading-none tabular-nums"
    >
      <span class="invisible">0</span>
      <For each={digits}>
        {(digit) => (
          <span
            data-digit={digit}
            aria-hidden="true"
            data-slot="sliding-number-digit"
            class="absolute inset-0 flex items-center justify-center"
          >
            {digit}
          </span>
        )}
      </For>
    </span>
  );
}

export function SlidingNumber(props: SlidingNumberProps) {
  let root: HTMLSpanElement | undefined;
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let countControls: ReturnType<typeof animate> | undefined;

  const factor = () => Math.pow(10, props.decimalPlaces ?? 0);
  const toUnits = (value: number) => Math.round(value * factor());
  const counting = () => props.fromNumber !== undefined;
  const initialValue = props.initiallyStable
    ? props.number
    : (props.fromNumber ?? 0);

  const [units, setUnits] = createSignal(toUnits(initialValue));
  const [seen, setSeen] = createSignal(!(props.inView ?? false));
  const [layout, setLayout] = createSignal({
    length: Math.floor(Math.abs(toUnits(initialValue)) / factor()).toString()
      .length,
    negative: toUnits(initialValue) < 0,
  });
  const valueState = { value: initialValue };

  const shownLength = createMemo(() => {
    const target = Math.floor(Math.abs(props.number)).toString().length;
    return props.padStart ? Math.max(target, layout().length) : layout().length;
  });

  const intPlaces = createMemo(() =>
    Array.from(
      { length: Math.max(1, shownLength()) },
      (_, index) => Math.pow(10, shownLength() - index - 1) * factor(),
    ),
  );

  const decimalPlacesList = createMemo(() =>
    Array.from({ length: props.decimalPlaces ?? 0 }, (_, index) =>
      Math.pow(10, (props.decimalPlaces ?? 0) - index - 1),
    ),
  );

  const format = (): Format => ({
    decimals: props.decimalPlaces ?? 0,
    decimalSeparator: props.decimalSeparator ?? ".",
    thousandSeparator: props.thousandSeparator,
    padLength: props.padStart ? shownLength() : 0,
  });

  const commit = (nextUnits: number) => {
    setUnits(nextUnits);
    const length = Math.floor(Math.abs(nextUnits) / factor()).toString().length;
    const negative = nextUnits < 0;
    const current = layout();
    if (current.length !== length || current.negative !== negative) {
      setLayout({ length, negative });
    }
    props.onNumberChange?.(nextUnits / factor());
  };

  const run = () => {
    if (!seen()) {
      if (!counting() && !props.initiallyStable) commit(toUnits(0));
      return;
    }
    if (timer) clearTimeout(timer);
    countControls?.stop?.();
    if (reduce()) {
      commit(toUnits(props.number));
      props.onCompleted?.();
      return;
    }
    timer = setTimeout(() => {
      if (counting()) {
        countControls = animate(
          valueState,
          { value: props.number },
          {
            ...countSpring,
            onUpdate: () => commit(toUnits(valueState.value)),
            onComplete: () => props.onCompleted?.(),
          } as Parameters<typeof animate>[2],
        );
      } else {
        commit(toUnits(props.number));
        props.onCompleted?.();
      }
    }, props.delay ?? 0);
  };

  onMount(() => {
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

  onCleanup(() => {
    if (timer) clearTimeout(timer);
    countControls?.stop?.();
    observer?.disconnect();
  });

  return (
    <span
      ref={(node: HTMLSpanElement) => (root = node)}
      data-slot="sliding-number"
      class={`inline-flex items-center tabular-nums ${props.class ?? ""}`}
    >
      <span class="sr-only" style={srOnly}>
        {formatNumber(props.number, format())}
      </span>
      <Show when={layout().negative}>
        <span aria-hidden="true" class="mr-1">
          -
        </span>
      </Show>
      <For each={intPlaces()}>
        {(place, index) => {
          const right = () => intPlaces().length - index() - 1;
          return (
            <>
              <Roller
                units={units}
                place={place}
                reduce={reduce()}
                transition={props.transition ?? rollerSpring}
              />
              <Show
                when={
                  props.thousandSeparator !== undefined &&
                  right() > 0 &&
                  right() % 3 === 0
                }
              >
                <span aria-hidden="true">{props.thousandSeparator}</span>
              </Show>
            </>
          );
        }}
      </For>
      <Show when={(props.decimalPlaces ?? 0) > 0}>
        <span aria-hidden="true">{props.decimalSeparator ?? "."}</span>
        <For each={decimalPlacesList()}>
          {(place) => (
            <Roller
              units={units}
              place={place}
              reduce={reduce()}
              transition={props.transition ?? rollerSpring}
            />
          )}
        </For>
      </Show>
    </span>
  );
}
