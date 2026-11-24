<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  speed: { type: Number, default: 1 },
  paused: { type: Boolean, default: false },
  starsCount: { type: Number, default: 80 },
  starsSize: { type: Number, default: 2 },
  starsOpacity: { type: Number, default: 0.75 },
  mouseInfluence: { type: Number, default: 110 },
  gravityStrength: { type: Number, default: 80 },
  gravity: { type: String, default: "attract" },
  glowIntensity: { type: Number, default: 14 },
  interactive: { type: Boolean, default: true },
  starColor: { type: String, default: "#f8fafc" },
});

const root = ref(null);
const canvasRef = ref(null);
const inView = ref(false);
const pageVisible = ref(true);
const reduceMotion = ref(false);

const stars = [];
const mouse = { x: -9999, y: -9999 };
let observer;
let observerSize;
let media;
let onVisibility;
let onMedia;
let frame = 0;

const rate = () => Math.max(0.1, props.speed);
const playing = () =>
  inView.value && pageVisible.value && !reduceMotion.value && !props.paused;

function create(width, height) {
  const angle = Math.random() * Math.PI * 2;
  const velocity = (0.16 + Math.random() * 0.4) * rate();
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * velocity,
    vy: Math.sin(angle) * velocity,
    size: 1 + Math.random() * props.starsSize,
    opacity: props.starsOpacity,
    glow: 1,
  };
}

function draw() {
  const canvas = canvasRef.value;
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
  ctx.fillStyle = props.starColor;
  ctx.shadowColor = props.starColor;
  let blur = -1;
  for (const star of stars) {
    const next = props.glowIntensity * star.glow * 2;
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
  if (stars.length === 0) {
    const bounds = canvas.getBoundingClientRect();
    for (let index = 0; index < props.starsCount; index++) {
      stars.push(create(bounds.width, bounds.height));
    }
  }
  if (reduceMotion.value) draw();
}

function recreate() {
  const bounds = canvasRef.value?.getBoundingClientRect();
  if (!bounds) return;
  stars.length = 0;
  for (let index = 0; index < props.starsCount; index++) {
    stars.push(create(bounds.width, bounds.height));
  }
  draw();
}

function tick() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  for (const star of stars) {
    const dx = mouse.x - star.x;
    const dy = mouse.y - star.y;
    const distance = Math.hypot(dx, dy);
    if (distance > 0 && distance < props.mouseInfluence) {
      const force = (props.mouseInfluence - distance) / props.mouseInfluence;
      const push = (force * props.gravityStrength * 0.0012) / rate();
      const direction = props.gravity === "attract" ? 1 : -1;
      star.vx += (dx / distance) * push * direction;
      star.vy += (dy / distance) * push * direction;
      star.opacity = Math.min(1, props.starsOpacity + force * 0.4);
      star.glow = 1 + force * 2;
    } else {
      star.opacity = Math.max(props.starsOpacity * 0.3, star.opacity - 0.02);
      star.glow = Math.max(1, star.glow - 0.06);
    }
    star.x += star.vx * rate();
    star.y += star.vy * rate();
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
}

function start() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (!playing()) {
    draw();
    return;
  }
  frame = requestAnimationFrame(tick);
}

function onPointerMove(event) {
  if (!props.interactive) return;
  const rect = event.currentTarget.getBoundingClientRect();
  mouse.x = event.clientX - rect.left;
  mouse.y = event.clientY - rect.top;
}

function onPointerLeave() {
  mouse.x = -9999;
  mouse.y = -9999;
}

watch(
  () => [inView.value, pageVisible.value, reduceMotion.value, props.paused],
  start,
);
watch(
  () => props.starsCount,
  () => {
    recreate();
    start();
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
    data-slot="gravity-stars-background"
    class="relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#191826_0%,#06060b_72%)]"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    />
    <slot />
  </div>
</template>
