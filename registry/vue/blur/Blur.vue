<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  delay: { type: Number, default: 0 },
  initialBlur: { type: Number, default: 10 },
  blur: { type: Number, default: 0 },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
  inViewMargin: { type: String, default: "0px" },
  transition: { type: Object, default: undefined },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
const initialFilter = computed(
  () => `blur(${reduce() ? 0 : props.initialBlur}px)`,
);
let observer;
let controls;

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function options() {
  const base = props.transition ?? {
    type: "spring",
    stiffness: 200,
    damping: 20,
  };
  return {
    ...base,
    delay: (base.delay ?? 0) + props.delay / 1000,
  };
}

function play() {
  if (!root.value) return;
  controls?.stop?.();
  controls = animate(
    root.value,
    { filter: [initialFilter.value, `blur(${props.blur}px)`] },
    options(),
  );
}

function reset() {
  if (!root.value) return;
  controls?.stop?.();
  controls = animate(
    root.value,
    { filter: `blur(${reduce() ? 0 : props.initialBlur}px)` },
    { duration: 0 },
  );
}

onMounted(() => {
  if (!props.inView) {
    play();
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.some((entry) => entry.isIntersecting);
      if (visible) {
        play();
        if (props.inViewOnce) observer?.disconnect();
      } else if (!props.inViewOnce) {
        reset();
      }
    },
    { threshold: 0.35, rootMargin: props.inViewMargin },
  );
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  controls?.stop?.();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="blur"
    :style="{ filter: initialFilter }"
  >
    <slot />
  </component>
</template>
