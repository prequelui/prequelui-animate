<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  zoomScale: { type: Number, default: 3 },
  zoomOnClick: { type: Boolean, default: true },
  zoomOnHover: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  width: { type: [String, Number], default: "100%" },
  height: { type: [String, Number], default: "100%" },
  transition: { type: Object, default: undefined },
});

const root = ref(null);
const inner = ref(null);
const zoomed = ref(false);
const origin = ref("50% 50%");
const coarse = ref(false);
let control;

const options = computed(
  () =>
    props.transition ?? {
      type: "spring",
      stiffness: 200,
      damping: 28,
    },
);

const cursor = computed(() =>
  props.disabled ? "default" : zoomed.value ? "zoom-out" : "zoom-in",
);

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setOriginFromEvent(event) {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  let clientX = 0;
  let clientY = 0;

  if ("touches" in event && event.touches?.[0]) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else if ("clientX" in event) {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  const x = clamp(clientX - rect.left, 0, rect.width);
  const y = clamp(clientY - rect.top, 0, rect.height);
  origin.value = `${rect.width ? (x / rect.width) * 100 : 50}% ${
    rect.height ? (y / rect.height) * 100 : 50
  }%`;
}

function scale() {
  if (!inner.value) return;
  control?.stop?.();
  control = animate(
    inner.value,
    {
      scale: props.disabled || reduce() ? 1 : zoomed.value ? props.zoomScale : 1,
    },
    options.value,
  );
}

function handleEnter(event) {
  if (props.disabled || coarse.value || !props.zoomOnHover) return;
  setOriginFromEvent(event);
  zoomed.value = true;
}

function handleLeave() {
  if (props.disabled || coarse.value || !props.zoomOnHover) return;
  zoomed.value = false;
}

function handleMove(event) {
  if (props.disabled || coarse.value) return;
  setOriginFromEvent(event);
}

function handleClick(event) {
  if (props.disabled || !props.zoomOnClick) return;
  setOriginFromEvent(event);
  zoomed.value = !zoomed.value;
}

function handleTouchStart(event) {
  if (props.disabled) return;
  setOriginFromEvent(event);
  if (!props.zoomOnClick) zoomed.value = true;
}

function handleTouchMove(event) {
  if (props.disabled) return;
  setOriginFromEvent(event);
}

function handleTouchEnd() {
  if (props.disabled) return;
  if (!props.zoomOnClick) zoomed.value = false;
}

watch(zoomed, scale);

onMounted(() => {
  coarse.value = window.matchMedia("(pointer: coarse)").matches;
});

onBeforeUnmount(() => {
  control?.stop?.();
});
</script>

<template>
  <div
    ref="root"
    role="img"
    data-slot="image-zoom"
    class="relative overflow-hidden"
    :style="{
      width,
      height,
      touchAction: 'manipulation',
      cursor,
    }"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @mousemove="handleMove"
    @click="handleClick"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div
      ref="inner"
      :style="{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transformOrigin: origin,
        willChange: 'transform',
      }"
    >
      <slot />
    </div>
  </div>
</template>
