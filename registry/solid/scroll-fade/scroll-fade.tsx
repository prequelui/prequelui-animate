import { createEffect, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type ScrollFadeOrientation = "vertical" | "horizontal" | "both";
export type ScrollFadeEdge = "top" | "bottom" | "left" | "right";

export type ScrollFadeTransition = {
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

export type ScrollFadeProps = {
  orientation?: ScrollFadeOrientation;
  size?: number;
  transition?: ScrollFadeTransition;
  enabled?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const EDGES: ScrollFadeEdge[] = ["top", "bottom", "left", "right"];
const VARS: Record<ScrollFadeEdge | "size", string> = {
  top: "--scroll-fade-top",
  bottom: "--scroll-fade-bottom",
  left: "--scroll-fade-left",
  right: "--scroll-fade-right",
  size: "--scroll-fade-size",
};
const fadeTween = { duration: 0.2, ease: [0.23, 1, 0.32, 1] };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function ScrollFade(props: ScrollFadeProps) {
  let root: HTMLDivElement | undefined;
  let observer: ResizeObserver | undefined;
  let mutation: MutationObserver | undefined;
  let control: ReturnType<typeof animate> | undefined;
  let masked = false;
  let teardown = () => {};
  let started = false;
  const values: Record<ScrollFadeEdge, number> = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  const maskFor = () => {
    const stop = (edge: ScrollFadeEdge) =>
      `rgb(0 0 0 / calc(1 - var(${VARS[edge]}, 0)))`;
    const depth = (edge: ScrollFadeEdge) =>
      `calc(var(${VARS.size}) * min(1, var(${VARS[edge]}, 0) * 1000))`;
    const vertical = `linear-gradient(to bottom, ${stop("top")} 0, #000 ${depth(
      "top",
    )}, #000 calc(100% - ${depth("bottom")}), ${stop("bottom")} 100%)`;
    const horizontal = `linear-gradient(to right, ${stop("left")} 0, #000 ${depth(
      "left",
    )}, #000 calc(100% - ${depth("right")}), ${stop("right")} 100%)`;

    if (props.orientation === "horizontal") return horizontal;
    if (props.orientation === "vertical") return vertical;
    return `${vertical}, ${horizontal}`;
  };

  const applyMask = (element: HTMLElement, mask: string | null) => {
    if (mask) {
      element.style.setProperty("mask-image", mask);
      element.style.setProperty("-webkit-mask-image", mask);
      element.style.setProperty("mask-composite", "intersect");
      element.style.setProperty("-webkit-mask-composite", "source-in");
    } else {
      for (const property of [
        "mask-image",
        "-webkit-mask-image",
        "mask-composite",
        "-webkit-mask-composite",
      ]) {
        element.style.removeProperty(property);
      }
    }
  };

  const settleOptions = () => props.transition ?? fadeTween;

  const start = () => {
    const element = root;
    if (!element || props.enabled === false) return;

    const orientation = props.orientation ?? "vertical";
    const size = props.size ?? 40;
    const verticalAxis = orientation !== "horizontal";
    const horizontalAxis = orientation !== "vertical";
    const mask = maskFor();
    masked = false;

    element.style.setProperty(VARS.size, `${size}px`);

    const write = () => {
      let any = false;
      for (const edge of EDGES) {
        const amount = clamp(values[edge]!, 0, 1);
        if (amount > 0.001) any = true;
        element.style.setProperty(VARS[edge], amount.toFixed(4));
      }
      if (any !== masked) {
        masked = any;
        applyMask(element, any ? mask : null);
      }
    };

    const ramp = size / 2;
    const amount = (distance: number) =>
      ramp > 0 ? clamp(distance / ramp, 0, 1) : distance > 0.5 ? 1 : 0;

    const measure = (follow: boolean) => {
      const targets: Record<ScrollFadeEdge, number> = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      };

      if (verticalAxis) {
        const max = element.scrollHeight - element.clientHeight;
        if (max > 1) {
          targets.top = amount(element.scrollTop);
          targets.bottom = amount(max - element.scrollTop);
        }
      }

      if (horizontalAxis) {
        const max = element.scrollWidth - element.clientWidth;
        if (max > 1) {
          const fromStart = Math.abs(element.scrollLeft);
          const fromEnd = max - fromStart;
          const rtl = getComputedStyle(element).direction === "rtl";
          targets.left = amount(rtl ? fromEnd : fromStart);
          targets.right = amount(rtl ? fromStart : fromEnd);
        }
      }

      if (follow || reduce()) {
        for (const edge of EDGES) values[edge] = targets[edge]!;
        write();
      } else {
        control?.stop?.();
        control = animate(values, targets, {
          ...settleOptions(),
          onUpdate: write,
        } as Parameters<typeof animate>[2]);
      }
    };

    measure(true);

    const onScroll = () => measure(true);
    element.addEventListener("scroll", onScroll, { passive: true });

    observer = new ResizeObserver(() => measure(false));
    observer.observe(element);
    for (const child of element.children) observer.observe(child);

    mutation = new MutationObserver(() => {
      measure(false);
      observer?.disconnect();
      observer = new ResizeObserver(() => measure(false));
      observer.observe(element);
      for (const child of element.children) observer.observe(child);
    });
    mutation.observe(element, { childList: true, subtree: true });

    teardown = () => {
      element.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      mutation?.disconnect();
      control?.stop?.();
      applyMask(element, null);
      for (const name of Object.values(VARS)) element.style.removeProperty(name);
      for (const edge of EDGES) values[edge] = 0;
    };
  };

  const restart = () => {
    teardown();
    teardown = () => {};
    queueMicrotask(start);
  };

  createEffect(
    on(
      () => [props.orientation, props.size, props.enabled, props.transition],
      () => {
        if (started) restart();
      },
      { defer: true },
    ),
  );

  onMount(() => {
    started = true;
    start();
  });

  onCleanup(() => {
    started = false;
    teardown();
  });

  const overflowStyle = () => {
    const orientation = props.orientation ?? "vertical";
    const base: JSX.CSSProperties = {};
    if (orientation === "horizontal") base["overflow-x"] = "auto";
    else if (orientation === "both") base.overflow = "auto";
    else base["overflow-y"] = "auto";
    return { ...base, ...(props.style ?? {}) };
  };

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="scroll-fade"
      data-orientation={props.orientation ?? "vertical"}
      class={props.class}
      style={overflowStyle()}
    >
      {props.children}
    </div>
  );
}
