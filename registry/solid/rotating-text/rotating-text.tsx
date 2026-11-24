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

export type RotatingTextTransition = {
  type?: "spring" | "tween" | "inertia" | "keyframes";
  stiffness?: number;
  damping?: number;
  mass?: number;
  duration?: number;
  delay?: number;
  ease?: string | number[];
};

export type RotatingTextAlign = "start" | "center" | "end";

export type RotatingTextProps = {
  text?: string | string[];
  texts?: string | string[];
  duration?: number;
  y?: number;
  delay?: number;
  align?: RotatingTextAlign;
  loop?: boolean;
  transition?: RotatingTextTransition;
  class?: string;
  style?: string | Record<string, string | number>;
};

const DEFAULT_TWEEN: RotatingTextTransition = {
  duration: 0.3,
  ease: [0.23, 1, 0.32, 1],
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function RotatingText(props: RotatingTextProps) {
  let root: HTMLSpanElement | undefined;
  let word: HTMLSpanElement | undefined;
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const [index, setIndex] = createSignal(0);
  const [rotated, setRotated] = createSignal(false);
  const [onScreen, setOnScreen] = createSignal(true);
  const [pageVisible, setPageVisible] = createSignal(true);

  const tween = () => props.transition ?? DEFAULT_TWEEN;

  const list = createMemo(() => {
    const value = props.texts ?? props.text ?? "";
    const next = Array.isArray(value) ? value : [value];
    return next.length ? next : [""];
  });

  const unique = createMemo(() => [...new Set(list())]);
  const current = createMemo(() => list()[index() % list().length] ?? "");
  const align = () => props.align ?? "start";
  const playing = () =>
    onScreen() &&
    pageVisible() &&
    ((props.loop ?? true) || index() < list().length - 1);

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
    timer = undefined;
  };

  const swap = (next: number) => {
    const node = word;
    const travel = reduce() ? 0 : (props.y ?? -50);
    if (!node) {
      setIndex(next);
      return;
    }

    controls?.stop?.();

    const finish = () => {
      setIndex(next);
      const entering = word;
      if (!entering) return;
      entering.style.opacity = "0";
      entering.style.transform = `translateY(${-travel}px)`;
      controls = animate(
        entering,
        { opacity: [0, 1], y: [-travel, 0] },
        tween(),
      );
    };

    controls = animate(
      node,
      { opacity: [1, 0], y: [0, travel] },
      tween(),
    );

    if (controls?.finished) controls.finished.then(finish, finish);
    else finish();
  };

  const schedule = () => {
    clearTimer();
    if (!playing()) return;
    timer = setTimeout(
      () => {
        setRotated(true);
        const next = props.loop === false
          ? Math.min(index() + 1, list().length - 1)
          : (index() + 1) % list().length;
        swap(next);
        schedule();
      },
      rotated() ? (props.duration ?? 2000) : (props.delay ?? 0),
    );
  };

  const onVisibilityChange = () => {
    setPageVisible(!document.hidden);
  };

  createEffect(
    on(
      () => list().join("\u0001"),
      () => {
        setIndex(0);
        setRotated(false);
        clearTimer();
        schedule();
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      playing,
      (active) => {
        if (active) schedule();
        else clearTimer();
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
    clearTimer();
    observer?.disconnect();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    controls?.stop?.();
  });

  return (
    <span
      ref={(node: HTMLSpanElement) => (root = node)}
      data-slot="rotating-text"
      class={`relative inline-block overflow-hidden py-1 align-baseline ${props.class ?? ""}`}
      style={props.style}
    >
      <span class="sr-only">{list().join(", ")}</span>
      <span
        aria-hidden="true"
        class="inline-grid"
        style={{ "justify-items": align(), "align-items": "baseline" }}
      >
        <For each={unique()}>
          {(item) => (
            <span
              class="invisible whitespace-nowrap"
              style={{ "grid-area": "1 / 1" }}
            >
              {item}
            </span>
          )}
        </For>
        <span style={{ "grid-area": "1 / 1", "justify-self": align() }}>
          <span
            ref={(node: HTMLSpanElement) => (word = node)}
            aria-hidden="true"
            class="inline-block whitespace-nowrap"
          >
            {current()}
          </span>
        </span>
      </span>
    </span>
  );
}
