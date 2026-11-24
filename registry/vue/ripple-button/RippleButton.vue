<script setup>
import { nextTick, onBeforeUnmount, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  hoverScale: { type: Number, default: 1 },
  tapScale: { type: Number, default: 0.97 },
  type: { type: String, default: "button" },
});

const button = ref(null);
const rippleWrap = ref(null);
const ripples = ref([]);
const timers = new Set();
let nextId = 0;
let hovered = false;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

onBeforeUnmount(() => {
  timers.forEach((timer) => clearTimeout(timer));
  timers.clear();
});

async function click(event) {
  if (!button.value) return;
  const rect = button.value.getBoundingClientRect();
  const id = nextId++;
  ripples.value.push({
    id,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  });
  await nextTick();
  if (!reduce()) {
    const node = rippleWrap.value?.querySelector(`[data-ripple="${id}"]`);
    if (node) {
      animate(
        node,
        { scale: [0, 10], opacity: [0.5, 0] },
        { duration: 0.6, ease: "easeOut" },
      );
    }
  }
  const timer = setTimeout(() => {
    ripples.value = ripples.value.filter((item) => item.id !== id);
    timers.delete(timer);
  }, 650);
  timers.add(timer);
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
    { scale: hovered && props.hoverScale !== 1 ? props.hoverScale : 1 },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

function enter() {
  hovered = true;
  if (props.hoverScale !== 1) release();
}

function leave() {
  hovered = false;
  release();
}
</script>

<template>
  <button
    ref="button"
    :type="type"
    data-slot="ripple-button"
    class="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground"
    @click="click"
    @pointerdown="press"
    @pointerup="release"
    @pointerenter="enter"
    @pointerleave="leave"
  >
    <slot />
    <span ref="rippleWrap" aria-hidden="true" class="pointer-events-none absolute inset-0">
      <span
        v-for="ripple in ripples"
        :key="ripple.id"
        :data-ripple="ripple.id"
        class="absolute size-5 rounded-full bg-current opacity-50"
        :style="{ left: `${ripple.x - 10}px`, top: `${ripple.y - 10}px` }"
      />
    </span>
  </button>
</template>
