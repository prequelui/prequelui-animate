<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  text: { type: String, required: true },
  gradient: {
    type: String,
    default:
      "linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)",
  },
  neon: { type: Boolean, default: false },
});

const root = ref(null);
const layer = ref(null);
const glow = ref(null);
const controls = [];
let observer;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function play() {
  if (reduce()) return;
  for (const node of [layer.value, glow.value]) {
    if (!node) continue;
    controls.push(
      animate(
        node,
        { backgroundPosition: ["0% 0%", "500% 100%"] },
        { duration: 50, repeat: Infinity, ease: "linear" },
      ),
    );
  }
}

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      play();
      observer?.disconnect();
    }
  });
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  controls.forEach((control) => control.stop?.());
});
</script>

<template>
  <span ref="root" data-slot="gradient-text" class="relative inline-block">
    <span
      ref="layer"
      class="inline-block bg-clip-text text-transparent"
      :style="{ backgroundImage: gradient, backgroundSize: '700% 100%' }"
    >
      {{ text }}
    </span>
    <span
      v-if="neon"
      ref="glow"
      aria-hidden="true"
      class="absolute inset-0 inline-block bg-clip-text text-transparent"
      :style="{
        backgroundImage: gradient,
        backgroundSize: '700% 100%',
        mixBlendMode: 'plus-lighter',
        filter: 'blur(8px)',
      }"
    >
      {{ text }}
    </span>
  </span>
</template>
