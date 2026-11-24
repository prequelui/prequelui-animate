<script setup>
import { computed, ref } from "vue";
import { animate } from "motion";
import { Monitor, Moon, Sun } from "@lucide/vue";

const props = defineProps({
  theme: { type: String, default: "light" },
  resolvedTheme: { type: String, default: "light" },
  modes: {
    type: Array,
    default: () => ["light", "dark", "system"],
  },
});
const emit = defineEmits(["update:theme", "click"]);

const button = ref(null);

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function press() {
  if (!button.value || reduce()) return;
  animate(
    button.value,
    { scale: 0.97 },
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

const next = computed(() => {
  let index = props.modes.indexOf(props.theme);
  if (index === -1) index = props.modes.indexOf(props.resolvedTheme);
  if (index === -1) return props.modes[0] ?? props.resolvedTheme;
  return props.modes[(index + 1) % props.modes.length];
});

const iconClass = (name) => [
  "absolute inset-0 size-4 transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
  props.theme === name
    ? "rotate-0 scale-100 opacity-100 blur-0"
    : "-rotate-90 scale-50 opacity-0 blur-[2px]",
];

function click(event) {
  emit("click", event);
  if (event.defaultPrevented) return;
  emit("update:theme", next.value);
}
</script>

<template>
  <button
    ref="button"
    type="button"
    data-slot="theme-toggler-button"
    :data-theme="theme"
    :aria-label="`Switch to ${next} theme`"
    class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border bg-background px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    @click="click"
    @pointerdown="press"
    @pointerup="release"
    @pointerleave="release"
  >
    <span class="relative inline-flex size-4 items-center justify-center">
      <Sun aria-hidden="true" :class="iconClass('light')" />
      <Moon aria-hidden="true" :class="iconClass('dark')" />
      <Monitor aria-hidden="true" :class="iconClass('system')" />
    </span>
    <slot>{{ theme }}</slot>
  </button>
</template>
