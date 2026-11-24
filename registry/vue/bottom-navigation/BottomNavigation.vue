<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";
import { animate } from "motion";
import { Bell, Compass, Home, User } from "@lucide/vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { value: "home", label: "Home", icon: Home },
      { value: "explore", label: "Explore", icon: Compass },
      { value: "alerts", label: "Alerts", icon: Bell },
      { value: "you", label: "You", icon: User },
    ],
  },
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: "" },
  hideOnScroll: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const selectionSpring = { type: "spring", stiffness: 300, damping: 30 };

const nav = ref(null);
const indicator = ref(null);
const buttons = [];
const internal = ref(props.defaultValue || props.items[0]?.value || "");
const hidden = ref(false);
let lastY = 0;
let observer;
let currentLeft = 0;
let currentWidth = 0;

const current = computed(() => props.modelValue ?? internal.value);

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function select(value) {
  internal.value = value;
  emit("update:modelValue", value);
}

function activeIndex() {
  return props.items.findIndex((item) => item.value === current.value);
}

function measure(animated) {
  const index = activeIndex();
  const node = buttons[index];
  if (!node || !indicator.value) return;

  const left = node.offsetLeft;
  const width = node.offsetWidth;
  if (!animated || reduce()) {
    currentLeft = left;
    currentWidth = width;
    indicator.value.style.left = `${left}px`;
    indicator.value.style.width = `${width}px`;
    return;
  }

  animate(
    indicator.value,
    {
      left: [currentLeft, left],
      width: [currentWidth, width],
    },
    selectionSpring,
  );
  currentLeft = left;
  currentWidth = width;
}

function onScroll() {
  const y = window.scrollY;
  hidden.value = y > 24 && y > lastY;
  lastY = y;
}

watch(current, () => nextTick(() => measure(true)));

watch(hidden, (value) => {
  if (!nav.value) return;
  animate(
    nav.value,
    { y: value && !reduce() ? 110 : 0 },
    reduce() ? { duration: 0 } : selectionSpring,
  );
});

onMounted(() => {
  nextTick(() => measure(false));
  if (nav.value) {
    observer = new ResizeObserver(() => measure(false));
    observer.observe(nav.value);
  }
  if (props.hideOnScroll) {
    window.addEventListener("scroll", onScroll, { passive: true });
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("scroll", onScroll);
});
</script>

<template>
  <nav
    ref="nav"
    data-slot="bottom-navigation"
    class="relative flex w-full max-w-[340px] items-center justify-between gap-1 rounded-2xl border bg-background p-1.5 shadow-sm"
  >
    <span
      ref="indicator"
      aria-hidden="true"
      class="absolute bottom-1.5 top-1.5 z-0 rounded-xl bg-accent"
      style="left: 0; width: 0"
    />
    <button
      v-for="(item, index) in items"
      :key="item.value"
      :ref="(node) => (buttons[index] = node)"
      type="button"
      :aria-current="current === item.value ? 'page' : undefined"
      :data-state="current === item.value ? 'active' : 'inactive'"
      class="relative z-10 flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40"
      :class="
        current === item.value
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground'
      "
      @click="select(item.value)"
    >
      <span class="relative flex items-center justify-center [&_svg]:size-4">
        <component :is="item.icon" v-if="item.icon" aria-hidden="true" />
      </span>
      <span class="relative text-[13px] font-medium">{{ item.label }}</span>
    </button>
  </nav>
</template>
