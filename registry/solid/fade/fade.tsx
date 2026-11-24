import { onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type FadeTransition = {
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

export type FadeProps = {
  delay?: number;
  initialOpacity?: number;
  opacity?: number;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  transition?: FadeTransition;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const entranceSpring: FadeTransition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

export function Fade(props: FadeProps) {
  let root: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const from = () => props.initialOpacity ?? 0;

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
      { opacity: [from(), props.opacity ?? 1] },
      options(),
    );
  };

  const reset = () => {
    if (!root) return;
    controls?.stop?.();
    root.style.opacity = `${from()}`;
  };

  onMount(() => {
    if (!root) return;
    root.style.opacity = `${from()}`;
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
      data-slot="fade"
      class={props.class}
      style={{ opacity: from(), ...(props.style ?? {}) }}
    >
      {props.children}
    </div>
  );
}
