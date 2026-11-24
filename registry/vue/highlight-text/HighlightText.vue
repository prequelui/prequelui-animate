<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: String, required: true },
  delay: { type: Number, default: 0 },
  color: { type: String, default: "color-mix(in oklab, #f5c542 38%, transparent)" },
  inView: { type: Boolean, default: false },
  inViewOnce: { type: Boolean, default: true },
});

const root = ref(null);
const controls = [];
let observer;
let played = false;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function play() {
  if (played || !root.value) return;
  played = true;
  if (reduce()) {
    root.value.style.backgroundSize = "100% 100%";
    return;
  }
  controls.push(
    animate(
      root.value,
      { backgroundSize: ["0% 100%", "100% 100%"] },
      { duration: 2, ease: [0.42, 0, 0.58, 1], delay: props.delay / 1000 },
    ),
  );
}

onMounted(() => {
  if (!props.inView) {
    play();
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play();
        if (props.inViewOnce) observer?.disconnect();
      } else if (!props.inViewOnce) {
        played = false;
        if (root.value) root.value.style.backgroundSize = "0% 100%";
      }
    },
    { threshold: 0.35 },
  );
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
    data-slot="highlight-text"
    class="relative inline-block"
    :style="{
      backgroundImage: `linear-gradient(${color}, ${color})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left center',
      backgroundSize: '0% 100%',
    }"
  >
    {{ text }}
  </span>
</template>
