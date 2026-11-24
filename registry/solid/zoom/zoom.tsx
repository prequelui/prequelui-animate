import { onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type ZoomTransition = {
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

export type ZoomProps = {
  delay?: number;
  initialScale?: number;
  scale?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: ZoomTransition;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const entranceSpring: ZoomTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Zoom(props: ZoomProps) {
  let root: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const start = () => props.initialScale ?? 0.5;
  const initial = () => (reduce() ? { opacity: 0 } : { transform: `scale(${start()})` });

  const options = () => {
    const base = props.transition ?? entranceSpring;
    return {
      ...base,
      delay: Number(base.delay ?? 0) + (props.delay ?? 0) / 1000,
    } as Parameters<typeof animate>[2];
  };

  const play = () => {
    if (!root) return;
    controls?.stop?.();
    controls = animate(
      root,
      reduce()
        ? { opacity: [0, 1] }
        : { scale: [start(), props.scale ?? 1] },
      options(),
    );
  };

  const reset = () => {
    if (!root) return;
    controls?.stop?.();
    controls = animate(
      root,
      reduce() ? { opacity: 0 } : { scale: start() },
      { duration: 0 },
    );
  };

  onMount(() => {
    if (!root) return;
    Object.assign(root.style, initial());
    if (!props.inView) {
      play();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          play();
          if (props.inViewOnce !== false) observer?.disconnect();
        } else if (props.inViewOnce === false) {
          reset();
        }
      },
      { threshold: 0.35, rootMargin: props.inViewMargin ?? "0px" },
    );
    observer.observe(root);
  });

  onCleanup(() => {
    observer?.disconnect();
    controls?.stop?.();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="zoom"
      class={props.class}
      style={{ ...initial(), ...(props.style ?? {}) }}
    >
      {props.children}
    </div>
  );
}
