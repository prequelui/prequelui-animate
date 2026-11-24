<script setup>
import { nextTick, onBeforeUnmount, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  label: { type: String, default: "" },
  dotSize: { type: Number, default: 12 },
  labelGap: { type: Number, default: 14 },
  hideNative: { type: Boolean, default: true },
});

const root = ref(null);
const dot = ref(null);
const tip = ref(null);
const inside = ref(false);
let showControls = [];
let tipControls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

async function show() {
  inside.value = true;
  await nextTick();
  if (!dot.value) return;
  const options = reduce()
    ? { duration: 0 }
    : { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 };
  showControls = [
    animate(dot.value, { scale: [0, 1], opacity: [0, 1] }, options),
  ];
  if (tip.value) {
    showControls.push(
      animate(
        tip.value,
        { scale: [0.8, 1], opacity: [0, 1] },
        reduce()
          ? { duration: 0 }
          : { type: "spring", stiffness: 550, damping: 46.9, restSpeed: 10 },
      ),
    );
  }
}

function hide() {
  if (!dot.value) return;
  const options = reduce()
    ? { duration: 0 }
    : { type: "spring", stiffness: 550, damping: 46.9, restSpeed: 10 };
  const controls = [animate(dot.value, { scale: 0, opacity: 0 }, options)];
  if (tip.value) {
    controls.push(animate(tip.value, { scale: 0.8, opacity: 0 }, options));
  }
  Promise.all(controls.map((control) => control.finished)).then(() => {
    inside.value = false;
  });
}

function move(event) {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  if (dot.value) {
    dot.value.style.transform = `translate3d(${x - props.dotSize / 2}px, ${y - props.dotSize / 2}px, 0)`;
  }
  if (tip.value) {
    tipControls?.stop?.();
    tipControls = animate(
      tip.value,
      { x: x + props.labelGap, y: y + props.labelGap - 8 },
      reduce()
        ? { duration: 0 }
        : { type: "spring", stiffness: 500, damping: 50, bounce: 0 },
    );
  }
}

onBeforeUnmount(() => {
  showControls.forEach((control) => control.stop?.());
  tipControls?.stop?.();
});
</script>

<template>
  <div
    ref="root"
    data-slot="cursor"
    :class="['relative', hideNative ? 'cursor-none' : '']"
    @pointermove="move"
    @pointerenter="show"
    @pointerleave="hide"
  >
    <slot />
    <template v-if="inside">
      <span
        ref="dot"
        aria-hidden="true"
        data-slot="cursor-dot"
        class="pointer-events-none absolute left-0 top-0 z-50 rounded-full bg-foreground"
        :style="{ width: `${dotSize}px`, height: `${dotSize}px`, opacity: 0 }"
      />
      <span
        v-if="label"
        ref="tip"
        aria-hidden="true"
        data-slot="cursor-label"
        class="pointer-events-none absolute left-0 top-0 z-50 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[13px] font-medium text-background"
        style="opacity: 0"
      >
        {{ label }}
      </span>
    </template>
  </div>
</template>
