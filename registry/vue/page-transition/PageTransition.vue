<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  pageKey: { type: [String, Number], required: true },
  duration: { type: Number, default: 0.55 },
  from: { type: String, default: "top" },
  fade: { type: Boolean, default: true },
});

const root = ref(null);
let controls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function hiddenClip() {
  if (props.from === "bottom") return "inset(100% 0 0 0)";
  if (props.from === "left") return "inset(0 100% 0 0)";
  if (props.from === "right") return "inset(0 0 0 100%)";
  return "inset(0 0 100% 0)";
}

async function play() {
  await nextTick();
  if (!root.value) return;
  controls?.stop?.();
  if (reduce()) {
    animate(
      root.value,
      { opacity: [0, 1] },
      { duration: 0.2, ease: [0.77, 0, 0.175, 1] },
    );
    return;
  }
  controls = animate(
    root.value,
    {
      clipPath: [hiddenClip(), "inset(0 0 0% 0)"],
      opacity: props.fade ? [0.6, 1] : 1,
    },
    { duration: props.duration, ease: [0.77, 0, 0.175, 1] },
  );
}

onMounted(play);
watch(() => props.pageKey, play);
</script>

<template>
  <div ref="root" data-slot="page-transition" class="min-w-0">
    <slot />
  </div>
</template>
