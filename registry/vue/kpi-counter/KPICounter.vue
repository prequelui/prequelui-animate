<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  from: { type: Number, default: 0 },
  prefix: { type: String, default: undefined },
  suffix: { type: String, default: undefined },
  decimals: { type: Number, default: 0 },
  delta: { type: Number, default: undefined },
  deltaSuffix: { type: String, default: "%" },
  points: {
    type: Array,
    default: () => [18, 24, 21, 32, 29, 36, 34, 44, 48, 46, 57, 62],
  },
  inView: { type: Boolean, default: true },
  hint: { type: String, default: undefined },
});

const width = 240;
const height = 62;
const countSpring = {
  type: "spring",
  stiffness: 90,
  damping: 50,
  restDelta: 0.001,
  restSpeed: 0.01,
};

let uid = 0;

const root = ref(null);
const visual = ref(null);
const linePath = ref(null);
const areaPath = ref(null);
const deltaEl = ref(null);
const gradientId = ref("kpi-gradient");
const seen = ref(!props.inView);
const countState = { value: props.from };
let observer;
let countControls;
const sparkControls = [];

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const up = computed(() => (props.delta ?? 0) >= 0);

const geometry = computed(() => {
  const points = props.points ?? [];
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const coords = points.map((point, index) => ({
    x: (index / (points.length - 1)) * width,
    y: height - 6 - ((point - min) / span) * (height - 14),
  }));
  const line = smoothPath(coords);
  const area = `${line} L ${width} ${height} L 0 ${height} Z`;
  return { line, area };
});

const finalText = computed(() => formatNumber(props.value));

function smoothPath(points) {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const midX = (current.x + next.x) / 2;
    d += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
  }
  return d;
}

function formatNumber(value) {
  const fixed = Math.abs(value).toFixed(props.decimals);
  const sign = value < 0 && Number(fixed) !== 0 ? "-" : "";
  const [integer = "0", fraction] = fixed.split(".");
  const grouped = integer.replace(/\B(?=(\d{3})+$)/g, ",");
  return fraction
    ? `${sign}${grouped}.${fraction}`
    : `${sign}${grouped}`;
}

function writeCount(value) {
  if (visual.value) visual.value.textContent = formatNumber(value);
}

function animateCount() {
  if (!seen.value) return;
  countControls?.stop?.();
  if (reduce()) {
    countState.value = props.value;
    writeCount(countState.value);
    return;
  }
  countControls = animate(countState, { value: props.value }, {
    ...countSpring,
    onUpdate: () => writeCount(countState.value),
  });
}

function drawSparkline() {
  sparkControls.forEach((control) => control?.stop?.());
  sparkControls.length = 0;
  const line = linePath.value;
  if (!line) return;
  const length = line.getTotalLength();
  line.style.strokeDasharray = `${length}`;
  line.style.strokeDashoffset = `${length}`;
  if (areaPath.value) areaPath.value.style.opacity = "0";
  if (!seen.value) return;

  if (areaPath.value) {
    sparkControls.push(
      animate(areaPath.value, { opacity: [0, 1] }, {
        duration: 0.45,
        ease: [0.23, 1, 0.32, 1],
      }),
    );
  }
  sparkControls.push(
    animate(line, { strokeDashoffset: [length, 0] }, reduce()
      ? { duration: 0 }
      : { duration: 0.9, ease: [0.33, 0, 0.2, 1] }),
  );
}

function activate() {
  animateCount();
  drawSparkline();
}

function animateDelta() {
  if (!deltaEl.value) return;
  if (reduce()) {
    deltaEl.value.style.opacity = "1";
    deltaEl.value.style.transform = "none";
    return;
  }
  animate(deltaEl.value, { opacity: [0, 1], y: [4, 0] }, {
    duration: 0.3,
    ease: [0.23, 1, 0.32, 1],
    delay: 0.15,
  });
}

onMounted(() => {
  gradientId.value = `kpi-${++uid}`;
  writeCount(countState.value);
  nextTick(() => {
    if (!props.inView) {
      seen.value = true;
      activate();
    } else if (root.value) {
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
      drawSparkline();
    }
    animateDelta();
  });
});

watch(() => props.value, () => {
  if (seen.value) activate();
});

watch(() => props.points, () => {
  nextTick(() => drawSparkline());
}, { deep: true });

watch(() => props.decimals, () => writeCount(countState.value));

watch(() => props.delta, (value) => {
  if (value === undefined) return;
  nextTick(() => animateDelta());
});

onBeforeUnmount(() => {
  observer?.disconnect();
  countControls?.stop?.();
  sparkControls.forEach((control) => control?.stop?.());
});
</script>

<template>
  <div
    ref="root"
    data-slot="kpi-counter"
    class="flex w-full max-w-[300px] flex-col gap-4 rounded-xl border bg-card p-5 text-card-foreground"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="flex min-w-0 flex-col gap-1">
        <span class="truncate text-[13px] leading-4 text-muted-foreground">
          {{ label }}
        </span>
        <span class="flex items-baseline gap-0.5 text-[32px] font-medium leading-none tracking-[-0.03em]">
          <span v-if="prefix" class="text-[20px] text-muted-foreground">
            {{ prefix }}
          </span>
          <span ref="visual" aria-hidden="true" class="inline-block tabular-nums" />
          <span class="sr-only">{{ finalText }}</span>
          <span v-if="suffix" class="text-[15px] font-normal text-muted-foreground">
            {{ suffix }}
          </span>
        </span>
      </div>
      <span
        v-if="delta !== undefined"
        ref="deltaEl"
        aria-hidden="true"
        class="inline-flex shrink-0 items-center gap-1 rounded-md px-1.5 py-1 text-[13px] font-medium tabular-nums"
        :class="up
          ? 'bg-emerald-500/12 text-emerald-600 dark:text-emerald-400'
          : 'bg-rose-500/12 text-rose-600 dark:text-rose-400'"
        style="opacity: 0; transform: translateY(4px)"
      >
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" class="size-3">
          <path
            :d="up ? 'M3 9 9 3M4.4 3H9v4.6' : 'M3 3l6 6M4.4 9H9V4.4'"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ Math.abs(delta ?? 0) }}{{ deltaSuffix }}
      </span>
    </div>

    <div v-if="geometry" class="relative">
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
        class="h-[62px] w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <linearGradient :id="gradientId" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="currentColor" stop-opacity="0.26" />
            <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path
          ref="areaPath"
          :d="geometry.area"
          :fill="`url(#${gradientId})`"
          stroke="none"
          style="opacity: 0"
        />
        <path
          ref="linePath"
          :d="geometry.line"
          fill="none"
          stroke="currentColor"
          stroke-dasharray="0 9999"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <p v-if="hint" class="text-[13px] leading-4 text-muted-foreground">
      {{ hint }}
    </p>
  </div>
</template>
