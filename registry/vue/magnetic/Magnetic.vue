<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  strength: { type: Number, default: 0.5 },
  range: { type: Number, default: 120 },
  springOptions: { type: Object, default: undefined },
  onlyOnHover: { type: Boolean, default: false },
  disableOnTouch: { type: Boolean, default: true },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
const canHover = ref(false);
const reduced = ref(false);
const hovering = ref(false);
let control;

const enabled = computed(
  () => !reduced.value && (canHover.value || !props.disableOnTouch),
);

const spring = computed(
  () =>
    props.springOptions ?? {
      type: "spring",
      stiffness: 100,
      damping: 10,
      mass: 0.5,
    },
);

function reset() {
  if (!root.value) return;
  control?.stop?.();
  control = animate(root.value, { x: 0, y: 0 }, spring.value);
}

function compute(event) {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = event.clientX - centerX;
  const dy = event.clientY - centerY;
  const distance = Math.hypot(dx, dy);

  if (distance <= props.range) {
    const factor = (1 - distance / props.range) * props.strength;
    control?.stop?.();
    control = animate(
      root.value,
      { x: dx * factor, y: dy * factor },
      spring.value,
    );
  } else {
    reset();
  }
}

function onWindowMove(event) {
  if (!enabled.value || props.onlyOnHover) return;
  compute(event);
}

function onPointerEnter() {
  hovering.value = true;
}

function onPointerMove(event) {
  if (enabled.value && props.onlyOnHover && hovering.value) compute(event);
}

function onPointerLeave() {
  hovering.value = false;
  reset();
}

watch(enabled, (value) => {
  if (!value) reset();
});

onMounted(() => {
  canHover.value =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  reduced.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!props.onlyOnHover) {
    window.addEventListener("mousemove", onWindowMove, { passive: true });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", onWindowMove);
  control?.stop?.();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="magnetic"
    class="inline-block"
    @pointerenter="onPointerEnter"
    @pointermove="onPointerMove"
    @pointerleave="onPointerLeave"
  >
    <slot />
  </component>
</template>
