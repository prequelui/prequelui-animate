import { onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type BlurTransition = {
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

export type BlurProps = {
  delay?: number;
  initialBlur?: number;
  blur?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: BlurTransition;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const entranceSpring: BlurTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Blur(props: BlurProps) {
  let root: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const initialBlur = () => (reduce() ? 0 : (props.initialBlur ?? 10));

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
      { filter: [`blur(${initialBlur()}px)`, `blur(${props.blur ?? 0}px)`] },
      options(),
    );
  };

  const reset = () => {
    if (!root) return;
    controls?.stop?.();
    root.style.filter = `blur(${initialBlur()}px)`;
  };

  onMount(() => {
    if (!root) return;
    root.style.filter = `blur(${initialBlur()}px)`;
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
      data-slot="blur"
      class={props.class}
      style={{ filter: `blur(${initialBlur()}px)`, ...(props.style ?? {}) }}
    >
      {props.children}
    </div>
  );
}
