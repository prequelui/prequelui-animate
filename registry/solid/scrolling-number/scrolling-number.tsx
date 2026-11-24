import {
  For,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import { animate } from "motion";

export type ScrollingNumberTransition = {
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

export type ScrollingNumberProps = {
  number: number;
  fromNumber?: number;
  step?: number;
  itemsSize?: number;
  sideItemsCount?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  delay?: number;
  transition?: ScrollingNumberTransition;
  onCompleted?: () => void;
  class?: string;
};

const bandSpring = {
  type: "spring" as const,
  stiffness: 90,
  damping: 30,
  restDelta: 0.001,
  restSpeed: 0.01,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function ScrollingNumber(props: ScrollingNumberProps) {
  let root: HTMLDivElement | undefined;
  let band: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let controls: ReturnType<typeof animate> | undefined;
  const [started, setStarted] = createSignal(false);

  const values = createMemo(() => {
    const size = Math.max(1, props.step ?? 1);
    const from = Math.round((props.fromNumber ?? 0) / size) * size;
    const to = Math.round(props.number / size) * size;
    const direction = to >= from ? 1 : -1;
    const count = Math.abs(Math.round((to - from) / size)) + 1;
    return Array.from(
      { length: count },
      (_, index) => from + index * size * direction,
    );
  });

  const targetIndex = createMemo(() => values().length - 1);
  const height = () => (props.itemsSize ?? 30) * (1 + (props.sideItemsCount ?? 2) * 2);
  const initialY = () => (props.sideItemsCount ?? 2) * (props.itemsSize ?? 30);
  const finalY = () => ((props.sideItemsCount ?? 2) - targetIndex()) * (props.itemsSize ?? 30);

  const move = () => {
    if (!band) return;
    controls?.stop?.();
    if (reduce()) {
      band.style.transform = `translateY(${finalY()}px)`;
      props.onCompleted?.();
      return;
    }
    controls = animate(
      band,
      { y: finalY() },
      {
        ...(props.transition ?? bandSpring),
      } as Parameters<typeof animate>[2],
    );
    controls.finished.then(() => {
      if (started()) props.onCompleted?.();
    });
  };

  const start = () => {
    if (started()) return;
    if (reduce()) {
      setStarted(true);
      queueMicrotask(move);
      return;
    }
    timer = setTimeout(() => {
      setStarted(true);
      queueMicrotask(move);
    }, props.delay ?? 0);
  };

  onMount(() => {
    if (band) band.style.transform = `translateY(${initialY()}px)`;
    if (!props.inView) {
      start();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        start();
        if (props.inViewOnce ?? true) observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
  });

  createEffect(
    on(
      () => finalY(),
      () => {
        if (started()) queueMicrotask(move);
      },
      { defer: true },
    ),
  );

  onCleanup(() => {
    if (timer) clearTimeout(timer);
    controls?.stop?.();
    observer?.disconnect();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="scrolling-number"
      class={`relative isolate inline-block overflow-hidden rounded-lg [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_76%,transparent)] ${props.class ?? ""}`}
      style={{ height: `${height()}px` }}
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-1 top-1/2 z-10 -translate-y-1/2 rounded-md border bg-foreground/[0.06] dark:bg-background/20"
        style={{ height: `${props.itemsSize ?? 30}px` }}
      />
      <div
        ref={(node: HTMLDivElement) => (band = node)}
        aria-hidden="true"
        class="relative flex flex-col"
      >
        <For each={values()}>
          {(value) => (
            <div
              class={`flex shrink-0 items-center justify-center font-medium tabular-nums ${
                value === props.number
                  ? "text-foreground"
                  : "text-muted-foreground/50"
              }`}
              style={{ height: `${props.itemsSize ?? 30}px` }}
            >
              {value.toLocaleString("en-US")}
            </div>
          )}
        </For>
      </div>
      <span class="sr-only">{props.number.toLocaleString("en-US")}</span>
    </div>
  );
}
