<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  delay: { type: Number, default: 0 },
  initialOpacity: { type: Number, default: 0 },
  opacity: { type: Number, default: 1 },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
  inViewMargin: { type: String, default: "0px" },
  transition: { type: Object, default: undefined },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
const initial = computed(() => props.initialOpacity);
let observer;
let controls;

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
    { opacity: [props.initialOpacity, props.opacity] },
    options(),
  );
}

function reset() {
  if (!root.value) return;
  controls?.stop?.();
  controls = animate(root.value, { opacity: props.initialOpacity }, { duration: 0 });
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
    data-slot="fade"
    :style="{ opacity: initial }"
  >
    <slot />
  </component>
</template>
