<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  speed: { type: Number, default: 1 },
  paused: { type: Boolean, default: false },
  rings: { type: Number, default: 34 },
  particles: { type: Number, default: 80 },
  strokeColor: { type: String, default: "255,255,255" },
});

const root = ref(null);
const canvasRef = ref(null);
const inView = ref(false);
const pageVisible = ref(true);
const reduceMotion = ref(false);

const items = [];
let time = 0;
let last = 0;
let frame = 0;
let observer;
let observerSize;
let media;
let onVisibility;
let onMedia;

const rate = () => Math.max(0.1, props.speed);
const playing = () =>
  inView.value && pageVisible.value && !reduceMotion.value && !props.paused;

function seeded(index, salt = 1) {
  const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function spawn(width, height) {
  return {
    x:
      width / 2 +
      (seeded(items.length + Math.random() * 100, 1.3) - 0.5) * width * 0.42,
    y: height * (0.2 + Math.random() * 0.8),
    vy: 0.35 + Math.random() * 1.1,
    size: 0.7 + seeded(Math.random() * 100, 2.7) * 2.2,
    alpha: 0.2 + Math.random() * 0.7,
  };
}

function draw(at) {
  const canvas = canvasRef.value;
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
  const count = Math.max(6, props.rings);
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
    ctx.strokeStyle = `rgba(${props.strokeColor},${0.03 + scale * 0.32})`;
    ctx.lineWidth = 1 + scale * 0.7;
    ctx.stroke();
  }

  if (items.length === 0) {
    for (let index = 0; index < props.particles; index++) {
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
    ctx.fillStyle = `rgba(${props.strokeColor},${Math.max(0, particle.alpha * fade)})`;
    ctx.fill();
  }

  ctx.fillStyle = "rgba(255,255,255,0.018)";
  for (let line = 0; line < height; line += 3) {
    ctx.fillRect(0, line, width, 1);
  }
}

function resize() {
  const container = root.value;
  const canvas = canvasRef.value;
  if (!container || !canvas) return;
  const rect = container.getBoundingClientRect();
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
  draw(reduceMotion.value ? 8000 : time);
}

function tick(now) {
  time += Math.min(64, now - last);
  last = now;
  draw(time);
  frame = requestAnimationFrame(tick);
}

function start() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (!playing()) {
    draw(reduceMotion.value ? 8000 : time);
    return;
  }
  last = performance.now();
  frame = requestAnimationFrame(tick);
}

watch(
  () => [inView.value, pageVisible.value, reduceMotion.value, props.paused],
  start,
);
watch(
  () => [props.speed, props.rings, props.particles, props.strokeColor],
  () => {
    if (playing()) start();
    else draw(reduceMotion.value ? 8000 : time);
  },
);

onMounted(() => {
  media = window.matchMedia("(prefers-reduced-motion: reduce)");
  reduceMotion.value = media.matches;
  onMedia = () => {
    reduceMotion.value = media.matches;
  };
  media.addEventListener?.("change", onMedia);

  pageVisible.value = document.visibilityState !== "hidden";
  onVisibility = () => {
    pageVisible.value = document.visibilityState !== "hidden";
  };
  document.addEventListener("visibilitychange", onVisibility);

  observer = new IntersectionObserver(
    (entries) => {
      inView.value = entries.some((entry) => entry.isIntersecting);
    },
    { threshold: 0 },
  );
  if (root.value) observer.observe(root.value);

  observerSize = new ResizeObserver(resize);
  if (root.value) observerSize.observe(root.value);
  window.addEventListener("resize", resize);
  resize();
  start();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  observerSize?.disconnect();
  window.removeEventListener("resize", resize);
  if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
  media?.removeEventListener?.("change", onMedia);
});
</script>

<template>
  <div
    ref="root"
    data-slot="hole-background"
    class="relative size-full overflow-hidden bg-[#040408]"
  >
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    />
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_72%,rgba(168,85,247,0.20),transparent_60%)] mix-blend-overlay"
    />
    <slot />
  </div>
</template>
