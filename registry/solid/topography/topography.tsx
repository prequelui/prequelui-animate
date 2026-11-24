import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

const CELL = 14;

type Ripple = { x: number; y: number; start: number };

function contour(
  path: Path2D,
  x: number,
  y: number,
  size: number,
  a: number,
  b: number,
  c: number,
  d: number,
  level: number,
) {
  const top = () => [x + ((level - a) / (b - a)) * size, y] as const;
  const right = () => [x + size, y + ((level - b) / (c - b)) * size] as const;
  const bottom = () => [x + ((level - d) / (c - d)) * size, y + size] as const;
  const left = () => [x, y + ((level - a) / (d - a)) * size] as const;
  const line = (p: readonly [number, number], q: readonly [number, number]) => {
    path.moveTo(p[0], p[1]);
    path.lineTo(q[0], q[1]);
  };

  const code =
    (a > level ? 8 : 0) | (b > level ? 4 : 0) | (c > level ? 2 : 0) | (d > level ? 1 : 0);
  switch (code) {
    case 0:
    case 15:
      return;
    case 1:
    case 14:
      line(left(), bottom());
      return;
    case 2:
    case 13:
      line(bottom(), right());
      return;
    case 3:
    case 12:
      line(left(), right());
      return;
    case 4:
    case 11:
      line(top(), right());
      return;
    case 6:
    case 9:
      line(top(), bottom());
      return;
    case 7:
    case 8:
      line(left(), top());
      return;
    default: {
      const center = (a + b + c + d) / 4;
      if ((code === 5) === center > level) {
        line(left(), top());
        line(bottom(), right());
      } else {
        line(left(), bottom());
        line(top(), right());
      }
    }
  }
}

export type TopographyProps = {
  speed?: number;
  paused?: boolean;
  levels?: number;
  scale?: number;
  peak?: number;
  interactive?: boolean;
  lineColor?: string;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function Topography(props: TopographyProps) {
  let root: HTMLDivElement | undefined;
  let canvas: HTMLCanvasElement | undefined;

  const [inView, setInView] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [reduce, setReduce] = createSignal(false);

  const playing = createMemo(
    () => inView() && pageVisible() && !reduce() && !(props.paused ?? false),
  );

  const ripples: Ripple[] = [];
  const pointer = {
    x: 0,
    y: 0,
    hx: 0,
    hy: 0,
    raised: 0,
    raisedTarget: 0,
    placed: false,
  };
  let time = 0;
  let last = 0;
  let waited = 0;
  let frame = 0;
  let observer: IntersectionObserver | undefined;
  let sizeObserver: ResizeObserver | undefined;

  const draw = (at: number) => {
    if (!canvas || !root) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width < 2 || height < 2) return;
    const dpr = canvas.width / Math.max(1, width);
    const cols = Math.ceil(width / CELL) + 1;
    const rows = Math.ceil(height / CELL) + 1;
    const field = new Float32Array(cols * rows);
    const feature = 170 * Math.max(0.2, props.scale ?? 1);
    const tz = at * 0.00008 * Math.max(0.1, props.speed ?? 1);

    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < cols; column++) {
        const x = column * CELL;
        const y = row * CELL;
        const nx = x / feature;
        const ny = y / feature;
        let value =
          Math.sin(nx * 1.7 + tz) * 0.55 +
          Math.sin(ny * 2.1 - tz * 0.8) * 0.45 +
          Math.sin((nx + ny) * 1.15 + tz * 0.55) * 0.3 +
          Math.sin(nx * 3.1 - ny * 2.3 + tz * 1.3) * 0.18;
        value /= 1.48;
        if (pointer.raised > 0.001) {
          const distance = Math.hypot(x - pointer.hx, y - pointer.hy);
          value += pointer.raised * (props.peak ?? 1) * 0.9 * Math.exp(-distance / 100);
        }
        for (const ripple of ripples) {
          const progress = Math.min(1, Math.max(0, (at - ripple.start) / 2600));
          const reach = Math.hypot(width, height) * 0.8;
          const distance = Math.hypot(x - ripple.x, y - ripple.y) - progress * reach;
          value +=
            0.75 *
            (1 - progress) *
            Math.cos((distance / 58) * 1.8) *
            Math.exp(-(distance * distance) / (2 * 58 * 58));
        }
        field[row * cols + column] = value;
      }
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    const color =
      props.lineColor ??
      getComputedStyle(root).color ??
      (document.documentElement.classList.contains("dark") ? "#e5e5e5" : "#1c1c1c");
    const count = Math.max(4, Math.round(props.levels ?? 14));
    const step = 1.8 / count;
    const minor = new Path2D();
    const major = new Path2D();

    for (let levelIndex = -count; levelIndex <= count; levelIndex++) {
      const level = levelIndex * step;
      const path = levelIndex % 5 === 0 ? major : minor;
      for (let row = 0; row < rows - 1; row++) {
        for (let column = 0; column < cols - 1; column++) {
          const a = field[row * cols + column] as number;
          const b = field[row * cols + column + 1] as number;
          const c = field[(row + 1) * cols + column + 1] as number;
          const d = field[(row + 1) * cols + column] as number;
          const lowest = Math.min(a, b, c, d);
          const highest = Math.max(a, b, c, d);
          if (level < lowest || level > highest) continue;
          contour(path, column * CELL, row * CELL, CELL, a, b, c, d, level);
        }
      }
    }

    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 1;
    ctx.stroke(minor);
    ctx.globalAlpha = 0.68;
    ctx.lineWidth = 1.4;
    ctx.stroke(major);
    ctx.globalAlpha = 1;
  };

  const resize = () => {
    if (!root || !canvas) return;
    const rect = root.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    draw(reduce() ? 0 : time);
  };

  const tick = (now: number) => {
    const delta = Math.min(64, now - last);
    last = now;
    waited += delta;
    if (waited >= 33) {
      time += waited;
      waited = 0;
      pointer.hx += (pointer.x - pointer.hx) * 0.12;
      pointer.hy += (pointer.y - pointer.hy) * 0.12;
      pointer.raised +=
        (((props.interactive ?? true) ? pointer.raisedTarget : 0) - pointer.raised) * 0.08;
      draw(time);
    }
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!playing()) {
      draw(reduce() ? 0 : time);
      return;
    }
    last = performance.now();
    waited = 0;
    frame = requestAnimationFrame(tick);
  };

  const point = (event: PointerEvent) => {
    const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!(props.interactive ?? true) || reduce()) return;
    const { x, y } = point(event);
    if (!pointer.placed) {
      pointer.hx = x;
      pointer.hy = y;
      pointer.placed = true;
    }
    pointer.x = x;
    pointer.y = y;
    pointer.raisedTarget = 1;
  };

  const onPointerLeave = () => {
    pointer.raisedTarget = 0;
  };

  const onPointerDown = (event: PointerEvent) => {
    if (!(props.interactive ?? true) || reduce()) return;
    const { x, y } = point(event);
    ripples.push({ x, y, start: time });
    if (ripples.length > 4) ripples.splice(0, ripples.length - 4);
  };

  onMount(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(media.matches);
    const onMedia = () => setReduce(media.matches);
    media.addEventListener?.("change", onMedia);

    setPageVisible(document.visibilityState !== "hidden");
    const onVisibility = () => setPageVisible(document.visibilityState !== "hidden");
    document.addEventListener("visibilitychange", onVisibility);

    observer = new IntersectionObserver(
      (entries) => setInView(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0 },
    );
    if (root) observer.observe(root);

    sizeObserver = new ResizeObserver(resize);
    if (root) sizeObserver.observe(root);
    window.addEventListener("resize", resize);
    resize();

    onCleanup(() => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      sizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      media.removeEventListener?.("change", onMedia);
    });
  });

  createEffect(() => {
    playing();
    props.speed;
    props.levels;
    props.scale;
    props.peak;
    props.lineColor;
    start();
  });

  return (
    <div
      ref={root}
      data-slot="topography-background"
      class={`relative size-full overflow-hidden bg-[#f5f2ec] text-[#1b1b1f] dark:bg-[#0b0b0f] dark:text-[#e8e6e1] ${props.class ?? ""}`}
      style={props.style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onPointerDown={onPointerDown}
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        class="pointer-events-none absolute inset-0"
      />
      {props.children}
    </div>
  );
}
