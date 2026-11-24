<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const GLYPHS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·+-*/<>[]{}";

const props = defineProps({
  speed: { type: Number, default: 1 },
  paused: { type: Boolean, default: false },
  interactive: { type: Boolean, default: true },
  fontSize: { type: Number, default: 11 },
  glowColor: { type: String, default: undefined },
  shapeColor: { type: String, default: undefined },
});

const root = ref(null);
const canvasRef = ref(null);
const inView = ref(false);
const pageVisible = ref(true);
const reduceMotion = ref(false);

let trail = [];
let waves = [];
let time = 0;
let last = 0;
let waited = 0;
let frame = 0;
let observer;
let observerSize;
let media;
let onVisibility;
let onMedia;
let playing = false;

function seeded(index, salt = 1) {
  const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function refreshPlaying() {
  playing =
    inView.value && pageVisible.value && !reduceMotion.value && !props.paused;
}

function draw(at) {
  const canvas = canvasRef.value;
  const container = root.value;
  if (!canvas || !container) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  if (width < 2 || height < 2) return;
  const dpr = canvas.width / Math.max(1, width);
  const size = props.fontSize;
  const cellHeight = size * 1.35;
  const cellWidth = size * 0.72;
  const columns = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const computed = getComputedStyle(container).color || "#e5e5e5";
  const base = props.glowColor ?? computed;
  const accent = props.shapeColor ?? "rgb(34 211 238)";
  const epoch = Math.floor(at / 720);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.font = `${size}px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const brightness = (x, y) => {
    let value = 0.055;
    for (const point of trail) {
      const age = (at - point.at) / 700;
      if (age < 0 || age > 1) continue;
      const dx = x - point.x;
      const dy = y - point.y;
      value +=
        0.55 *
        (1 - age) *
        (1 - age) *
        Math.exp(-(dx * dx + dy * dy) / 3200);
    }
    for (const wave of waves) {
      const age = (at - wave.at) / 4000;
      if (age < 0 || age > 1) continue;
      const radius = (560 * age) / (1 + 0.66 * age);
      const distance = Math.hypot(x - wave.x, y - wave.y) - radius;
      value +=
        Math.exp(-(distance * distance) / 180) *
        Math.exp(-Math.max(0, age - 0.35) / 1.2) *
        wave.strength;
    }
    return Math.min(1, value);
  };

  const passes = [
    { from: 0.05, to: 0.12, color: base, alpha: 0.09 },
    { from: 0.12, to: 0.3, color: base, alpha: 0.22 },
    { from: 0.3, to: 0.62, color: base, alpha: 0.48 },
    { from: 0.62, to: 1.01, color: accent, alpha: 0.8 },
  ];

  for (const pass of passes) {
    ctx.globalAlpha = pass.alpha;
    ctx.fillStyle = pass.color;
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const x = column * cellWidth;
        const y = row * cellHeight;
        const value = brightness(x + cellWidth / 2, y + cellHeight / 2);
        if (value < pass.from || value >= pass.to) continue;
        const index = row * columns + column;
        const glyph =
          GLYPHS[Math.floor(seeded(index + epoch * 977, 1.3) * GLYPHS.length)] ??
          "·";
        ctx.fillText(glyph, x + cellWidth / 2, y + cellHeight / 2);
      }
    }
  }
  ctx.globalAlpha = 1;
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
  draw(reduceMotion.value ? 0 : time);
}

function tick(now) {
  const delta = Math.min(64, now - last);
  last = now;
  waited += delta;
  if (waited >= 33) {
    time += waited;
    waited = 0;
    trail = trail.filter((point) => time - point.at < 700);
    draw(time);
  }
  frame = requestAnimationFrame(tick);
}

function start() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (!playing) {
    draw(reduceMotion.value ? 0 : time);
    return;
  }
  last = performance.now();
  waited = 0;
  frame = requestAnimationFrame(tick);
}

function point(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  return { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function onPointerMove(event) {
  if (!props.interactive || reduceMotion.value) return;
  const { x, y } = point(event);
  const previous = trail[trail.length - 1];
  if (previous && Math.hypot(x - previous.x, y - previous.y) < 16) return;
  trail = [...trail.slice(-11), { x, y, at: time }];
}

function onPointerDown(event) {
  if (!props.interactive || reduceMotion.value) return;
  const { x, y } = point(event);
  waves = [
    ...waves.slice(-5),
    { x, y, at: time + 80, strength: 0.55 },
    { x, y, at: time, strength: 1 },
  ];
}

watch(
  () => [inView.value, pageVisible.value, reduceMotion.value, props.paused],
  () => {
    refreshPlaying();
    start();
  },
);

watch(
  () => [props.fontSize, props.glowColor, props.shapeColor, props.speed],
  () => {
    if (playing) start();
    else draw(reduceMotion.value ? 0 : time);
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
  refreshPlaying();
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
    data-slot="glyph-background"
    class="relative size-full overflow-hidden bg-[#f6f4ef] text-[#232227] dark:bg-[#08080c] dark:text-[#e9e7e2]"
    @pointermove="onPointerMove"
    @pointerdown="onPointerDown"
  >
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_88%)]"
    />
    <slot />
  </div>
</template>
