<script setup>
import { ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  hoverScale: { type: Number, default: 1 },
  tapScale: { type: Number, default: 0.97 },
  type: { type: String, default: "button" },
  disabled: { type: Boolean, default: false },
});

const button = ref(null);
let hovered = false;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function move(scale, spring = true) {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale },
    spring
      ? { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 }
      : { duration: 0 },
  );
}

function press() {
  if (!props.disabled) move(props.tapScale);
}

function release() {
  move(hovered && props.hoverScale !== 1 ? props.hoverScale : 1);
}

function enter() {
  hovered = true;
  if (props.hoverScale !== 1) move(props.hoverScale);
}

function leave() {
  hovered = false;
  move(1);
}
</script>

<template>
  <button
    ref="button"
    data-slot="button"
    :type="type"
    :disabled="disabled"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
    @pointerdown="press"
    @pointerup="release"
    @pointerleave="leave"
    @pointerenter="enter"
  >
    <slot />
  </button>
</template>
