import { For, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type HighlightItem = string | { value: string; label?: string };

export type HighlightTransition = {
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

export type HighlightProps = {
  items?: HighlightItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  hover?: boolean;
  click?: boolean;
  disabled?: boolean;
  class?: string;
  activeClass?: string;
  itemClass?: string;
  highlightStyle?: JSX.CSSProperties;
  transition?: HighlightTransition;
};

const FALLBACK: HighlightItem[] = ["Daily", "Weekly", "Monthly"];

const highlightSpring = { type: "spring" as const, stiffness: 500, damping: 40 };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Highlight(props: HighlightProps) {
  let root: HTMLDivElement | undefined;
  let surface: HTMLSpanElement | undefined;
  let controls: ReturnType<typeof animate> | undefined;
  let previous:
    | { left: number; top: number; width: number; height: number }
    | null = null;

  const [internal, setInternal] = createSignal<string | null>(props.defaultValue ?? null);
  const [canHover, setCanHover] = createSignal(false);

  const entries = createMemo(() =>
    (props.items ?? FALLBACK).map((item) =>
      typeof item === "string"
        ? { value: item, label: item }
        : { value: item.value, label: item.label ?? item.value },
    ),
  );

  const active = () => (props.value !== undefined ? props.value : internal());

  const options = () =>
    (props.transition ?? highlightSpring) as Parameters<typeof animate>[2];

  const select = (next: string | null) => {
    if (props.disabled) return;
    if (props.value === undefined) setInternal(next);
    props.onValueChange?.(next);
  };

  const position = () => {
    const value = active();
    if (!surface || value === null || value === undefined) {
      if (surface) surface.style.opacity = "0";
      previous = null;
      return;
    }
    if (!root) return;

    const node = Array.from(
      root.querySelectorAll<HTMLElement>("[data-highlight-value]"),
    ).find((element) => element.dataset.highlightValue === value);
    if (!node) return;

    const box = root.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    const next = {
      left: rect.left - box.left,
      top: rect.top - box.top,
      width: rect.width,
      height: rect.height,
    };

    surface.style.opacity = "1";

    if (!previous || reduce()) {
      surface.style.width = `${next.width}px`;
      surface.style.height = `${next.height}px`;
      surface.style.transform = `translate(${next.left}px, ${next.top}px)`;
      previous = next;
      return;
    }

    const from = previous;
    previous = next;
    controls?.stop?.();
    controls = animate(
      surface,
      {
        width: [from.width, next.width],
        height: [from.height, next.height],
        x: [from.left, next.left],
        y: [from.top, next.top],
      },
      options(),
    );
  };

  createEffect(
    on(active, () => queueMicrotask(position), { defer: true }),
  );
  createEffect(
    on(
      () => props.defaultValue,
      (value) => {
        if (value !== undefined && value !== null) setInternal(value);
      },
      { defer: true },
    ),
  );

  onMount(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
    queueMicrotask(position);
  });

  onCleanup(() => controls?.stop?.());

  const interactiveHover = () => props.hover === true && canHover();

  const onEnter = (value: string) => {
    if (props.disabled) return;
    if (interactiveHover()) select(value);
  };

  const onLeave = (value: string) => {
    if (props.disabled) return;
    if (interactiveHover() && active() === value) select(null);
  };

  const onClick = (value: string) => {
    if (props.disabled) return;
    if (!interactiveHover() && props.click !== false) select(value);
  };

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="highlight"
      class={`relative ${props.class ?? ""}`}
    >
      <span
        ref={(node: HTMLSpanElement) => (surface = node)}
        aria-hidden="true"
        data-slot="highlight-surface"
        class={`pointer-events-none absolute left-0 top-0 z-0 rounded-[inherit] ${props.activeClass ?? "bg-background shadow-sm"}`}
        style={{ opacity: 0, ...(props.highlightStyle ?? {}) }}
      />
      <For each={entries()}>
        {(entry: { value: string; label: string }) => (
          <button
            type="button"
            data-slot="highlight-item"
            data-value={entry.value}
            data-highlight-value={entry.value}
            data-active={active() === entry.value ? "true" : "false"}
            aria-pressed={active() === entry.value}
            class={`relative z-[1] ${props.itemClass ?? "rounded-lg px-4 py-2 text-[13px] font-medium"}`}
            onClick={() => onClick(entry.value)}
            onPointerEnter={() => onEnter(entry.value)}
            onPointerLeave={() => onLeave(entry.value)}
          >
            {entry.label}
          </button>
        )}
      </For>
    </div>
  );
}
