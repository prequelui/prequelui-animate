import { createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type SpringOptions = {
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

export type MagneticProps = {
  strength?: number;
  range?: number;
  springOptions?: SpringOptions;
  onlyOnHover?: boolean;
  disableOnTouch?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  onPointerEnter?: (event: PointerEvent) => void;
  onPointerMove?: (event: PointerEvent) => void;
  onPointerLeave?: (event: PointerEvent) => void;
  children?: JSX.Element;
};

const defaultSpring = {
  type: "spring" as const,
  stiffness: 100,
  damping: 10,
  mass: 0.5,
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Magnetic(props: MagneticProps) {
  let root: HTMLDivElement | undefined;
  let controls: ReturnType<typeof animate> | undefined;
  let hovering = false;
  const [canHover, setCanHover] = createSignal(false);

  const enabled = () => !reduce() && (canHover() || props.disableOnTouch === false);
  const spring = () => props.springOptions ?? defaultSpring;

  const reset = () => {
    if (!root) return;
    controls?.stop?.();
    controls = animate(root, { x: 0, y: 0 }, spring() as Parameters<typeof animate>[2]);
  };

  const compute = (event: MouseEvent | PointerEvent) => {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);
    const range = props.range ?? 120;

    if (distance <= range) {
      const factor = (1 - distance / range) * (props.strength ?? 0.5);
      controls?.stop?.();
      controls = animate(
        root,
        { x: dx * factor, y: dy * factor },
        spring() as Parameters<typeof animate>[2],
      );
    } else {
      reset();
    }
  };

  const onWindowMove = (event: MouseEvent) => {
    if (!enabled() || props.onlyOnHover) return;
    compute(event);
  };

  onMount(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    if (!props.onlyOnHover) {
      window.addEventListener("mousemove", onWindowMove, { passive: true });
    }
  });

  onCleanup(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("mousemove", onWindowMove);
    controls?.stop?.();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="magnetic"
      class={`inline-block ${props.class ?? ""}`}
      style={props.style}
      onPointerEnter={(event: PointerEvent) => {
        props.onPointerEnter?.(event);
        hovering = true;
      }}
      onPointerMove={(event: PointerEvent) => {
        props.onPointerMove?.(event);
        if (enabled() && props.onlyOnHover && hovering) compute(event);
      }}
      onPointerLeave={(event: PointerEvent) => {
        props.onPointerLeave?.(event);
        hovering = false;
        reset();
      }}
    >
      {props.children}
    </div>
  );
}
