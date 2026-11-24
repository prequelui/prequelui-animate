<script setup>
import { computed, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  delay: { type: String, default: "0.3s" },
  fillHeight: { type: String, default: "3px" },
  hoverScale: { type: Number, default: 1 },
  tapScale: { type: Number, default: 0.97 },
});

const button = ref(null);
const fill = ref(null);
const hovered = ref(false);
const seconds = computed(() => Number.parseFloat(props.delay) || 0.3);

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function paint(next) {
  hovered.value = next;
  if (!fill.value) return;
  const active = next && !reduce();
  animate(
    fill.value,
    { scaleY: active ? 1 : 0.06, opacity: active ? 1 : 0.55 },
    reduce() ? { duration: 0 } : { duration: seconds.value, ease: [0.25, 0.1, 0.35, 1] },
  );
}

function press() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: props.tapScale },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

function release() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: hovered.value && props.hoverScale !== 1 ? props.hoverScale : 1 },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}

function leave() {
  paint(false);
  release();
}
</script>

<template>
  <button
    ref="button"
    type="button"
    data-slot="liquid-button"
    class="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-background px-4 text-[13px] font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    @pointerenter="paint(true)"
    @pointerleave="leave"
    @focus="paint(true)"
    @blur="paint(false)"
    @pointerdown="press"
    @pointerup="release"
  >
    <span
      ref="fill"
      aria-hidden="true"
      class="pointer-events-none absolute inset-x-0 bottom-0 origin-bottom bg-primary"
      :style="{ height: hovered ? '100%' : fillHeight, opacity: 0.55 }"
    />
    <span
      class="relative z-10 transition-colors"
      :class="hovered && !reduce() ? 'text-primary-foreground' : 'text-foreground'"
      :style="{ transitionDuration: `${seconds}s` }"
    >
      <slot />
    </span>
  </button>
</template>
