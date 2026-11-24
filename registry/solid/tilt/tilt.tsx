import { onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type TiltSpring = {
  type?: "spring" | "tween" | "inertia" | "keyframes";
  stiffness?: number;
  damping?: number;
  mass?: number;
  bounce?: number;
  duration?: number;
  ease?: string | number[];
  restDelta?: number;
  restSpeed?: number;
  [key: string]: unknown;
};

export type TiltProps = {
  maxTilt?: number;
  perspective?: number;
  transition?: TiltSpring;
  class?: string;
  style?: JSX.CSSProperties;
  onPointerMove?: (event: PointerEvent) => void;
  onPointerLeave?: (event: PointerEvent) => void;
  children?: JSX.Element;
};

const defaultSpring = {
  type: "spring" as const,
  stiffness: 300,
  damping: 25,
  mass: 0.5,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Tilt(props: TiltProps) {
  let root: HTMLDivElement | undefined;
  let controls: ReturnType<typeof animate> | undefined;

  const spring = () => props.transition ?? defaultSpring;

  const move = (event: PointerEvent) => {
    props.onPointerMove?.(event);
    if (reduce() || !root) return;
    const rect = root.getBoundingClientRect();
    const px = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
    const py = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
    controls?.stop?.();
    controls = animate(
      root,
      {
        rotateX: -(py * 2 - 1) * (props.maxTilt ?? 10),
        rotateY: (px * 2 - 1) * (props.maxTilt ?? 10),
        transformPerspective: props.perspective ?? 800,
      },
      spring() as Parameters<typeof animate>[2],
    );
  };

  const leave = (event: PointerEvent) => {
    props.onPointerLeave?.(event);
    if (!root) return;
    controls?.stop?.();
    controls = animate(
      root,
      {
        rotateX: 0,
        rotateY: 0,
        transformPerspective: props.perspective ?? 800,
      },
      spring() as Parameters<typeof animate>[2],
    );
  };

  onMount(() => {
    if (!root) return;
    controls = animate(
      root,
      {
        rotateX: 0,
        rotateY: 0,
        transformPerspective: props.perspective ?? 800,
      },
      { duration: 0 },
    );
  });

  onCleanup(() => controls?.stop?.());

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="tilt"
      class={`will-change-transform ${props.class ?? ""}`}
      style={{ "transform-style": "preserve-3d", ...(props.style ?? {}) }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {props.children}
    </div>
  );
}
