<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  value: { type: Number, required: true },
  size: { type: Number, default: 148 },
  strokeWidth: { type: Number, default: 10 },
  from: { type: Number, default: 0 },
  label: { type: String, default: undefined },
  showLabel: { type: Boolean, default: true },
  showTicks: { type: Boolean, default: true },
  ticks: { type: Number, default: 48 },
  inView: { type: Boolean, default: true },
  color: { type: String, default: "currentColor" },
  trackColor: { type: String, default: "currentColor" },
  transition: { type: Object, default: undefined },
});

const arcSpring = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
};
const countSpring = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

let uid = 0;

const root = ref(null);
const arc = ref(null);
const visual = ref(null);
const gradientId = ref("radial-gradient");
const seen = ref(!props.inView);
const countState = { value: props.from };
const progressState = { p: 0 };
let observer;
let arcControls;
let countControls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const safe = computed(() => Math.min(100, Math.max(0, props.value)));
const radius = computed(() => (props.size - props.strokeWidth) / 2);
const center = computed(() => props.size / 2);
const tickCount = computed(() => Math.max(4, Math.round(props.ticks)));

const finalText = computed(() => formatNumber(safe.value));

const ticksList = computed(() => {
  if (!props.showTicks) return [];
  return Array.from({ length: tickCount.value }, (_, index) => {
    const angle = (index / tickCount.value) * 360;
    const major = index % 6 === 0;
    const active = (index / tickCount.value) * 100 <= safe.value;
    const inner = radius.value + props.strokeWidth / 2 + 4;
    const outer = inner + (major ? 5 : 2.5);
    return { angle, major, active, inner, outer };
  });
});

function formatNumber(value) {
  const fixed = Math.abs(value).toFixed(0);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  return `${sign}${fixed.replace(/\B(?=(\d{3})+$)/g, ",")}`;
}

function writeCount(value) {
  if (visual.value) visual.value.textContent = formatNumber(value);
}

function circumference() {
  return 2 * Math.PI * radius.value;
}

function applyArc() {
  if (!arc.value) return;
  const total = circumference();
  arc.value.style.strokeDasharray = `${total}`;
  arc.value.style.strokeDashoffset = `${total * (1 - progressState.p)}`;
}

function drawArc() {
  arcControls?.stop?.();
  const total = circumference();
  if (arc.value) {
    arc.value.style.strokeDasharray = `${total}`;
  }
  if (!seen.value) {
    progressState.p = 0;
    applyArc();
    return;
  }
  if (reduce()) {
    progressState.p = safe.value / 100;
    applyArc();
    return;
  }
  arcControls = animate(progressState, { p: safe.value / 100 }, {
    ...(props.transition ?? arcSpring),
    onUpdate: applyArc,
  });
}

function animateCount() {
  if (!seen.value) return;
  countControls?.stop?.();
  if (reduce()) {
    countState.value = safe.value;
    writeCount(countState.value);
    return;
  }
  countControls = animate(countState, { value: safe.value }, {
    ...countSpring,
    onUpdate: () => writeCount(countState.value),
  });
}

function activate() {
  animateCount();
  drawArc();
}

onMounted(() => {
  gradientId.value = `radial-${++uid}`;
  writeCount(countState.value);
  applyArc();
  if (!props.inView) {
    seen.value = true;
    activate();
    return;
  }
  if (!root.value) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      seen.value = true;
      activate();
      observer?.disconnect();
    },
    { threshold: 0.35 },
  );
  observer.observe(root.value);
});

watch(() => props.value, () => {
  if (seen.value) activate();
});

watch(() => props.from, (value) => {
  countState.value = value;
  writeCount(value);
});

watch(() => [props.size, props.strokeWidth], () => {
  nextTick(() => drawArc());
});

onBeforeUnmount(() => {
  observer?.disconnect();
  arcControls?.stop?.();
  countControls?.stop?.();
});
</script>

<template>
  <div
    ref="root"
    data-slot="radial-progress"
    role="progressbar"
    :aria-valuemin="0"
    :aria-valuemax="100"
    :aria-valuenow="Math.round(safe)"
    :aria-label="label ?? 'Progress'"
    class="relative inline-flex items-center justify-center"
    :style="{ width: `${size}px`, height: `${size}px` }"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="-rotate-90"
      aria-hidden="true"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="color" stop-opacity="0.55" />
          <stop offset="100%" :stop-color="color" stop-opacity="1" />
        </linearGradient>
      </defs>
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="trackColor"
        stroke-opacity="0.12"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
      />
      <circle
        ref="arc"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="`url(#${gradientId})`"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        stroke-dasharray="0 9999"
      />
      <line
        v-for="(tick, index) in ticksList"
        :key="index"
        :x1="center"
        :y1="center - tick.inner"
        :x2="center"
        :y2="center - tick.outer"
        :stroke="color"
        :stroke-opacity="tick.active ? 0.5 : 0.14"
        :stroke-width="tick.major ? 1.4 : 1"
        stroke-linecap="round"
        :transform="`rotate(${tick.angle} ${center} ${center})`"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center">
      <span
        ref="visual"
        aria-hidden="true"
        class="inline-block font-medium leading-none tracking-[-0.04em] tabular-nums"
        :style="{ fontSize: `${Math.max(22, Math.round(size * 0.25))}px` }"
      />
      <span class="sr-only">{{ finalText }}</span>
      <span v-if="showLabel" class="text-[13px] leading-4 text-muted-foreground">
        {{ label ?? "complete" }}
      </span>
    </div>
  </div>
</template>
