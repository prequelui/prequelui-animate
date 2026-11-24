<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: String, required: true },
  duration: { type: Number, default: 1 },
  wave: { type: Boolean, default: false },
  color: { type: String, default: "var(--muted-foreground)" },
  shimmeringColor: { type: String, default: "var(--foreground)" },
});

const root = ref(null);
const track = ref(null);
const controls = [];
let observer;

const chars = Array.from(props.text ?? "");
const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function play() {
  if (reduce() || !track.value) return;
  const nodes = Array.from(track.value.children);
  nodes.forEach((node, index) => {
    controls.push(
      animate(
        node,
        {
          ...(props.wave ? { x: [0, 5, 0], y: [0, -5, 0], scale: [1, 1.1, 1], rotateY: [0, 15, 0] } : {}),
          opacity: [1, 0.35, 1],
        },
        {
          duration: props.duration,
          repeat: Infinity,
          repeatDelay: chars.length * 0.05,
          delay: (index * props.duration) / Math.max(1, chars.length),
          ease: "easeInOut",
        },
      ),
    );
  });
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    play();
    observer?.disconnect();
  });
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  controls.forEach((control) => control.stop?.());
});
</script>

<template>
  <span
    ref="root"
    data-slot="shimmering-text"
    class="relative inline-block"
    :style="{
      '--shimmer-color': shimmeringColor,
      '--shimmer-base': color,
      color,
      perspective: '500px',
    }"
  >
    <span class="sr-only">{{ text }}</span>
    <span ref="track" aria-hidden="true" class="inline-block" style="perspective: inherit">
      <span
        v-for="(char, index) in chars"
        :key="`${char}-${index}`"
        class="inline-block whitespace-pre"
        style="transform-style: preserve-3d"
      >{{ char }}</span>
    </span>
  </span>
</template>
