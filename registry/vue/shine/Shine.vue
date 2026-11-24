<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  color: { type: String, default: "currentColor" },
  opacity: { type: Number, default: 0.3 },
  delay: { type: Number, default: 0 },
  duration: { type: Number, default: 1200 },
  loop: { type: Boolean, default: false },
  loopDelay: { type: Number, default: 0 },
  deg: { type: Number, default: -15 },
  enable: { type: Boolean, default: true },
  enableOnHover: { type: Boolean, default: false },
  enableOnTap: { type: Boolean, default: false },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
const overlay = ref(null);
const run = ref(0);
const hovered = ref(false);
const reduced = ref(false);
let timer;
let control;

const active = computed(() => props.enable && !reduced.value);
const alwaysOn = computed(
  () => active.value && !props.enableOnHover && !props.enableOnTap,
);

function clearTimer() {
  clearTimeout(timer);
  timer = undefined;
}

function play() {
  run.value += 1;
}

function scheduleNext() {
  clearTimer();
  const on = alwaysOn.value || (props.enableOnHover && hovered.value);
  if (!props.loop || !on) return;
  timer = setTimeout(play, props.loopDelay);
}

function handleEnter() {
  if (!active.value || !props.enableOnHover || alwaysOn.value) return;
  hovered.value = true;
  play();
}

function handleLeave() {
  if (!active.value || !props.enableOnHover || alwaysOn.value) return;
  hovered.value = false;
  clearTimer();
}

function handleDown() {
  if (!active.value || !props.enableOnTap || alwaysOn.value) return;
  play();
}

watch(
  () => [alwaysOn.value, props.loop, props.loopDelay],
  () => {
    clearTimer();
    run.value = alwaysOn.value ? 1 : 0;
  },
);

watch(run, async () => {
  await nextTick();
  if (!overlay.value) return;
  control?.stop?.();
  control = animate(
    overlay.value,
    { x: ["-100%", "100%"], skewX: props.deg },
    {
      duration: props.duration / 1000,
      ease: [0.4, 0, 0.2, 1],
      delay: props.delay / 1000,
    },
  );
  control.finished.then(scheduleNext, scheduleNext);
});

onMounted(() => {
  reduced.value = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  run.value = alwaysOn.value ? 1 : 0;
});

onBeforeUnmount(() => {
  clearTimer();
  control?.stop?.();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="shine"
    class="relative overflow-hidden"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @pointerdown="handleDown"
  >
    <slot />
    <span
      v-if="active && run > 0"
      :key="run"
      ref="overlay"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 block h-full w-full"
      :style="{
        background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        opacity,
      }"
    />
  </component>
</template>
