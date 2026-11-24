import { createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type SpotlightCardProps = {
  color?: string;
  size?: number;
  intensity?: number;
  alwaysOn?: boolean;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function SpotlightCard(props: SpotlightCardProps) {
  let root: HTMLDivElement | undefined;
  let light: HTMLSpanElement | undefined;
  let follow: ReturnType<typeof animate> | undefined;
  let fade: ReturnType<typeof animate> | undefined;
  const state = { x: 0, y: 0 };
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [active, setActive] = createSignal(props.alwaysOn ?? false);

  const gradient = createMemo(
    () =>
      `radial-gradient(${props.size ?? 280}px circle at ${position().x}px ${position().y}px, ${props.color ?? "rgba(255,255,255,0.16)"}, transparent 68%)`,
  );

  const moveTo = (x: number, y: number) => {
    follow?.stop?.();
    follow = animate(
      state,
      { x, y },
      {
        type: "spring",
        stiffness: 260,
        damping: 34,
        mass: 0.5,
        onUpdate: () => setPosition({ x: state.x, y: state.y }),
      } as Parameters<typeof animate>[2],
    );
  };

  const update = (event: PointerEvent) => {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    moveTo(event.clientX - rect.left, event.clientY - rect.top);
  };

  const updateOpacity = () => {
    if (!light) return;
    fade?.stop?.();
    const on = props.alwaysOn ?? false;
    fade = animate(
      light,
      {
        opacity: active() && !reduce() ? (props.intensity ?? 1) : on ? (props.intensity ?? 1) : 0,
      },
      { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
    );
  };

  createEffect(on(active, updateOpacity, { defer: true }));
  createEffect(
    on(
      () => props.alwaysOn,
      (value) => setActive(value ?? false),
      { defer: true },
    ),
  );

  onMount(() => {
    if (light) light.style.opacity = "0";
    if ((props.alwaysOn ?? false) && root) {
      const rect = root.getBoundingClientRect();
      state.x = rect.width / 2;
      state.y = rect.height / 2;
      setPosition({ x: state.x, y: state.y });
    }
    updateOpacity();
  });

  onCleanup(() => {
    follow?.stop?.();
    fade?.stop?.();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="spotlight-card"
      class={`relative isolate overflow-hidden rounded-xl border bg-card text-card-foreground ${props.class ?? ""}`}
      style={props.style}
      onPointerMove={(event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        update(event);
      }}
      onPointerEnter={(event: PointerEvent) => {
        if (reduce() || event.pointerType === "touch") return;
        update(event);
        setActive(true);
      }}
      onPointerLeave={() => {
        if (props.alwaysOn) return;
        setActive(false);
      }}
    >
      <span
        ref={(node: HTMLSpanElement) => (light = node)}
        aria-hidden="true"
        data-slot="spotlight-card-light"
        class="pointer-events-none absolute -inset-px z-0 rounded-[inherit]"
        style={{ background: gradient() }}
      />
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_38%)]"
      />
      <div class="relative z-10">{props.children}</div>
    </div>
  );
}
