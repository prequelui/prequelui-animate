import { createEffect, createSignal, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type ImageZoomTransition = {
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

export type ImageZoomProps = {
  zoomScale?: number;
  transition?: ImageZoomTransition;
  zoomOnClick?: boolean;
  zoomOnHover?: boolean;
  disabled?: boolean;
  width?: string | number;
  height?: string | number;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const defaultTransition = { type: "spring" as const, stiffness: 200, damping: 28 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ImageZoom(props: ImageZoomProps) {
  let root: HTMLDivElement | undefined;
  let inner: HTMLDivElement | undefined;
  let control: ReturnType<typeof animate> | undefined;
  const [zoomed, setZoomed] = createSignal(false);
  const [origin, setOrigin] = createSignal("50% 50%");
  const [coarse, setCoarse] = createSignal(false);

  const setOriginFromEvent = (event: MouseEvent | TouchEvent) => {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in event && event.touches[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ("clientX" in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    setOrigin(
      `${rect.width ? (x / rect.width) * 100 : 50}% ${
        rect.height ? (y / rect.height) * 100 : 50
      }%`,
    );
  };

  const scale = () => {
    if (!inner) return;
    control?.stop?.();
    control = animate(
      inner,
      {
        scale:
          props.disabled || reduce() ? 1 : zoomed() ? (props.zoomScale ?? 3) : 1,
      },
      (props.transition ?? defaultTransition) as Parameters<typeof animate>[2],
    );
  };

  const handleEnter = (event: MouseEvent) => {
    if (props.disabled || coarse() || props.zoomOnHover === false) return;
    setOriginFromEvent(event);
    setZoomed(true);
  };

  const handleLeave = () => {
    if (props.disabled || coarse() || props.zoomOnHover === false) return;
    setZoomed(false);
  };

  const handleMove = (event: MouseEvent) => {
    if (props.disabled || coarse()) return;
    setOriginFromEvent(event);
  };

  const handleClick = (event: MouseEvent) => {
    if (props.disabled || props.zoomOnClick === false) return;
    setOriginFromEvent(event);
    setZoomed((value) => !value);
  };

  const handleTouchStart = (event: TouchEvent) => {
    if (props.disabled) return;
    setOriginFromEvent(event);
    if (props.zoomOnClick === false) setZoomed(true);
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (props.disabled) return;
    setOriginFromEvent(event);
  };

  const handleTouchEnd = () => {
    if (props.disabled) return;
    if (props.zoomOnClick === false) setZoomed(false);
  };

  createEffect(on(zoomed, scale, { defer: true }));

  onMount(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  });

  onCleanup(() => control?.stop?.());

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      role="img"
      data-slot="image-zoom"
      class={`relative overflow-hidden ${props.class ?? ""}`}
      style={{
        width: props.width ?? "100%",
        height: props.height ?? "100%",
        "touch-action": "manipulation",
        cursor: props.disabled ? "default" : zoomed() ? "zoom-out" : "zoom-in",
        ...(props.style ?? {}),
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMove}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={(node: HTMLDivElement) => (inner = node)}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          "align-items": "center",
          "justify-content": "center",
          "transform-origin": origin(),
          "will-change": "transform",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
