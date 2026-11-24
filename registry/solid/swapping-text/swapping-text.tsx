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
import { animate } from "motion";

export type SwappingTextTransition = {
  type?: "spring" | "tween" | "inertia" | "keyframes";
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  delay?: number;
  ease?: string | number[];
};

export type SwappingTextDirection = "up" | "down";

export type SwappingTextProps = {
  text: string | string[];
  duration?: number;
  delay?: number;
  direction?: SwappingTextDirection;
  stagger?: number;
  transition?: SwappingTextTransition;
  class?: string;
  style?: string | Record<string, string | number>;
};

type Widths = { from: number[]; to: number[] };

type Swap = {
  id: number;
  from: string[];
  to: string[];
  widths: Widths | null;
};

const DEFAULT_TWEEN: SwappingTextTransition = {
  duration: 0.2,
  ease: [0.4, 0, 0.2, 1],
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function splitGraphemes(value: string) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    return Array.from(segmenter.segment(value), (entry) => entry.segment);
  }
  return Array.from(value);
}

function measure(element: HTMLElement | undefined, chars: string[]) {
  if (!element || typeof document === "undefined") return null;
  const context = document.createElement("canvas").getContext("2d");
  if (!context) return null;
  const style = getComputedStyle(element);
  context.font = style.font;
  const spacing = Number.parseFloat(style.letterSpacing) || 0;
  return chars.map((char) => context.measureText(char).width + spacing);
}

export function SwappingText(props: SwappingTextProps) {
  let root: HTMLSpanElement | undefined;
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;
  let cycled = false;
  const controls: Array<ReturnType<typeof animate>> = [];

  const tween = () => props.transition ?? DEFAULT_TWEEN;
  const texts = createMemo(() =>
    Array.isArray(props.text) ? props.text : [props.text],
  );

  const [index, setIndex] = createSignal(0);
  const [onScreen, setOnScreen] = createSignal(true);
  const [pageVisible, setPageVisible] = createSignal(true);

  const current = createMemo(() => texts()[index() % texts().length] ?? "");
  const chars = createMemo(() => splitGraphemes(current()));
  const initial = splitGraphemes(texts()[0] ?? "");

  const [swap, setSwap] = createSignal<Swap>({
    id: 0,
    from: initial,
    to: initial,
    widths: null,
  });

  const slots = createMemo(() =>
    Math.max(swap().from.length, swap().to.length),
  );
  const positions = createMemo(() =>
    Array.from({ length: slots() }, (_, position) => position),
  );

  const sign = () => (props.direction === "down" ? -1 : 1);
  const enter = () => `${sign() * 0.5}em`;
  const exit = () => `${-sign() * 0.5}em`;

  const stopControls = () => {
    while (controls.length) controls.pop()?.stop?.();
  };

  const runSwap = () => {
    if (!root) return;
    stopControls();
    const state = swap();
    const nodes = root.querySelectorAll<HTMLElement>("[data-swap-slot]");
    let order = 0;

    for (const node of nodes) {
      const position = Number(node.dataset.index ?? 0);
      const fromNode = node.querySelector<HTMLElement>("[data-swap-from]");
      const toNode = node.querySelector<HTMLElement>("[data-swap-to]");
      const timing = { ...tween(), delay: order * (props.stagger ?? 0.04) };
      order += 1;

      if (state.widths) {
        controls.push(
          animate(
            node,
            {
              width: [
                `${(state.widths.from[position] ?? 0) / 16}rem`,
                `${(state.widths.to[position] ?? 0) / 16}rem`,
              ],
            },
            timing,
          ),
        );
      }

      if (fromNode) {
        controls.push(
          animate(
            fromNode,
            {
              y: [0, exit()],
              opacity: [1, 0],
              filter: ["blur(0px)", "blur(2px)"],
            },
            timing,
          ),
        );
      }

      if (toNode) {
        controls.push(
          animate(
            toNode,
            {
              y: [enter(), 0],
              opacity: [0, 1],
              filter: ["blur(2px)", "blur(0px)"],
            },
            timing,
          ),
        );
      }
    }
  };

  const schedule = () => {
    if (timer) clearTimeout(timer);
    if (texts().length <= 1 || !onScreen() || !pageVisible()) return;
    timer = setTimeout(
      () => {
        cycled = true;
        setIndex((value) => (value + 1) % texts().length);
        schedule();
      },
      cycled
        ? (props.duration ?? 2000)
        : (props.delay ?? 0) + (props.duration ?? 2000),
    );
  };

  const onVisibilityChange = () => {
    setPageVisible(!document.hidden);
  };

  createEffect(
    on(
      chars,
      (next) => {
        const state = swap();
        if (state.to.join("") === next.join("")) return;

        if (reduce()) {
          setSwap({ id: 0, from: next, to: next, widths: null });
          return;
        }

        const fromWidths = measure(root, state.to);
        const toWidths = measure(root, next);
        setSwap({
          id: state.id + 1,
          from: state.to,
          to: next,
          widths:
            fromWidths && toWidths
              ? { from: fromWidths, to: toWidths }
              : null,
        });

        queueMicrotask(() => {
          runSwap();
          if (settleTimer) clearTimeout(settleTimer);
          const id = swap().id;
          settleTimer = setTimeout(() => {
            const latest = swap();
            if (latest.id !== id) return;
            setSwap({ id, from: latest.to, to: latest.to, widths: null });
          }, 700);
        });
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => [texts().length, onScreen(), pageVisible()] as const,
      () => {
        if (texts().length > 1 && onScreen() && pageVisible()) schedule();
        else if (timer) clearTimeout(timer);
      },
      { defer: true },
    ),
  );

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        setOnScreen(entries.some((entry) => entry.isIntersecting));
      },
      { threshold: 0 },
    );
    if (root) observer.observe(root);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    schedule();
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    if (timer) clearTimeout(timer);
    if (settleTimer) clearTimeout(settleTimer);
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    stopControls();
  });

  return (
    <span
      ref={(node: HTMLSpanElement) => (root = node)}
      data-slot="swapping-text"
      class={`inline-block whitespace-pre ${props.class ?? ""}`}
      style={props.style}
    >
      <span aria-hidden="true" class="inline-flex">
        <For each={positions()}>
          {(position) => {
            const from = () => swap().from[position] ?? "";
            const to = () => swap().to[position] ?? "";
            const animated = () =>
              swap().id > 0 && from() !== to() && !reduce();
            const slotWidth = () =>
              swap().widths
                ? `${(swap().widths!.from[position] ?? 0) / 16}rem`
                : undefined;

            return (
              <Show
                when={animated()}
                fallback={
                  <Show when={to()}>
                    <span class="inline-block">
                      {to() === " " ? "\u00A0" : to()}
                    </span>
                  </Show>
                }
              >
                <span
                  data-swap-slot
                  data-index={position}
                  class="relative inline-block"
                  style={{ width: slotWidth() }}
                >
                  <Show when={from()}>
                    <span data-swap-from class="absolute left-0 top-0">
                      {from() === " " ? "\u00A0" : from()}
                    </span>
                  </Show>
                  <Show when={to()}>
                    <span
                      data-swap-to
                      class="inline-block"
                      style={{
                        position: swap().widths ? "absolute" : "relative",
                        left: 0,
                        top: 0,
                      }}
                    >
                      {to() === " " ? "\u00A0" : to()}
                    </span>
                  </Show>
                  <Show when={swap().widths}>
                    <span class="invisible">{to() || "\u00A0"}</span>
                  </Show>
                </span>
              </Show>
            );
          }}
        </For>
      </span>
      <span class="sr-only">{current()}</span>
    </span>
  );
}
