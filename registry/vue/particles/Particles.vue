<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { animate } from "motion";

const props = defineProps({
  animate: { type: Boolean, default: true },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
  inViewMargin: { type: String, default: "0px" },
  trigger: { type: Number, default: 0 },
  side: { type: String, default: "top" },
  align: { type: String, default: "center" },
  count: { type: Number, default: 6 },
  radius: { type: Number, default: 30 },
  spread: { type: Number, default: 360 },
  duration: { type: Number, default: 0.8 },
  holdDelay: { type: Number, default: 0.05 },
  sideOffset: { type: Number, default: 0 },
  alignOffset: { type: Number, default: 0 },
  delay: { type: Number, default: 0 },
  size: { type: Number, default: 4 },
  color: { type: String, default: "currentColor" },
  transition: { type: Object, default: undefined },
});

const root = ref(null);
const layer = ref(null);
const onScreen = ref(!props.inView);
const bursts = ref([]);
let observer;
let timer;
let generation = 0;
let controls = [];

const vertical = computed(
  () => props.side === "top" || props.side === "bottom",
);

const alignPercent = computed(() =>
  props.align === "start" ? "0%" : props.align === "end" ? "100%" : "50%",
);

const top = computed(() =>
  vertical.value
    ? props.side === "top"
      ? `calc(0% - ${props.sideOffset}px)`
      : `calc(100% + ${props.sideOffset}px)`
    : `calc(${alignPercent.value} + ${props.alignOffset}px)`,
);

const left = computed(() =>
  vertical.value
    ? `calc(${alignPercent.value} + ${props.alignOffset}px)`
    : props.side === "left"
      ? `calc(0% - ${props.sideOffset}px)`
      : `calc(100% + ${props.sideOffset}px)`,
);

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function stopControls() {
  for (const control of controls) control?.stop?.();
  controls = [];
}

async function burst() {
  if (!props.animate || !onScreen.value || reduce()) return;
  generation += 1;
  const current = generation;
  bursts.value = Array.from({ length: props.count }, (_, index) => ({
    key: `${current}-${index}`,
    index,
  }));

  await nextTick();
  const nodes = Array.from(layer.value?.children ?? []);
  const fullCircle = props.spread % 360 === 0;
  const step =
    ((props.spread * Math.PI) / 180) /
    Math.max(1, fullCircle ? props.count : props.count - 1);

  nodes.forEach((node, index) => {
    const angle = index * step;
    const x = Math.round(Math.cos(angle) * props.radius * 100) / 100;
    const y = Math.round(Math.sin(angle) * props.radius * 100) / 100;
    controls.push(
      animate(
        node,
        {
          x: [0, x],
          y: [0, y],
          scale: [0, 1, 0],
          opacity: [0, 1, 0],
        },
        {
          duration: props.duration,
          delay: props.delay + index * props.holdDelay,
          ease: "easeOut",
          ...(props.transition ?? {}),
        },
      ),
    );
  });

  const total =
    (props.duration + props.delay + props.holdDelay * (props.count - 1)) * 1000;
  clearTimeout(timer);
  timer = setTimeout(() => {
    bursts.value = [];
  }, total + 80);
}

watch(
  () => props.trigger,
  (value, previous) => {
    if (value === previous) return;
    burst();
  },
);

onMounted(() => {
  if (!props.inView) return;
  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      onScreen.value = visible;
      if (visible && props.inViewOnce) observer?.disconnect();
    },
    { threshold: 0.35, rootMargin: props.inViewMargin },
  );
  if (root.value) observer.observe(root.value);
  if (props.trigger > 0) burst();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  clearTimeout(timer);
  stopControls();
});

defineExpose({ burst });
</script>

<template>
  <div ref="root" data-slot="particles" class="relative">
    <slot />
    <div
      ref="layer"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10"
    >
      <span
        v-for="dot in bursts"
        :key="dot.key"
        class="pointer-events-none absolute rounded-full"
        :style="{
          top,
          left,
          width: `${size}px`,
          height: `${size}px`,
          marginLeft: `${-size / 2}px`,
          marginTop: `${-size / 2}px`,
          background: color,
        }"
      />
    </div>
  </div>
</template>
