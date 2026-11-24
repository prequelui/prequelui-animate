<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  color: { type: String, default: "rgba(255,255,255,0.16)" },
  size: { type: Number, default: 280 },
  intensity: { type: Number, default: 1 },
  alwaysOn: { type: Boolean, default: false },
  as: { type: [String, Object], default: "div" },
});

const root = ref(null);
const light = ref(null);
const active = ref(props.alwaysOn);
const position = { x: 0, y: 0 };
let follow;
let fade;

const gradient = computed(
  () =>
    `radial-gradient(${props.size}px circle at 50% 50%, ${props.color}, transparent 68%)`,
);

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function applyPosition() {
  if (!light.value) return;
  light.value.style.background = `radial-gradient(${props.size}px circle at ${position.x}px ${position.y}px, ${props.color}, transparent 68%)`;
}

function moveTo(x, y) {
  follow?.stop?.();
  follow = animate(
    position,
    { x, y },
    {
      type: "spring",
      stiffness: 260,
      damping: 34,
      mass: 0.5,
      onUpdate: applyPosition,
    },
  );
}

function update(event) {
  if (!root.value) return;
  const rect = root.value.getBoundingClientRect();
  moveTo(event.clientX - rect.left, event.clientY - rect.top);
}

function updateOpacity() {
  if (!light.value) return;
  fade?.stop?.();
  fade = animate(
    light.value,
    {
      opacity:
        active.value && !reduce()
          ? props.intensity
          : props.alwaysOn
            ? props.intensity
            : 0,
    },
    { duration: 0.28, ease: [0.23, 1, 0.32, 1] },
  );
}

function onPointerMove(event) {
  if (event.pointerType === "touch") return;
  update(event);
}

function onPointerEnter(event) {
  if (reduce() || event.pointerType === "touch") return;
  update(event);
  active.value = true;
}

function onPointerLeave() {
  if (props.alwaysOn) return;
  active.value = false;
}

watch(active, updateOpacity);

watch(
  () => props.alwaysOn,
  (value) => {
    active.value = value;
  },
);

onMounted(() => {
  if (props.alwaysOn && root.value) {
    const rect = root.value.getBoundingClientRect();
    position.x = rect.width / 2;
    position.y = rect.height / 2;
    applyPosition();
  }
  updateOpacity();
});

onBeforeUnmount(() => {
  follow?.stop?.();
  fade?.stop?.();
});
</script>

<template>
  <component
    :is="as"
    ref="root"
    data-slot="spotlight-card"
    class="relative isolate overflow-hidden rounded-xl border bg-card text-card-foreground"
    @pointermove="onPointerMove"
    @pointerenter="onPointerEnter"
    @pointerleave="onPointerLeave"
  >
    <span
      ref="light"
      aria-hidden="true"
      data-slot="spotlight-card-light"
      class="pointer-events-none absolute -inset-px z-0 rounded-[inherit]"
      :style="{ background: gradient, opacity: 0 }"
    />
    <span
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-0 rounded-[inherit] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent_38%)] dark:bg-[linear-gradient(180deg,rgba(255,255,255,0.03),transparent_38%)]"
    />
    <div class="relative z-10">
      <slot />
    </div>
  </component>
</template>
