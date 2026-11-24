import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  size: number;
  color: string;
};

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  target: number;
  color: string;
  size: number;
  trail: Array<{ x: number; y: number }>;
};

const PALETTE = ["#f97316", "#f43f5e", "#a855f7", "#22d3ee", "#facc15", "#34d399"];

export type FireworksProps = {
  speed?: number;
  paused?: boolean;
  interactive?: boolean;
  population?: number;
  colors?: string[];
  particleCount?: number;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function Fireworks(props: FireworksProps) {
  let root: HTMLDivElement | undefined;
  let canvas: HTMLCanvasElement | undefined;

  const [inView, setInView] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [reduce, setReduce] = createSignal(false);

  const rate = createMemo(() => Math.max(0.1, props.speed ?? 1));
  const palette = createMemo(() =>
    Array.isArray(props.colors) && props.colors.length ? props.colors : PALETTE,
  );
  const playing = createMemo(
    () => inView() && pageVisible() && !reduce() && !(props.paused ?? false),
  );

  const rockets: Rocket[] = [];
  const sparks: Spark[] = [];

  let frame = 0;
  let nextLaunch = 0;
  let last = 0;
  let observer: IntersectionObserver | undefined;
  let sizeObserver: ResizeObserver | undefined;

  const explode = (x: number, y: number, color: string) => {
    const currentRate = rate();
    const particleCount = props.particleCount ?? 64;
    const count = Math.round(
      particleCount * Math.min(1.6, Math.max(0.4, currentRate)),
    );
    for (let index = 0; index < count; index++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 0.9 + Math.random() * 4.4;
      sparks.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 1,
        decay: 0.005 + Math.random() * 0.01,
        size: 1.2 + Math.random() * 2.8,
        color,
      });
    }
  };

  const launch = (x: number, target: number, color?: string) => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const options = palette();
    rockets.push({
      x,
      y: rect.height * 1.02,
      vx: (Math.random() - 0.5) * 0.7,
      vy: -(3.4 + Math.random() * 2.2) * rate(),
      target,
      color: color ?? options[Math.floor(Math.random() * options.length)] ?? PALETTE[0],
      size: 1.8 + Math.random() * 1.8,
      trail: [],
    });
  };

  const draw = () => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width < 2 || height < 2) return;
    const dpr = canvas.width / Math.max(1, width);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const background = ctx.createRadialGradient(
      width / 2,
      height * 0.8,
      0,
      width / 2,
      height * 0.8,
      Math.max(width, height) * 0.8,
    );
    background.addColorStop(0, "#10101c");
    background.addColorStop(1, "#040408");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    ctx.globalCompositeOperation = "lighter";
    for (const rocket of rockets) {
      if (rocket.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(rocket.trail[0]!.x, rocket.trail[0]!.y);
        for (const point of rocket.trail) ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = rocket.size;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      }
    }
    for (const spark of sparks) {
      ctx.globalAlpha = Math.max(0, spark.alpha);
      ctx.fillStyle = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  };

  const staticFrame = () => {
    if (!canvas) return;
    sparks.length = 0;
    rockets.length = 0;
    const rect = canvas.getBoundingClientRect();
    const spots = [0.3, 0.5, 0.72];
    const options = palette();
    for (const spot of spots) {
      explode(
        rect.width * spot,
        rect.height * (0.3 + Math.random() * 0.25),
        options[0] ?? PALETTE[0],
      );
    }
    for (let step = 0; step < 22; step++) {
      for (const spark of sparks) {
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vy += 0.05;
        spark.vx *= 0.985;
        spark.vy *= 0.985;
        spark.alpha *= 0.94;
      }
    }
    draw();
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
    if (reduce()) staticFrame();
    else draw();
  };

  const tick = (now: number) => {
    const delta = Math.min(64, now - last);
    last = now;
    if (!canvas) return;
    const currentRate = rate();
    const population = props.population ?? 1;
    const rect = canvas.getBoundingClientRect();
    if (now > nextLaunch) {
      if (population > 0 && Math.random() < population) {
        launch(
          rect.width * (0.12 + Math.random() * 0.76),
          rect.height * (0.12 + Math.random() * 0.3),
        );
      }
      nextLaunch = now + (260 + Math.random() * 520) / Math.max(0.2, population);
    }
    for (let index = rockets.length - 1; index >= 0; index--) {
      const rocket = rockets[index]!;
      rocket.trail.push({ x: rocket.x, y: rocket.y });
      if (rocket.trail.length > 18) rocket.trail.shift();
      rocket.x += rocket.vx * currentRate;
      rocket.y += rocket.vy * currentRate;
      rocket.vy += 0.028 * delta * 0.06;
      if (rocket.vy >= 0 || rocket.y <= rocket.target) {
        explode(rocket.x, rocket.y, rocket.color);
        rockets.splice(index, 1);
      }
    }
    for (let index = sparks.length - 1; index >= 0; index--) {
      const spark = sparks[index]!;
      spark.vx *= 0.985;
      spark.vy *= 0.985;
      spark.vy += 0.045;
      spark.x += spark.vx * currentRate;
      spark.y += spark.vy * currentRate;
      spark.alpha -= spark.decay;
      if (spark.alpha <= 0) sparks.splice(index, 1);
    }
    draw();
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!playing()) {
      if (reduce()) staticFrame();
      return;
    }
    last = performance.now();
    const first = canvas?.getBoundingClientRect();
    if (first) {
      const options = palette();
      explode(
        first.width * 0.5,
        first.height * 0.3,
        options[1] ?? options[0] ?? PALETTE[0],
      );
      nextLaunch = performance.now() + 260;
    }
    frame = requestAnimationFrame(tick);
  };

  const onClick = (event: MouseEvent) => {
    if (!(props.interactive ?? true) || !playing() || !root) return;
    const rect = root.getBoundingClientRect();
    launch(event.clientX - rect.left, event.clientY - rect.top);
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
    props.population;
    props.particleCount;
    props.colors;
    start();
  });

  return (
    <div
      ref={root}
      data-slot="fireworks-background"
      class={`relative size-full overflow-hidden bg-[#040408] ${props.class ?? ""}`}
      style={props.style}
      onClick={onClick}
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
