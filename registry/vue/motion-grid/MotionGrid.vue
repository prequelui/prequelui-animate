<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  count: { type: Number, default: 35 },
  columns: { type: Number, default: 7 },
  dotSize: { type: Number, default: 8 },
  gap: { type: Number, default: 10 },
  speed: { type: Number, default: 1.4 },
  stagger: { type: Number, default: 0.07 },
  pauseOnHover: { type: Boolean, default: true },
});

const root = ref(null);
const controls = [];

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function play() {
  controls.length = 0;
  if (!root.value || reduce()) return;
  const nodes = Array.from(root.value.children);
  nodes.forEach((node, index) => {
    const row = Math.floor(index / props.columns);
    const column = index % props.columns;
    controls.push(
      animate(
        node,
        { scale: [0.65, 1, 0.65], opacity: [0.3, 1, 0.3] },
        {
          duration: props.speed,
          repeat: Infinity,
          delay: (row + column) * props.stagger,
          ease: "easeInOut",
        },
      ),
    );
  });
}

function pause() {
  if (!props.pauseOnHover || !root.value) return;
  controls.forEach((control) => control.stop?.());
  Array.from(root.value.children).forEach((node) => {
    node.style.opacity = "0.35";
    node.style.transform = "scale(1)";
  });
}

onMounted(play);
onBeforeUnmount(() => controls.forEach((control) => control.stop?.()));
</script>

<template>
  <div
    ref="root"
    data-slot="motion-grid"
    aria-hidden="true"
    class="grid w-fit"
    :style="{
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gap: `${gap}px`,
    }"
    @pointerenter="pause"
    @pointerleave="play"
  >
    <span
      v-for="index in count"
      :key="index"
      class="rounded-full bg-foreground"
      :style="{ width: `${dotSize}px`, height: `${dotSize}px`, opacity: 0.55 }"
    />
  </div>
</template>
