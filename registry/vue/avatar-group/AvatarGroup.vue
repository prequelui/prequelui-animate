<script setup>
import { nextTick, onBeforeUnmount, ref } from "vue";
import { animate } from "motion";

const props = defineProps({
  avatars: {
    type: Array,
    default: () => [
      { name: "Mina", color: "from-rose-300 to-orange-200" },
      { name: "Theo", color: "from-sky-300 to-indigo-200" },
      { name: "Iris", color: "from-emerald-300 to-lime-200" },
      { name: "Noé", color: "from-amber-300 to-pink-200" },
    ],
  },
  invertOverlap: { type: Boolean, default: false },
  tooltipSideOffset: { type: Number, default: 8 },
});

const avatarSpring = { type: "spring", stiffness: 300, damping: 17 };
const popSpring = { type: "spring", stiffness: 400, damping: 29 };

const root = ref(null);
const tip = ref(null);
const hovered = ref(null);
const center = ref(0);
const showTip = ref(false);
const items = [];

let liftControls = [];
let tipControls;

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function lift() {
  liftControls.forEach((control) => control.stop?.());
  liftControls = [];
  items.forEach((element, index) => {
    if (!element) return;
    const up = hovered.value === index && !reduce();
    liftControls.push(
      animate(
        element,
        { y: up ? "-30%" : "0%" },
        reduce() ? { duration: 0 } : avatarSpring,
      ),
    );
  });
}

function enter(index, event) {
  const element = event.currentTarget;
  if (root.value && element) {
    const groupRect = root.value.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    center.value = rect.left - groupRect.left + rect.width / 2;
  }

  if (hovered.value !== index) {
    hovered.value = index;
    lift();
  }

  if (showTip.value) return;
  showTip.value = true;
  nextTick(() => {
    if (!tip.value) return;
    tipControls?.stop?.();
    if (reduce()) {
      tip.value.style.opacity = "1";
      return;
    }
    tip.value.style.opacity = "0";
    tipControls = animate(
      tip.value,
      { opacity: [0, 1], scale: [0.9, 1], filter: ["blur(4px)", "blur(0px)"] },
      popSpring,
    );
  });
}

function leaveGroup() {
  hovered.value = null;
  lift();
  if (!tip.value) {
    showTip.value = false;
    return;
  }
  tipControls?.stop?.();
  if (reduce()) {
    showTip.value = false;
    return;
  }
  tipControls = animate(tip.value, { opacity: 0, scale: 0.95 }, { duration: 0.12 });
  tipControls.finished.then(() => {
    if (hovered.value === null) showTip.value = false;
  });
}

onBeforeUnmount(() => {
  liftControls.forEach((control) => control.stop?.());
  tipControls?.stop?.();
});
</script>

<template>
  <div
    ref="root"
    data-slot="avatar-group"
    class="relative inline-flex items-end"
    @pointerleave="leaveGroup"
  >
    <div class="flex -space-x-3">
      <span
        v-for="(avatar, index) in avatars"
        :key="avatar.id || avatar.name || index"
        :ref="(node) => (items[index] = node)"
        role="img"
        :aria-label="avatar.name"
        :tabindex="0"
        :style="{ zIndex: invertOverlap ? 20 - index : index }"
        class="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-gradient-to-br text-[13px] font-medium text-black/70 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        :class="avatar.color || 'from-rose-300 to-orange-200'"
        @pointerenter="enter(index, $event)"
        @focus="enter(index, $event)"
      >
        <img
          v-if="avatar.src"
          :src="avatar.src"
          alt=""
          class="size-full object-cover"
        />
        <template v-else>{{ avatar.name.slice(0, 1) }}</template>
      </span>
    </div>

    <span
      v-if="showTip"
      ref="tip"
      role="tooltip"
      :style="{
        left: `${center}px`,
        bottom: `calc(100% + ${tooltipSideOffset}px)`,
        translate: '-50% 0',
        opacity: 0,
      }"
      class="pointer-events-none absolute z-30 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md"
    >
      {{ hovered !== null ? avatars[hovered]?.name : "" }}
    </span>
  </div>
</template>
