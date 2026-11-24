<script setup>
import { computed, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  from: { type: String, default: "top" },
  tapScale: { type: Number, default: 0.97 },
});

const button = ref(null);
const front = ref(null);
const back = ref(null);

const vertical = computed(() => props.from === "top" || props.from === "bottom");
const axis = computed(() => (vertical.value ? "rotateX" : "rotateY"));
const frontSide = computed(() => props.from === "top" || props.from === "left");

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function place(element, rotate, offset, opacity) {
  if (!element) return;
  const transform = { [axis.value]: rotate, [vertical.value ? "y" : "x"]: offset, opacity };
  animate(
    element,
    transform,
    reduce() ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 20 },
  );
}

function apply(next) {
  const active = next && !reduce();
  const outward = frontSide.value ? "50%" : "-50%";
  place(front.value, active ? 90 : 0, active ? outward : "0%", active ? 0 : 1);
  place(
    back.value,
    active ? 0 : 90,
    active ? "0%" : frontSide.value ? "-50%" : "50%",
    active ? 1 : 0,
  );
}

function leave() {
  release();
  apply(false);
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
    { scale: 1 },
    { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
  );
}
</script>

<template>
  <button
    ref="button"
    type="button"
    data-slot="flip-button"
    :data-from="from"
    class="inline-grid place-items-center rounded-lg text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    style="perspective: 1000px"
    @pointerdown="press"
    @pointerup="release"
    @pointerenter="apply(true)"
    @pointerleave="leave"
  >
    <span
      ref="front"
      data-slot="flip-button-front"
      class="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-primary-foreground"
      style="grid-area: 1 / 1"
    >
      <slot />
    </span>
    <span
      ref="back"
      aria-hidden="true"
      data-slot="flip-button-back"
      class="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-4 text-secondary-foreground"
      style="grid-area: 1 / 1; opacity: 0"
    >
      <slot name="back" />
    </span>
  </button>
</template>
