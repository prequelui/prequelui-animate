<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  speed: { type: Number, default: 42 },
  reverse: { type: Boolean, default: false },
  pauseOnHover: { type: Boolean, default: true },
  fade: { type: Boolean, default: true },
  gap: { type: Number, default: 32 },
  repeat: { type: Number, default: 2 },
  itemClassName: { type: String, default: "" },
});

const root = ref(null);
const track = ref(null);
const first = ref(null);
const paused = ref(false);
const ready = ref(false);
const span = ref(0);
let position = 0;
let raf = 0;
let last = 0;
let observer;

const copies = computed(() => Math.max(2, Math.round(props.repeat)));

const maskStyle = computed(() =>
  props.fade
    ? {
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }
    : {},
);

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function apply() {
  if (track.value) {
    track.value.style.transform = `translate3d(${position}px, 0, 0)`;
  }
}

function measure() {
  const node = first.value;
  if (!node) return;
  const width = node.scrollWidth + props.gap;
  span.value = width;
  if (props.reverse) position = -width;
  ready.value = width > 0;
  apply();
}

function tick(now) {
  if (!last) last = now;
  const delta = Math.min(now - last, 64);
  last = now;

  if (!reduce() && !paused.value && ready.value && props.speed > 0) {
    const direction = props.reverse ? 1 : -1;
    let next = position + (direction * props.speed * delta) / 1000;
    const width = span.value;
    if (width > 0) {
      if (!props.reverse && next <= -width) next += width;
      if (props.reverse && next >= 0) next -= width;
      position = next;
      apply();
    }
  }

  raf = requestAnimationFrame(tick);
}

function setFirst(node) {
  first.value = node;
}

watch(
  () => [props.gap, props.reverse, props.repeat],
  async () => {
    await nextTick();
    measure();
  },
);

onMounted(() => {
  measure();
  if (first.value) {
    observer = new ResizeObserver(measure);
    observer.observe(first.value);
  }
  raf = requestAnimationFrame(tick);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(raf);
  observer?.disconnect();
});
</script>

<template>
  <div
    ref="root"
    data-slot="marquee"
    class="relative overflow-hidden"
    :style="maskStyle"
    @pointerenter="paused = pauseOnHover ? true : paused"
    @pointerleave="paused = pauseOnHover ? false : paused"
  >
    <div
      ref="track"
      class="flex w-max items-center will-change-transform"
      :style="{ gap: `${gap}px` }"
      :data-paused="paused ? 'true' : undefined"
    >
      <div
        v-for="copy in copies"
        :key="copy"
        :ref="copy === 1 ? setFirst : undefined"
        :aria-hidden="copy > 1 ? 'true' : undefined"
        :class="['flex shrink-0 items-center', itemClassName]"
        :style="{ gap: `${gap}px` }"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
