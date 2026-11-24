<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  target: { type: Object, default: null },
  barClass: { type: String, default: "" },
});

const bar = ref(null);
let controls;
let scroller;
let resizeHandler;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (value) => Math.min(1, Math.max(0, value));

function resolveTarget() {
  const node = props.target;
  if (!node) return null;
  return node.value !== undefined ? node.value : node;
}

function read() {
  if (!bar.value || typeof window === "undefined") return;
  const element = resolveTarget();
  let value = 0;

  if (element && typeof element.scrollHeight === "number") {
    const max = element.scrollHeight - element.clientHeight;
    value = max > 0 ? clamp(element.scrollTop / max) : 0;
  } else {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    value = max > 0 ? clamp(window.scrollY / max) : 0;
  }

  const nextConfig = { type: "spring", stiffness: 250, damping: 40, bounce: 0 };
  controls?.stop?.();
  if (reduce()) {
    bar.value.style.transform = `scaleX(${value})`;
    return;
  }
  controls = animate(bar.value, { scaleX: value }, nextConfig);
}

onMounted(() => {
  scroller = resolveTarget() || window;
  read();
  scroller.addEventListener("scroll", read, { passive: true });
  resizeHandler = () => read();
  window.addEventListener("resize", resizeHandler);
});

onBeforeUnmount(() => {
  controls?.stop?.();
  scroller?.removeEventListener?.("scroll", read);
  window.removeEventListener("resize", resizeHandler);
});
</script>

<template>
  <div
    role="progressbar"
    aria-label="Scroll progress"
    data-slot="scroll-progress"
    class="h-1 w-full overflow-hidden bg-accent"
  >
    <div
      ref="bar"
      class="h-full origin-left bg-foreground"
      :class="barClass"
      style="transform: scaleX(0)"
    />
  </div>
</template>
