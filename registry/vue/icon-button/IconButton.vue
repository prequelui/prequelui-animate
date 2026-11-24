<script setup>
import { nextTick, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  size: { type: Number, default: 4 },
  count: { type: Number, default: 8 },
  distance: { type: Number, default: 24 },
  type: { type: String, default: "button" },
});

const button = ref(null);
const particles = ref(null);
const bursts = ref(0);

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function burst() {
  if (reduce()) return;
  bursts.value += 1;
  await nextTick();
  const nodes = particles.value?.children ?? [];
  Array.from(nodes).forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2;
    animate(
      node,
      {
        opacity: [1, 0],
        x: Math.cos(angle) * props.distance,
        y: Math.sin(angle) * props.distance,
        scale: 0.2,
      },
      { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
    );
  });
}

function press() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: 0.97 },
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
</script>

<template>
  <button
    ref="button"
    :type="type"
    data-slot="icon-button"
    class="relative inline-flex size-10 items-center justify-center rounded-lg border bg-background p-0 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    @pointerdown="press"
    @pointerup="release"
    @pointerleave="release"
    @click="burst"
  >
    <slot />
    <span
      ref="particles"
      data-slot="icon-button-particles"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <span
        v-for="index in count"
        :key="`${bursts}-${index}`"
        class="absolute left-1/2 top-1/2 rounded-full bg-current opacity-0"
        :style="{ width: `${size}px`, height: `${size}px` }"
      />
    </span>
  </button>
</template>
