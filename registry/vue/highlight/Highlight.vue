<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { animate } from "motion";

const props = defineProps({
  items: { type: Array, required: true },
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: null },
  hover: { type: Boolean, default: false },
  click: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  activeClassName: { type: String, default: "bg-background shadow-sm" },
  itemClassName: {
    type: String,
    default: "rounded-lg px-4 py-2 text-[13px] font-medium",
  },
  highlightStyle: { type: Object, default: undefined },
  transition: { type: Object, default: undefined },
});

const emit = defineEmits(["update:modelValue", "valueChange"]);

const root = ref(null);
const surface = ref(null);
const internal = ref(props.defaultValue);
const canHover = ref(false);
let controls;
let previous = null;

const options = computed(
  () =>
    props.transition ?? {
      type: "spring",
      stiffness: 500,
      damping: 40,
    },
);

const entries = computed(() =>
  props.items.map((item) =>
    typeof item === "string"
      ? { value: item, label: item }
      : { value: item.value, label: item.label ?? item.value },
  ),
);

const active = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internal.value,
);

function reduce() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function select(next) {
  if (props.disabled) return;
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
  emit("valueChange", next);
}

function onEnter(value) {
  if (props.disabled) return;
  if (props.hover && canHover.value) select(value);
}

function onLeave(value) {
  if (props.disabled) return;
  if (props.hover && canHover.value && active.value === value) select(null);
}

function onClick(value) {
  if (props.disabled) return;
  if (!(props.hover && canHover.value) && props.click) select(value);
}

function position() {
  const value = active.value;
  if (!surface.value || value === null || value === undefined) {
    if (surface.value) surface.value.style.opacity = "0";
    previous = null;
    return;
  }

  const node = root.value?.querySelector(`[data-highlight-value="${value}"]`);
  if (!node || !root.value) return;

  const box = root.value.getBoundingClientRect();
  const rect = node.getBoundingClientRect();
  const next = {
    left: rect.left - box.left,
    top: rect.top - box.top,
    width: rect.width,
    height: rect.height,
  };

  surface.value.style.opacity = "1";

  if (!previous || reduce()) {
    surface.value.style.width = `${next.width}px`;
    surface.value.style.height = `${next.height}px`;
    surface.value.style.transform = `translate(${next.left}px, ${next.top}px)`;
    previous = next;
    return;
  }

  const from = previous;
  previous = next;
  controls?.stop?.();
  controls = animate(
    surface.value,
    {
      width: [from.width, next.width],
      height: [from.height, next.height],
      x: [from.left, next.left],
      y: [from.top, next.top],
    },
    options.value,
  );
}

watch(active, async () => {
  await nextTick();
  position();
});

watch(
  () => props.defaultValue,
  (value) => {
    if (value !== null) internal.value = value;
  },
);

onMounted(() => {
  canHover.value =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  nextTick(position);
});

onBeforeUnmount(() => {
  controls?.stop?.();
});
</script>

<template>
  <div ref="root" data-slot="highlight" class="relative">
    <span
      ref="surface"
      aria-hidden="true"
      data-slot="highlight-surface"
      :class="['pointer-events-none absolute left-0 top-0 z-0 rounded-[inherit]', activeClassName]"
      :style="{ opacity: 0, ...(highlightStyle ?? {}) }"
    />
    <button
      v-for="entry in entries"
      :key="entry.value"
      type="button"
      data-slot="highlight-item"
      :data-value="entry.value"
      :data-highlight-value="entry.value"
      :data-active="active === entry.value ? 'true' : 'false'"
      :aria-pressed="active === entry.value"
      :class="['relative z-[1]', itemClassName]"
      @click="onClick(entry.value)"
      @pointerenter="onEnter(entry.value)"
      @pointerleave="onLeave(entry.value)"
    >
      {{ entry.label }}
    </button>
  </div>
</template>
