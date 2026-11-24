import {
  For,
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import { animate } from "motion";

export type RadialProgressTransition = {
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
};

export type RadialProgressProps = {
  value: number;
  size?: number;
  strokeWidth?: number;
  from?: number;
  label?: string;
  showLabel?: boolean;
  showTicks?: boolean;
  ticks?: number;
  inView?: boolean;
  color?: string;
  trackColor?: string;
  transition?: RadialProgressTransition;
  class?: string;
};

const arcSpring = {
  type: "spring" as const,
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
};

const countSpring = {
  type: "spring" as const,
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function formatNumber(value: number) {
  const fixed = Math.abs(value).toFixed(0);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  return `${sign}${fixed.replace(/\B(?=(\d{3})+$)/g, ",")}`;
}

export function RadialProgress(props: RadialProgressProps) {
  let root: HTMLDivElement | undefined;
  let arc: SVGCircleElement | undefined;
  let visual: HTMLSpanElement | undefined;
  let observer: IntersectionObserver | undefined;
  let arcControls: ReturnType<typeof animate> | undefined;
  let countControls: ReturnType<typeof animate> | undefined;
  const gradientId = `radial-${createUniqueId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [seen, setSeen] = createSignal(!(props.inView ?? true));
  const countState = { value: props.from ?? 0 };
  const progress = { p: 0 };

  const size = () => props.size ?? 148;
  const strokeWidth = () => props.strokeWidth ?? 10;
  const safe = createMemo(() => clamp(props.value, 0, 100));
  const radius = () => (size() - strokeWidth()) / 2;
  const center = () => size() / 2;
  const tickCount = () => Math.max(4, Math.round(props.ticks ?? 48));

  const ticks = createMemo(() => {
    if (props.showTicks === false) return [];
    return Array.from({ length: tickCount() }, (_, index) => {
      const angle = (index / tickCount()) * 360;
      const major = index % 6 === 0;
      const active = (index / tickCount()) * 100 <= safe();
      const inner = radius() + strokeWidth() / 2 + 4;
      const outer = inner + (major ? 5 : 2.5);
      return { angle, major, active, inner, outer };
    });
  });

  const writeCount = (value: number) => {
    if (visual) visual.textContent = formatNumber(value);
  };

  const circumference = () => 2 * Math.PI * radius();

  const applyArc = () => {
    if (!arc) return;
    const total = circumference();
    arc.style.strokeDasharray = `${total}`;
    arc.style.strokeDashoffset = `${total * (1 - progress.p)}`;
  };

  const drawArc = () => {
    arcControls?.stop?.();
    if (arc) arc.style.strokeDasharray = `${circumference()}`;
    if (!seen()) {
      progress.p = 0;
      applyArc();
      return;
    }
    if (reduce()) {
      progress.p = safe() / 100;
      applyArc();
      return;
    }
    arcControls = animate(
      progress,
      { p: safe() / 100 },
      {
        ...(props.transition ?? arcSpring),
        onUpdate: applyArc,
      } as Parameters<typeof animate>[2],
    );
  };

  const animateCount = () => {
    if (!seen()) return;
    countControls?.stop?.();
    if (reduce()) {
      countState.value = safe();
      writeCount(countState.value);
      return;
    }
    countControls = animate(
      countState,
      { value: safe() },
      {
        ...countSpring,
        onUpdate: () => writeCount(countState.value),
      } as Parameters<typeof animate>[2],
    );
  };

  const activate = () => {
    animateCount();
    drawArc();
  };

  onMount(() => {
    writeCount(countState.value);
    applyArc();
    if (!props.inView) {
      setSeen(true);
      activate();
      return;
    }
    if (!root) return;
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setSeen(true);
        activate();
        observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    observer.observe(root);
  });

  createEffect(
    on(
      () => props.value,
      () => {
        if (seen()) activate();
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => props.from,
      (value) => {
        countState.value = value ?? 0;
        writeCount(countState.value);
      },
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => [props.size, props.strokeWidth],
      () => queueMicrotask(drawArc),
      { defer: true },
    ),
  );

  onCleanup(() => {
    observer?.disconnect();
    arcControls?.stop?.();
    countControls?.stop?.();
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="radial-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safe())}
      aria-label={props.label ?? "Progress"}
      class={`relative inline-flex items-center justify-center ${props.class ?? ""}`}
      style={{ width: `${size()}px`, height: `${size()}px` }}
    >
      <svg
        width={size()}
        height={size()}
        viewBox={`0 0 ${size()} ${size()}`}
        class="-rotate-90"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color={props.color ?? "currentColor"} stop-opacity="0.55" />
            <stop offset="100%" stop-color={props.color ?? "currentColor"} stop-opacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx={center()}
          cy={center()}
          r={radius()}
          fill="none"
          stroke={props.trackColor ?? "currentColor"}
          stroke-opacity="0.12"
          stroke-width={strokeWidth()}
          stroke-linecap="round"
        />
        <circle
          ref={(node: SVGCircleElement) => (arc = node)}
          cx={center()}
          cy={center()}
          r={radius()}
          fill="none"
          stroke={`url(#${gradientId})`}
          stroke-width={strokeWidth()}
          stroke-linecap="round"
          stroke-dasharray="0 9999"
        />
        <Show when={props.showTicks !== false}>
          <For each={ticks()}>
            {(tick) => (
              <line
                x1={center()}
                y1={center() - tick.inner}
                x2={center()}
                y2={center() - tick.outer}
                stroke={props.color ?? "currentColor"}
                stroke-opacity={tick.active ? 0.5 : 0.14}
                stroke-width={tick.major ? 1.4 : 1}
                stroke-linecap="round"
                transform={`rotate(${tick.angle} ${center()} ${center()})`}
              />
            )}
          </For>
        </Show>
      </svg>
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
        <span
          ref={(node: HTMLSpanElement) => (visual = node)}
          aria-hidden="true"
          class="inline-block font-medium leading-none tracking-[-0.04em] tabular-nums"
          style={{ "font-size": `${Math.max(22, Math.round(size() * 0.25))}px` }}
        />
        <span class="sr-only">{formatNumber(safe())}</span>
        <Show when={props.showLabel !== false}>
          <span class="text-[13px] leading-4 text-muted-foreground">
            {props.label ?? "complete"}
          </span>
        </Show>
      </div>
    </div>
  );
}
