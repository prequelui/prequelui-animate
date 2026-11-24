<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  number: { type: Number, required: true },
  fromNumber: { type: Number, default: 0 },
  step: { type: Number, default: 1 },
  itemsSize: { type: Number, default: 30 },
  sideItemsCount: { type: Number, default: 2 },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
  delay: { type: Number, default: 0 },
  transition: { type: Object, default: undefined },
});
const emit = defineEmits(["completed"]);

const bandSpring = {
  type: "spring",
  stiffness: 90,
  damping: 30,
  restDelta: 0.001,
  restSpeed: 0.01,
};

const root = ref(null);
const band = ref(null);
const started = ref(false);
let observer;
let timer;
let controls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const values = computed(() => {
  const size = Math.max(1, props.step);
  const from = Math.round(props.fromNumber / size) * size;
  const to = Math.round(props.number / size) * size;
  const direction = to >= from ? 1 : -1;
  const count = Math.abs(Math.round((to - from) / size)) + 1;
  return Array.from(
    { length: count },
    (_, index) => from + index * size * direction,
  );
});

const targetIndex = computed(() => values.value.length - 1);
const height = computed(
  () => props.itemsSize * (1 + props.sideItemsCount * 2),
);
const initialY = computed(() => props.sideItemsCount * props.itemsSize);
const finalY = computed(
  () => (props.sideItemsCount - targetIndex.value) * props.itemsSize,
);

function move() {
  if (!band.value) return;
  controls?.stop?.();
  if (reduce()) {
    band.value.style.transform = `translateY(${finalY.value}px)`;
    emit("completed");
    return;
  }
  controls = animate(band.value, { y: finalY.value }, {
    ...(props.transition ?? bandSpring),
  });
  controls.finished.then(() => emit("completed"));
}

function start() {
  if (started.value) return;
  if (reduce()) {
    started.value = true;
    nextTick(move);
    return;
  }
  timer = setTimeout(() => {
    started.value = true;
    nextTick(move);
  }, props.delay);
}

onMounted(() => {
  if (band.value) {
    band.value.style.transform = `translateY(${initialY.value}px)`;
  }
  if (!props.inView) {
    start();
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      start();
      if (props.inViewOnce) observer?.disconnect();
    },
    { threshold: 0.35 },
  );
  if (root.value) observer.observe(root.value);
});

watch(finalY, () => {
  if (started.value) nextTick(move);
});

onBeforeUnmount(() => {
  clearTimeout(timer);
  controls?.stop?.();
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="root"
    data-slot="scrolling-number"
    class="relative isolate inline-block overflow-hidden rounded-lg [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_76%,transparent)]"
    :style="{ height: `${height}px` }"
  >
    <div
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-1 top-1/2 z-10 -translate-y-1/2 rounded-md border bg-foreground/[0.06] dark:bg-background/20"
      :style="{ height: `${itemsSize}px` }"
    />
    <div ref="band" aria-hidden="true" class="relative flex flex-col">
      <div
        v-for="value in values"
        :key="value"
        class="flex shrink-0 items-center justify-center font-medium tabular-nums"
        :class="value === number ? 'text-foreground' : 'text-muted-foreground/50'"
        :style="{ height: `${itemsSize}px` }"
      >
        {{ value.toLocaleString("en-US") }}
      </div>
    </div>
    <span class="sr-only">{{ number.toLocaleString("en-US") }}</span>
  </div>
</template>
