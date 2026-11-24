import { For, Show, createEffect, createMemo, createSignal, on, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";
import { animate } from "motion";

export type ParticlesSide = "top" | "bottom" | "left" | "right";
export type ParticlesAlign = "start" | "center" | "end";

export type ParticlesHandle = { burst: () => void };

export type ParticlesProps = {
  animate?: boolean;
  inView?: boolean;
  inViewOnce?: boolean;
  inViewMargin?: string;
  trigger?: number;
  side?: ParticlesSide;
  align?: ParticlesAlign;
  count?: number;
  radius?: number;
  spread?: number;
  duration?: number;
  holdDelay?: number;
  sideOffset?: number;
  alignOffset?: number;
  delay?: number;
  size?: number;
  color?: string;
  transition?: Record<string, unknown>;
  class?: string;
  style?: JSX.CSSProperties;
  onReady?: (handle: ParticlesHandle) => void;
  children?: JSX.Element;
};

type Burst = { key: string; index: number };

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Particles(props: ParticlesProps) {
  let root: HTMLDivElement | undefined;
  let layer: HTMLDivElement | undefined;
  let observer: IntersectionObserver | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let generation = 0;
  let controls: Array<ReturnType<typeof animate>> = [];

  const [onScreen, setOnScreen] = createSignal(props.inView !== true);
  const [bursts, setBursts] = createSignal<Burst[]>([]);

  const vertical = createMemo(() => (props.side ?? "top") === "top" || (props.side ?? "top") === "bottom");
  const alignPercent = createMemo(() =>
    props.align === "start" ? "0%" : props.align === "end" ? "100%" : "50%",
  );
  const top = createMemo(() =>
    vertical()
      ? props.side === "top"
        ? `calc(0% - ${props.sideOffset ?? 0}px)`
        : `calc(100% + ${props.sideOffset ?? 0}px)`
      : `calc(${alignPercent()} + ${props.alignOffset ?? 0}px)`,
  );
  const left = createMemo(() =>
    vertical()
      ? `calc(${alignPercent()} + ${props.alignOffset ?? 0}px)`
      : props.side === "left"
        ? `calc(0% - ${props.sideOffset ?? 0}px)`
        : `calc(100% + ${props.sideOffset ?? 0}px)`,
  );

  const stopControls = () => {
    for (const control of controls) control?.stop?.();
    controls = [];
  };

  const burst = () => {
    if (props.animate === false || !onScreen() || reduce()) return;
    generation += 1;
    const current = generation;
    const count = props.count ?? 6;
    setBursts(
      Array.from({ length: count }, (_, index) => ({
        key: `${current}-${index}`,
        index,
      })),
    );

    queueMicrotask(() => {
      const nodes = Array.from(layer?.children ?? []);
      const fullCircle = (props.spread ?? 360) % 360 === 0;
      const step =
        (((props.spread ?? 360) * Math.PI) / 180) /
        Math.max(1, fullCircle ? count : count - 1);

      nodes.forEach((node, index) => {
        const angle = index * step;
        const x = Math.round(Math.cos(angle) * (props.radius ?? 30) * 100) / 100;
        const y = Math.round(Math.sin(angle) * (props.radius ?? 30) * 100) / 100;
        controls.push(
          animate(
            node as HTMLElement,
            {
              x: [0, x],
              y: [0, y],
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            },
            {
              duration: props.duration ?? 0.8,
              delay: (props.delay ?? 0) + index * (props.holdDelay ?? 0.05),
              ease: "easeOut",
              ...(props.transition ?? {}),
            } as Parameters<typeof animate>[2],
          ),
        );
      });

      const total =
        ((props.duration ?? 0.8) +
          (props.delay ?? 0) +
          (props.holdDelay ?? 0.05) * (count - 1)) *
        1000;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setBursts([]), total + 80);
    });
  };

  createEffect(
    on(
      () => props.trigger ?? 0,
      (value, previous) => {
        if (previous === undefined || value === previous) return;
        burst();
      },
      { defer: true },
    ),
  );

  onMount(() => {
    props.onReady?.({ burst });
    if (props.inView) {
      observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.some((entry) => entry.isIntersecting);
          setOnScreen(visible);
          if (visible && props.inViewOnce !== false) observer?.disconnect();
        },
        { threshold: 0.35, rootMargin: props.inViewMargin ?? "0px" },
      );
      if (root) observer.observe(root);
    }
    if ((props.trigger ?? 0) > 0) burst();
  });

  onCleanup(() => {
    observer?.disconnect();
    if (timer) clearTimeout(timer);
    stopControls();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="particles"
      class={`relative ${props.class ?? ""}`}
      style={props.style}
    >
      {props.children}
      <div
        ref={(node: HTMLDivElement) => (layer = node)}
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 z-10"
      >
        <Show when={bursts().length > 0}>
          <For each={bursts()}>
            {(dot: Burst) => (
              <span
                class="pointer-events-none absolute rounded-full"
                style={{
                  top: top(),
                  left: left(),
                  width: `${props.size ?? 4}px`,
                  height: `${props.size ?? 4}px`,
                  "margin-left": `${-(props.size ?? 4) / 2}px`,
                  "margin-top": `${-(props.size ?? 4) / 2}px`,
                  background: props.color ?? "currentColor",
                }}
              />
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
