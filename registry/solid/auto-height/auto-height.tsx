import { createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type AutoHeightTransition = {
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
  [key: string]: unknown;
};

export type AutoHeightProps = {
  includeParentBox?: boolean;
  includeSelfBox?: boolean;
  animate?: Record<string, unknown>;
  transition?: AutoHeightTransition;
  wrapperClassName?: string;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const heightSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  bounce: 0,
  restDelta: 0.01,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AutoHeight(props: AutoHeightProps) {
  let root: HTMLDivElement | undefined;
  let content: HTMLDivElement | undefined;
  let observer: ResizeObserver | undefined;
  let frame = 0;
  let controls: ReturnType<typeof animate> | undefined;
  const [height, setHeight] = createSignal(0);

  const spring = () => props.transition ?? heightSpring;

  const measure = () => {
    const element = content;
    if (!element) return 0;

    const base = element.getBoundingClientRect().height;
    let extra = 0;

    if (props.includeParentBox !== false && element.parentElement) {
      const box = element.parentElement.getBoundingClientRect();
      const inner = Array.from(element.parentElement.children).reduce(
        (total, child) => total + child.getBoundingClientRect().height,
        0,
      );
      extra = Math.max(0, box.height - inner);
    }

    if (props.includeSelfBox) {
      const style = getComputedStyle(element);
      extra +=
        (parseFloat(style.paddingTop) || 0) +
        (parseFloat(style.paddingBottom) || 0) +
        (parseFloat(style.borderTopWidth) || 0) +
        (parseFloat(style.borderBottomWidth) || 0);
    }

    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    return Math.ceil((base + extra) * dpr) / dpr;
  };

  const commit = (next: number, instant: boolean) => {
    setHeight(next);
    if (!root) return;
    controls?.stop?.();
    controls = animate(
      root,
      { height: `${next}px`, ...(props.animate ?? {}) } as Parameters<typeof animate>[1],
      instant || reduce() ? { duration: 0 } : (spring() as Parameters<typeof animate>[2]),
    );
  };

  const refresh = (instant = false) => {
    const next = measure();
    if (!next && !height()) {
      setHeight(next);
      return;
    }
    commit(next, instant);
  };

  onMount(() => {
    refresh(true);
    observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => refresh(false));
    });
    if (content) observer.observe(content);
    if (props.includeParentBox !== false && content?.parentElement) {
      observer.observe(content.parentElement);
    }
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    cancelAnimationFrame(frame);
    observer?.disconnect();
    controls?.stop?.();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="auto-height"
      class={props.class}
      style={{ overflow: "hidden", ...(props.style ?? {}) }}
    >
      <div
        ref={(node: HTMLDivElement) => (content = node)}
        class={`w-full ${props.wrapperClassName ?? ""}`}
      >
        {props.children}
      </div>
    </div>
  );
}
