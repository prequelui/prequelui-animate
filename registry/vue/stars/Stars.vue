<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const LAYERS = [
  { count: 1100, size: 1, multiplier: 1, opacity: 0.55 },
  { count: 480, size: 2, multiplier: 2, opacity: 0.75 },
  { count: 220, size: 3, multiplier: 3, opacity: 0.95 },
];

const props = defineProps({
  speed: { type: Number, default: 50 },
  paused: { type: Boolean, default: false },
  starColor: { type: String, default: "#f8fafc" },
  factor: { type: Number, default: 0.05 },
  pointerEvents: { type: Boolean, default: true },
});

const root = ref(null);
const parallax = ref(null);
const layerEls = [];
const inView = ref(false);
const pageVisible = ref(true);
const reduceMotion = ref(false);

function seeded(index, salt = 1) {
  const value = Math.sin(index * 127.1 * salt + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function buildShadows(count, salt) {
  const shadows = [];
  for (let index = 0; index < count; index++) {
    const x = Math.round((seeded(index + salt * 1000, 1.7) - 0.5) * 2800);
    const y = Math.round((seeded(index + salt * 1000, 2.9) - 0.5) * 2800);
    shadows.push(`${x}px ${y}px`);
  }
  return shadows.join(",");
}

const layers = LAYERS.map((layer) => ({
  ...layer,
  shadows: buildShadows(layer.count, layer.multiplier),
}));

const playing = computed(
  () => inView.value && pageVisible.value && !reduceMotion.value && !props.paused,
);
const parallaxClass = computed(() =>
  props.pointerEvents ? "absolute inset-0" : "absolute inset-0 pointer-events-none",
);

let observer;
let media;
let onVisibility;
let onMedia;
let controls = [];
const offset = { x: 0, y: 0 };
let follow;

function setLayer(element, index) {
  layerEls[index] = element;
}

function stopControls() {
  for (const control of controls) control?.stop?.();
  controls = [];
}

function start() {
  stopControls();
  layers.forEach((layer, index) => {
    const element = layerEls[index];
    if (!element) return;
    if (!playing.value) {
      controls.push(animate(element, { y: 0 }, { duration: 0 }));
      return;
    }
    const duration = (50 * layer.multiplier) / Math.max(0.1, props.speed);
    controls.push(
      animate(
        element,
        { y: [0, -2000] },
        { duration, repeat: Infinity, ease: "linear" },
      ),
    );
  });
}

function applyOffset() {
  if (!parallax.value) return;
  parallax.value.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
}

function onPointerMove(event) {
  if (reduceMotion.value || !root.value) return;
  const rect = root.value.getBoundingClientRect();
  const x = -(event.clientX - rect.left - rect.width / 2) * props.factor;
  const y = -(event.clientY - rect.top - rect.height / 2) * props.factor;
  follow?.stop?.();
  follow = animate(
    offset,
    { x, y },
    {
      type: "spring",
      stiffness: 50,
      damping: 20,
      onUpdate: applyOffset,
    },
  );
}

watch(playing, start);
watch(
  () => props.speed,
  () => {
    if (playing.value) start();
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

  start();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  if (onVisibility) document.removeEventListener("visibilitychange", onVisibility);
  media?.removeEventListener?.("change", onMedia);
  stopControls();
  follow?.stop?.();
});
</script>

<template>
  <div
    ref="root"
    data-slot="stars-background"
    class="relative size-full overflow-hidden bg-[radial-gradient(ellipse_at_bottom,#17172a_0%,#05050a_75%)]"
    @pointermove="onPointerMove"
  >
    <div ref="parallax" aria-hidden="true" :class="parallaxClass">
      <div
        v-for="(layer, index) in layers"
        :key="layer.multiplier"
        :ref="(element) => setLayer(element, index)"
        class="absolute left-0 top-0 h-[2000px] w-full"
        style="will-change: transform"
      >
        <div
          class="absolute rounded-full bg-transparent"
          :style="{
            width: `${layer.size}px`,
            height: `${layer.size}px`,
            color: starColor,
            boxShadow: layer.shadows,
            opacity: reduceMotion ? layer.opacity * 0.8 : layer.opacity,
          }"
        />
        <div
          class="absolute top-[2000px] rounded-full bg-transparent"
          :style="{
            width: `${layer.size}px`,
            height: `${layer.size}px`,
            color: starColor,
            boxShadow: layer.shadows,
            opacity: reduceMotion ? layer.opacity * 0.8 : layer.opacity,
          }"
        />
      </div>
    </div>
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,5,10,0.7))]"
    />
    <slot />
  </div>
</template>
