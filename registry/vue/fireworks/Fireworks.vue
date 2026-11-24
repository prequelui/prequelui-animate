<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

const PALETTE = ["#f97316", "#f43f5e", "#a855f7", "#22d3ee", "#facc15", "#34d399"];

const props = defineProps({
  speed: { type: Number, default: 1 },
  paused: { type: Boolean, default: false },
  interactive: { type: Boolean, default: true },
  population: { type: Number, default: 1 },
  colors: {
    type: Array,
    default: () => ["#f97316", "#f43f5e", "#a855f7", "#22d3ee", "#facc15", "#34d399"],
  },
  particleCount: { type: Number, default: 64 },
});

const root = ref(null);
const canvasRef = ref(null);
const inView = ref(false);
const pageVisible = ref(true);
const reduceMotion = ref(false);

const rockets = [];
const sparks = [];
let observer;
let observerSize;
let media;
let onVisibility;
let onMedia;
let frame = 0;
let nextLaunch = 0;
let last = 0;

const rate = computed(() => Math.max(0.1, props.speed));
const palette = computed(() =>
  Array.isArray(props.colors) && props.colors.length ? props.colors : PALETTE,
);
const playing = computed(
  () => inView.value && pageVisible.value && !reduceMotion.value && !props.paused,
);

function explode(x, y, color) {
  const count = Math.round(
    props.particleCount * Math.min(1.6, Math.max(0.4, rate.value)),
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
}

function launch(x, target, color) {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const options = palette.value;
  rockets.push({
    x,
    y: rect.height * 1.02,
    vx: (Math.random() - 0.5) * 0.7,
    vy: -(3.4 + Math.random() * 2.2) * rate.value,
    target,
    color: color ?? options[Math.floor(Math.random() * options.length)] ?? PALETTE[0],
    size: 1.8 + Math.random() * 1.8,
    trail: [],
  });
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
      ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);
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
}

function staticFrame() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  sparks.length = 0;
  rockets.length = 0;
  const rect = canvas.getBoundingClientRect();
  const spots = [0.3, 0.5, 0.72];
  const options = palette.value;
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
  if (reduceMotion.value) staticFrame();
  else draw();
}

function tick(now) {
  const delta = Math.min(64, now - last);
  last = now;
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (now > nextLaunch) {
    if (props.population > 0 && Math.random() < props.population) {
      launch(
        rect.width * (0.12 + Math.random() * 0.76),
        rect.height * (0.12 + Math.random() * 0.3),
      );
    }
    nextLaunch =
      now +
      (260 + Math.random() * 520) / Math.max(0.2, props.population);
  }
  for (let index = rockets.length - 1; index >= 0; index--) {
    const rocket = rockets[index];
    rocket.trail.push({ x: rocket.x, y: rocket.y });
    if (rocket.trail.length > 18) rocket.trail.shift();
    rocket.x += rocket.vx * rate.value;
    rocket.y += rocket.vy * rate.value;
    rocket.vy += 0.028 * delta * 0.06;
    if (rocket.vy >= 0 || rocket.y <= rocket.target) {
      explode(rocket.x, rocket.y, rocket.color);
      rockets.splice(index, 1);
    }
  }
  for (let index = sparks.length - 1; index >= 0; index--) {
    const spark = sparks[index];
    spark.vx *= 0.985;
    spark.vy *= 0.985;
    spark.vy += 0.045;
    spark.x += spark.vx * rate.value;
    spark.y += spark.vy * rate.value;
    spark.alpha -= spark.decay;
    if (spark.alpha <= 0) sparks.splice(index, 1);
  }
  draw();
  frame = requestAnimationFrame(tick);
}

function start() {
  cancelAnimationFrame(frame);
  frame = 0;
  if (!playing.value) {
    if (reduceMotion.value) staticFrame();
    return;
  }
  last = performance.now();
  const first = canvasRef.value?.getBoundingClientRect();
  if (first) {
    const options = palette.value;
    explode(
      first.width * 0.5,
      first.height * 0.3,
      options[1] ?? options[0] ?? PALETTE[0],
    );
    nextLaunch = performance.now() + 260;
  }
  frame = requestAnimationFrame(tick);
}

function onClick(event) {
  if (!props.interactive || !playing.value) return;
  const rect = root.value?.getBoundingClientRect();
  if (!rect) return;
  launch(event.clientX - rect.left, event.clientY - rect.top);
}

watch(playing, start);
watch(rate, () => {
  if (playing.value) start();
});

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
    data-slot="fireworks-background"
    class="relative size-full overflow-hidden bg-[#040408]"
    @click="onClick"
  >
    <canvas
      ref="canvasRef"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    />
    <slot />
  </div>
</template>
