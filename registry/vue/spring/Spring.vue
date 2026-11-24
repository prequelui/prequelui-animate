<script setup>
import { onBeforeUnmount, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  stiffness: { type: Number, default: 200 },
  damping: { type: Number, default: 16 },
  elastic: { type: Number, default: 0.7 },
  snapBack: { type: Boolean, default: true },
  pressScale: { type: Number, default: 1.06 },
});

const root = ref(null);
let dragging = false;
let startX = 0;
let startY = 0;
let lastX = 0;
let lastY = 0;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function down(event) {
  if (reduce() || !root.value || event.button !== 0) return;
  dragging = true;
  startX = event.clientX;
  startY = event.clientY;
  lastX = 0;
  lastY = 0;
  root.value.setPointerCapture?.(event.pointerId);
  root.value.style.cursor = "grabbing";
  animate(
    root.value,
    { scale: props.pressScale },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

function move(event) {
  if (!dragging || !root.value) return;
  lastX = (event.clientX - startX) * props.elastic;
  lastY = (event.clientY - startY) * props.elastic;
  root.value.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) scale(${props.pressScale})`;
}

function up() {
  if (!dragging || !root.value) return;
  dragging = false;
  root.value.style.cursor = "grab";
  if (!props.snapBack) return;
  animate(
    root.value,
    { x: [lastX, 0], y: [lastY, 0], scale: 1 },
    { type: "spring", stiffness: props.stiffness, damping: props.damping },
  ).finished.then(() => {
    if (root.value) root.value.style.transform = "none";
  });
}

onBeforeUnmount(() => {
  dragging = false;
});
</script>

<template>
  <div
    ref="root"
    data-slot="spring"
    class="cursor-grab touch-none select-none active:cursor-grabbing"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
  >
    <slot />
  </div>
</template>
