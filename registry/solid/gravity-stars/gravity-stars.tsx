import { createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import type { JSX } from "solid-js";

type Star = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  glow: number;
};

export type GravityStarsProps = {
  speed?: number;
  paused?: boolean;
  starsCount?: number;
  starsSize?: number;
  starsOpacity?: number;
  mouseInfluence?: number;
  gravityStrength?: number;
  gravity?: "attract" | "repel";
  glowIntensity?: number;
  interactive?: boolean;
  starColor?: string;
  class?: string;
  style?: JSX.CSSProperties;
  children?: JSX.Element;
};

export function GravityStars(props: GravityStarsProps) {
  let root: HTMLDivElement | undefined;
  let canvas: HTMLCanvasElement | undefined;

  const [inView, setInView] = createSignal(false);
  const [pageVisible, setPageVisible] = createSignal(true);
  const [reduce, setReduce] = createSignal(false);

  const rate = createMemo(() => Math.max(0.1, props.speed ?? 1));
  const playing = createMemo(
    () => inView() && pageVisible() && !reduce() && !(props.paused ?? false),
  );

  const stars: Star[] = [];
  const mouse = { x: -9999, y: -9999 };
  let frame = 0;
  let observer: IntersectionObserver | undefined;
  let sizeObserver: ResizeObserver | undefined;

  const create = (width: number, height: number): Star => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = (0.16 + Math.random() * 0.4) * rate();
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: 1 + Math.random() * (props.starsSize ?? 2),
      opacity: props.starsOpacity ?? 0.75,
      glow: 1,
    };
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
    const starColor = props.starColor ?? "#f8fafc";
    const glowIntensity = props.glowIntensity ?? 14;
    ctx.fillStyle = starColor;
    ctx.shadowColor = starColor;
    let blur = -1;
    for (const star of stars) {
      const next = glowIntensity * star.glow * 2;
      if (Math.abs(next - blur) > 1) {
        ctx.shadowBlur = next;
        blur = next;
      }
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
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
    if (stars.length === 0) {
      const bounds = canvas.getBoundingClientRect();
      const count = props.starsCount ?? 80;
      for (let index = 0; index < count; index++) {
        stars.push(create(bounds.width, bounds.height));
      }
    }
    draw();
  };

  const recreate = () => {
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    const count = props.starsCount ?? 80;
    stars.length = 0;
    for (let index = 0; index < count; index++) {
      stars.push(create(bounds.width, bounds.height));
    }
    draw();
  };

  const tick = () => {
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const currentRate = rate();
    const influence = props.mouseInfluence ?? 110;
    const strength = props.gravityStrength ?? 80;
    const starsOpacity = props.starsOpacity ?? 0.75;
    for (const star of stars) {
      const dx = mouse.x - star.x;
      const dy = mouse.y - star.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < influence) {
        const force = (influence - distance) / influence;
        const push = (force * strength * 0.0012) / currentRate;
        const direction = (props.gravity ?? "attract") === "attract" ? 1 : -1;
        star.vx += (dx / distance) * push * direction;
        star.vy += (dy / distance) * push * direction;
        star.opacity = Math.min(1, starsOpacity + force * 0.4);
        star.glow = 1 + force * 2;
      } else {
        star.opacity = Math.max(starsOpacity * 0.3, star.opacity - 0.02);
        star.glow = Math.max(1, star.glow - 0.06);
      }
      star.x += star.vx * currentRate;
      star.y += star.vy * currentRate;
      star.vx += (Math.random() - 0.5) * 0.0015;
      star.vy += (Math.random() - 0.5) * 0.0015;
      star.vx *= 0.999;
      star.vy *= 0.999;
      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;
    }
    draw();
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!playing()) {
      draw();
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!(props.interactive ?? true) || !root) return;
    const rect = root.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  };

  const onPointerLeave = () => {
    mouse.x = -9999;
    mouse.y = -9999;
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
    props.starsCount;
    if (!canvas || canvas.width < 2) return;
    if (stars.length !== (props.starsCount ?? 80)) recreate();
    start();
  });

  return (
    <div
      ref={root}
      data-slot="gravity-stars-background"
      class={`relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#191826_0%,#06060b_72%)] ${props.class ?? ""}`}
      style={props.style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
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
