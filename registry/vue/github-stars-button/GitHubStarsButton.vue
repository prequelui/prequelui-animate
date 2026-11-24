<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";
import { GitBranch, Star } from "@lucide/vue";

const props = defineProps({
  username: { type: String, default: "prequelui" },
  repo: { type: String, default: "prequelui-animate" },
  value: { type: Number, default: 0 },
  delay: { type: Number, default: 0 },
  inView: { type: Boolean, default: true },
});

const root = ref(null);
const star = ref(null);
const particles = ref(null);
const starred = ref(false);
const burst = ref(0);
const count = ref(
  typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? props.value
    : 0,
);
let started = false;
let observer;
let controls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function startCount() {
  if (started) return;
  started = true;
  if (reduce()) {
    count.value = props.value;
    return;
  }
  controls = animate(0, props.value, {
    type: "spring",
    stiffness: 90,
    damping: 50,
    delay: props.delay / 1000,
    onUpdate: (latest) => (count.value = Math.round(latest)),
  });
}

onMounted(() => {
  if (!props.inView) {
    startCount();
    return;
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        startCount();
        observer?.disconnect();
      }
    },
    { threshold: 0.4 },
  );
  if (root.value) observer.observe(root.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  controls?.stop?.();
});

async function toggle() {
  starred.value = !starred.value;
  count.value += starred.value ? 1 : -1;
  burst.value += 1;
  if (reduce()) return;
  if (star.value) {
    animate(
      star.value,
      { scale: [1, 1.35, 1], rotate: [0, 12, 0] },
      { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
    );
  }
  await nextTick();
  const nodes = particles.value?.children ?? [];
  Array.from(nodes).forEach((node, index) => {
    const angle = (index / nodes.length) * Math.PI * 2;
    animate(
      node,
      {
        opacity: [1, 0],
        x: Math.cos(angle) * 26,
        y: Math.sin(angle) * 26,
        scale: 0.35,
      },
      { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
    );
  });
}
</script>

<template>
  <button
    ref="root"
    type="button"
    data-slot="github-stars-button"
    :aria-label="`Star ${username}/${repo} on GitHub`"
    class="relative inline-flex h-9 items-center gap-2 overflow-visible rounded-lg border bg-background px-3 text-[13px] font-medium"
    @click="toggle"
  >
    <GitBranch class="size-4" aria-hidden="true" />
    <span>Star</span>
    <span class="h-4 w-px bg-border" aria-hidden="true" />
    <span class="relative flex items-center gap-1 tabular-nums text-muted-foreground">
      <span ref="star" class="inline-flex">
        <Star
          class="size-3.5 transition-colors duration-300"
          :class="starred ? 'fill-[#f5b301] text-[#f5b301]' : 'text-muted-foreground'"
        />
      </span>
      {{ count.toLocaleString("en-US") }}
    </span>
    <span ref="particles" class="pointer-events-none absolute right-3 top-1/2" aria-hidden="true">
      <span
        v-for="index in 6"
        :key="`${burst}-${index}`"
        class="absolute size-1 rounded-full bg-[#f5b301] opacity-0"
      />
    </span>
  </button>
</template>
