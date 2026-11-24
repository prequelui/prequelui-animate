import { createMemo, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type SlideDirection = "up" | "down" | "left" | "right";

export type SlideTransition = {
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

export type SlideProps = {
  delay?: number;
  direction?: SlideDirection;
  offset?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: SlideTransition;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const entranceSpring: SlideTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Slide(props: SlideProps) {
  let root: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const vertical = createMemo(
    () => (props.direction ?? "up") === "up" || (props.direction ?? "up") === "down",
  );
  const start = createMemo(() =>
    props.direction === "right" || props.direction === "down"
      ? -(props.offset ?? 100)
      : (props.offset ?? 100),
  );

  const initial = () =>
    reduce()
      ? { opacity: 0 }
      : vertical()
        ? { transform: `translateY(${start()}px)` }
        : { transform: `translateX(${start()}px)` };

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
    if (reduce()) {
      animate(root, { opacity: [0, 1] }, options());
      return;
    }
    controls = animate(
      root,
      vertical() ? { y: [start(), 0] } : { x: [start(), 0] },
      options(),
    );
  };

  const reset = () => {
    if (!root) return;
    controls?.stop?.();
    controls = animate(
      root,
      reduce()
        ? { opacity: 0 }
        : vertical()
          ? { y: start() }
          : { x: start() },
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
      data-slot="slide"
      data-direction={props.direction ?? "up"}
      class={props.class}
      style={{ ...initial(), ...(props.style ?? {}) }}
    >
      {props.children}
    </div>
  );
}
