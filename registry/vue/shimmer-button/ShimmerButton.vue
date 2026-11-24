<script setup>
import { nextTick, onBeforeUnmount, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  shimmerColor: {
    type: String,
    default: "color-mix(in oklab, var(--primary-foreground) 55%, transparent)",
  },
  shimmerDuration: { type: Number, default: 900 },
  shimmerDelay: { type: Number, default: 60 },
  shimmer: { type: Boolean, default: true },
  tapScale: { type: Number, default: 0.97 },
  type: { type: String, default: "button" },
});

const button = ref(null);
const beam = ref(null);
const run = ref(0);
let timer;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onBeforeUnmount(() => clearTimeout(timer));

async function play(delay = props.shimmerDelay) {
  if (!props.shimmer || reduce()) return;
  clearTimeout(timer);
  timer = setTimeout(async () => {
    run.value += 1;
    await nextTick();
    if (!beam.value) return;
    animate(
      beam.value,
      { x: ["-180%", "260%"], skewX: -14, opacity: [0, 1, 1, 0] },
      {
        duration: props.shimmerDuration / 1000,
        ease: [0.33, 0, 0.2, 1],
        times: [0, 0.16, 0.72, 1],
      },
    );
  }, delay);
}

function press() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: props.tapScale },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

function release() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: 1 },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

function enter(event) {
  if (event.pointerType !== "touch") play();
}

function click() {
  play(0);
}
</script>

<template>
  <button
    ref="button"
    :type="type"
    data-slot="shimmer-button"
    class="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
    @pointerenter="enter"
    @click="click"
    @pointerdown="press"
    @pointerup="release"
    @pointerleave="release"
  >
    <span
      v-if="run > 0"
      :key="run"
      ref="beam"
      aria-hidden="true"
      data-slot="shimmer-button-beam"
      class="pointer-events-none absolute inset-y-0 left-0 z-0 w-[52%] opacity-0"
      :style="{
        background: `linear-gradient(105deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`,
      }"
    />
    <span class="relative z-10 inline-flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>
