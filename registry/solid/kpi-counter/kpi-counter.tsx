import {
  Show,
  createEffect,
  createMemo,
  createSignal,
  createUniqueId,
  on,
  onCleanup,
  onMount,
} from "solid-js";
import type { Accessor } from "solid-js";
import { animate } from "motion";

type Geometry = { line: string; area: string };

export type KpiCounterProps = {
  label: string;
  value: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  deltaSuffix?: string;
  points?: number[];
  inView?: boolean;
  hint?: string;
  class?: string;
};

type Point = { x: number; y: number };

const width = 240;
const height = 62;
const countSpring = {
  type: "spring" as const,
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};
const defaultPoints = [18, 24, 21, 32, 29, 36, 34, 44, 48, 46, 57, 62];

function smoothPath(points: Point[]) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Arrow(props: { up: boolean }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" class="size-3">
      <path
        d={props.up ? "M3 9 9 3M4.4 3H9v4.6" : "M3 3l6 6M4.4 9H9V4.4"}
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}

export function KpiCounter(props: KpiCounterProps) {
  let root: HTMLDivElement | undefined;
  let visual: HTMLSpanElement | undefined;
  let linePath: SVGPathElement | undefined;
  let areaPath: SVGPathElement | undefined;
  let deltaEl: HTMLSpanElement | undefined;
  let observer: IntersectionObserver | undefined;
  let countControls: ReturnType<typeof animate> | undefined;
  let sparkControls: Array<ReturnType<typeof animate>> = [];
  const gradientId = `kpi-${createUniqueId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [seen, setSeen] = createSignal(!(props.inView ?? true));
  const counter = { value: props.from ?? 0 };

  const up = () => (props.delta ?? 0) >= 0;

  const geometry = createMemo<Geometry | null>(() => {
    const points = props.points ?? defaultPoints;
    if (points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const span = max - min || 1;
    const coords = points.map((point, index) => ({
      x: (index / (points.length - 1)) * width,
      y: height - 6 - ((point - min) / span) * (height - 14),
    }));
    return { line: smoothPath(coords), area: `${smoothPath(coords)} L ${width} ${height} L 0 ${height} Z` };
  });

  const formatNumber = (value: number) => {
    const decimals = props.decimals ?? 0;
    const fixed = Math.abs(value).toFixed(decimals);
    const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
    const [integer = "0", fraction] = fixed.split(".");
    const grouped = integer.replace(/\B(?=(\d{3})+$)/g, ",");
    return fraction ? `${sign}${grouped}.${fraction}` : `${sign}${grouped}`;
  };

  const writeCount = (value: number) => {
    if (visual) visual.textContent = formatNumber(value);
  };

  const animateCount = () => {
    if (!seen()) return;
    countControls?.stop?.();
    if (reduce()) {
      counter.value = props.value;
      writeCount(counter.value);
      return;
    }
    countControls = animate(
      counter,
      { value: props.value },
      {
        ...countSpring,
        onUpdate: () => writeCount(counter.value),
      } as Parameters<typeof animate>[2],
    );
  };

  const drawSparkline = () => {
    sparkControls.forEach((control) => control?.stop?.());
    sparkControls = [];
    const line = linePath;
    if (!line) return;
    const length = line.getTotalLength();
    line.style.strokeDasharray = `${length}`;
    line.style.strokeDashoffset = `${length}`;
    if (areaPath) areaPath.style.opacity = "0";
    if (!seen()) return;

    if (areaPath) {
      sparkControls.push(
        animate(
          areaPath,
          { opacity: [0, 1] },
          { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
        ),
      );
    }
    sparkControls.push(
      animate(
        line,
        { strokeDashoffset: [length, 0] },
        reduce() ? { duration: 0 } : { duration: 0.9, ease: [0.33, 0, 0.2, 1] },
      ),
    );
  };

  const animateDelta = () => {
    if (!deltaEl) return;
    if (reduce()) {
      deltaEl.style.opacity = "1";
      deltaEl.style.transform = "none";
      return;
    }
    animate(deltaEl, { opacity: [0, 1], y: [4, 0] }, {
      duration: 0.3,
      ease: [0.23, 1, 0.32, 1],
      delay: 0.15,
    });
  };

  const activate = () => {
    animateCount();
    drawSparkline();
  };

  onMount(() => {
    writeCount(counter.value);
    if (!props.inView) {
      setSeen(true);
      activate();
    } else if (root) {
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
      drawSparkline();
    }
    animateDelta();
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
      () => props.points,
      () => queueMicrotask(drawSparkline),
      { defer: true },
    ),
  );

  createEffect(
    on(
      () => props.decimals,
      () => writeCount(counter.value),
      { defer: true },
    ),
  );

  onCleanup(() => {
    observer?.disconnect();
    countControls?.stop?.();
    sparkControls.forEach((control) => control?.stop?.());
  });

  return (
    <div
      ref={(node: HTMLDivElement) => (root = node)}
      data-slot="kpi-counter"
      class={`flex w-full max-w-[300px] flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground ${props.class ?? ""}`}
    >
      <div class="flex items-start justify-between gap-3">
        <div class="flex min-w-0 flex-col gap-1">
          <span class="truncate text-[13px] leading-4 text-muted-foreground">
            {props.label}
          </span>
          <span class="flex items-baseline gap-0.5 text-[32px] font-medium leading-none tracking-[-0.03em]">
            <Show when={props.prefix}>
              <span class="text-[20px] text-muted-foreground">{props.prefix}</span>
            </Show>
            <span
              ref={(node: HTMLSpanElement) => (visual = node)}
              aria-hidden="true"
              class="inline-block tabular-nums"
            />
            <span class="sr-only">
              {formatNumber(props.value)}
            </span>
            <Show when={props.suffix}>
              <span class="text-[15px] font-normal text-muted-foreground">
                {props.suffix}
              </span>
            </Show>
          </span>
        </div>
        <Show when={props.delta !== undefined}>
          <span
            ref={(node: HTMLSpanElement) => (deltaEl = node)}
            aria-hidden="true"
            class="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium tabular-nums"
            classList={{
              "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400": up(),
              "bg-rose-500/12 text-rose-600 dark:text-rose-400": !up(),
            }}
            style="opacity:0;transform:translateY(4px)"
          >
            <Arrow up={up()} />
            {Math.abs(props.delta ?? 0)}
            {props.deltaSuffix ?? "%"}
          </span>
        </Show>
      </div>

      <Show when={geometry()}>
        {(shape: Accessor<Geometry>) => (
          <div class="relative">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              preserveAspectRatio="none"
              class="h-[62px] w-full overflow-visible"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="currentColor" stop-opacity="0.26" />
                  <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
                </linearGradient>
              </defs>
              <path
                ref={(node: SVGPathElement) => (areaPath = node)}
                d={shape().area}
                fill={`url(#${gradientId})`}
                stroke="none"
                style="opacity:0"
              />
              <path
                ref={(node: SVGPathElement) => (linePath = node)}
                d={shape().line}
                fill="none"
                stroke="currentColor"
                stroke-dasharray="0 9999"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        )}
      </Show>

      <Show when={props.hint}>
        <p class="text-[13px] leading-4 text-muted-foreground">{props.hint}</p>
      </Show>
    </div>
  );
}
