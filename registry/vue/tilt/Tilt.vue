<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  maxTilt: { type: Number, default: 10 },
  perspective: { type: Number, default: 800 },
  transition: { type: Object, default: undefined },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
let control;

const spring = computed(
  () =>
    props.transition ?? {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
);

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function move(event) {
  if (reduce() || !root.value) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const px = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
  const py = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
  const rotateY = (px * 2 - 1) * props.maxTilt;
  const rotateX = -(py * 2 - 1) * props.maxTilt;
  control = animate(
    root.value,
    {
      rotateX,
      rotateY,
      transformPerspective: props.perspective,
    },
    spring.value,
  );
}

function leave() {
  if (!root.value) return;
  control = animate(
    root.value,
    {
      rotateX: 0,
      rotateY: 0,
      transformPerspective: props.perspective,
    },
    spring.value,
  );
}

onMounted(() => {
  if (!root.value) return;
  control = animate(
    root.value,
    { rotateX: 0, rotateY: 0, transformPerspective: props.perspective },
    { duration: 0 },
  );
});

onBeforeUnmount(() => {
  control?.stop?.();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="tilt"
    class="will-change-transform"
    :style="{ transformStyle: 'preserve-3d' }"
    @pointermove="move"
    @pointerleave="leave"
  >
    <slot />
  </component>
</template>
