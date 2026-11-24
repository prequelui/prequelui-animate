<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { animate } from "motion";

const HOST = 'a, button, [role="button"], [role="link"]';

const props = defineProps({
  text: { type: String, required: true },
  direction: { type: String, default: "down" },
  trigger: { type: String, default: "hover" },
});

const root = ref(null);
const track = ref(null);
let host = null;
let offset = 0;
let controls;

const sign = () => (props.direction === "down" ? 1 : -1);

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function slideTo(next) {
  if (!track.value) return;
  const lap = sign() * next;
  const transform =
    lap === 0 ? "translateY(0%)" : `translateY(calc(${lap * 100}% + ${lap} * 0.6em))`;
  controls?.stop?.();
  controls = animate(
    track.value,
    { transform },
    reduce() ? { duration: 0 } : { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
  );
}

function enter(event) {
  if (props.trigger !== "hover" || event.pointerType === "touch") return;
  slideTo(true);
}

function leave(event) {
  if (props.trigger !== "hover" || event.pointerType === "touch") return;
  slideTo(false);
}

function click() {
  if (props.trigger !== "click") return;
  offset += 1;
  slideTo(offset % 2 === 1);
}

onMounted(() => {
  const parent = root.value?.parentElement;
  host = parent?.closest(HOST) ?? root.value;
  if (!host) return;
  host.addEventListener("pointerenter", enter);
  host.addEventListener("pointerleave", leave);
  host.addEventListener("click", click);
});

onBeforeUnmount(() => {
  controls?.stop?.();
  if (!host) return;
  host.removeEventListener("pointerenter", enter);
  host.removeEventListener("pointerleave", leave);
  host.removeEventListener("click", click);
});
</script>

<template>
  <span
    ref="root"
    data-slot="sliding-text"
    :data-direction="direction"
    :data-trigger="trigger"
    class="relative inline-block overflow-clip"
    style="padding-block: 0.25em; margin-block: -0.25em"
  >
    <span
      ref="track"
      data-slot="sliding-text-track"
      class="relative inline-block"
      style="transform: translateY(0%)"
    >
      {{ text }}
      <span
        data-slot="sliding-text-copy"
        aria-hidden="true"
        class="absolute left-0 w-full"
        :style="{ top: `calc(${-sign() * 100}% - ${sign()} * 0.6em)` }"
      >{{ text }}</span>
    </span>
  </span>
</template>
