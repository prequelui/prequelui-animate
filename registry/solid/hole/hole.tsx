import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

type Particle = { x: number; y: number; vy: number; size: number; alpha: number };

export type HoleProps = {
  speed?: number;
  paused?: boolean;
  rings?: number;
  particles?: number;
  strokeColor?: string;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

function seeded(index: number, salt = 1) {
  const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

export function Hole(props: HoleProps) {
  let root: HTMLDivElement | undefined;
  let canvas: HTMLCanvasElement | undefined;

  const [inView, setInView] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [reduce, setReduce] = createSignal(false);

  const rate = createMemo(() => Math.max(0.1, props.speed ?? 1));
  const playing = createMemo(
    () => inView() && pageVisible() && !reduce() && !(props.paused ?? false),
  );

  const items: Particle[] = [];
  let time = 0;
  let last = 0;
  let frame = 0;
  let observer: IntersectionObserver | undefined;
  let sizeObserver: ResizeObserver | undefined;

  const spawn = (width: number, height: number): Particle => ({
    x:
      width / 2 +
      (seeded(items.length + Math.random() * 100, 1.3) - 0.5) * width * 0.42,
    y: height * (0.2 + Math.random() * 0.8),
    vy: 0.35 + Math.random() * 1.1,
    size: 0.7 + seeded(Math.random() * 100, 2.7) * 2.2,
    alpha: 0.2 + Math.random() * 0.7,
  });

  const draw = (at: number) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = canvas.width / Math.max(1, canvas.getBoundingClientRect().width);
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    if (width < 2 || height < 2) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(dpr, dpr);

    const background = ctx.createRadialGradient(
      width / 2,
      height * 0.42,
      0,
      width / 2,
      height * 0.42,
      Math.max(width, height) * 0.8,
    );
    background.addColorStop(0, "#14121f");
    background.addColorStop(0.55, "#0a0912");
    background.addColorStop(1, "#040408");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    const glow = ctx.createLinearGradient(0, height * 0.1, 0, height);
    glow.addColorStop(0, "rgba(34,211,238,0)");
    glow.addColorStop(0.35, "rgba(34,211,238,0.18)");
    glow.addColorStop(0.62, "rgba(244,114,182,0.16)");
    glow.addColorStop(1, "rgba(245,158,11,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(width * 0.36, height * 0.08, width * 0.28, height * 0.92);

    const phase = (at * 0.000045 * rate()) % 1;
    const count = Math.max(6, props.rings ?? 34);
    for (let index = 0; index < count; index++) {
      const local = (index / count + phase) % 1;
      const scale = 1 - local;
      const cx = width / 2;
      const cy = height * 0.44 + local * height * 0.54;
      const rx = width * 0.74 * scale;
      const ry = height * 0.66 * scale;
      if (rx <= 0.5 || ry <= 0.5) continue;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${props.strokeColor ?? "255,255,255"},${0.03 + scale * 0.32})`;
      ctx.lineWidth = 1 + scale * 0.7;
      ctx.stroke();
    }

    if (items.length === 0) {
      const particleCount = props.particles ?? 80;
      for (let index = 0; index < particleCount; index++) {
        items.push(spawn(width, height));
      }
    }
    for (const particle of items) {
      particle.y -= particle.vy * rate();
      if (particle.y < -4) {
        Object.assign(particle, spawn(width, height), { y: height + 4 });
      }
      const fade = Math.sin((particle.y / height) * Math.PI);
      ctx.beginPath();
      ctx.rect(particle.x, particle.y, particle.size, particle.size);
      ctx.fillStyle = `rgba(${props.strokeColor ?? "255,255,255"},${Math.max(0, particle.alpha * fade)})`;
      ctx.fill();
    }

    ctx.fillStyle = "rgba(255,255,255,0.018)";
    for (let line = 0; line < height; line += 3) {
      ctx.fillRect(0, line, width, 1);
    }
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
    items.length = 0;
    draw(reduce() ? 8000 : time);
  };

  const tick = (now: number) => {
    time += Math.min(64, now - last);
    last = now;
    draw(time);
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!playing()) {
      draw(reduce() ? 8000 : time);
      return;
    }
    last = performance.now();
    frame = requestAnimationFrame(tick);
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
    rate();
    props.rings;
    props.particles;
    props.strokeColor;
    start();
  });

  return (
    <div
      ref={root}
      data-slot="hole-background"
      class={`relative size-full overflow-hidden bg-[#040408] ${props.class ?? ""}`}
      style={props.style}
    >
      <canvas
        ref={canvas}
        aria-hidden="true"
        class="pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_72%,rgba(168,85,247,0.20),transparent_60%)] mix-blend-overlay"
      />
      {props.children}
    </div>
  );
}
