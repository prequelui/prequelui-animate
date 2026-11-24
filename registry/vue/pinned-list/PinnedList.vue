<script>
const fallbackItems = [
  { id: "aurora", label: "Aurora", pinned: true },
  { id: "atlas", label: "Atlas", pinned: true },
  { id: "beacon", label: "Beacon", pinned: false },
  { id: "canvas", label: "Canvas", pinned: false },
];
</script>

<script setup>
import { computed, nextTick, onBeforeUnmount, ref } from "vue";
import { animate } from "motion";
import { Pin, PinOff } from "@lucide/vue";

const props = defineProps({
  items: { type: Array, default: undefined },
  defaultItems: { type: Array, default: () => fallbackItems },
  pinnedLabel: { type: String, default: "Pinned" },
  unpinnedLabel: { type: String, default: "Everything else" },
});
const emit = defineEmits(["itemsChange"]);

const pinnedSpring = { type: "spring", stiffness: 320, damping: 25, mass: 0.8 };

const root = ref(null);
const movingId = ref(null);
const internal = ref(
  (props.items ?? props.defaultItems).map((item) => ({ ...item })),
);

const list = computed(() => props.items ?? internal.value);
const groups = computed(() => [
  { key: true, title: props.pinnedLabel },
  { key: false, title: props.unpinnedLabel },
]);

function filtered(pinned) {
  return list.value.filter((item) => item.pinned === pinned);
}

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function readRects() {
  const elements = {};
  const rects = {};
  if (!root.value) return { elements, rects };
  root.value.querySelectorAll("[data-pinned-id]").forEach((element) => {
    const id = element.getAttribute("data-pinned-id");
    elements[id] = element;
    rects[id] = element.getBoundingClientRect();
  });
  return { elements, rects };
}

function toggle(id) {
  const before = readRects();

  const next = list.value.map((item) =>
    item.id === id ? { ...item, pinned: !item.pinned } : item,
  );
  if (props.items === undefined) internal.value = next;
  emit("itemsChange", next);

  if (reduce()) return;

  movingId.value = id;
  nextTick(() => {
    const after = readRects();
    const controls = [];
    for (const [key, element] of Object.entries(after.elements)) {
      const old = before.rects[key];
      if (!old) continue;
      const now = after.rects[key];
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      controls.push(
        animate(element, { x: [dx, 0], y: [dy, 0] }, pinnedSpring),
      );
    }
    Promise.all(controls.map((control) => control.finished)).then(() => {
      if (movingId.value === id) movingId.value = null;
    });
  });
}

onBeforeUnmount(() => {
  movingId.value = null;
});
</script>

<template>
  <div ref="root" data-slot="pinned-list" class="w-full max-w-[300px] space-y-4">
    <div v-for="group in groups" :key="group.title">
      <p
        class="mb-1.5 text-[13px] uppercase tracking-[0.14em] text-muted-foreground"
      >
        {{ group.title }}
      </p>
      <div class="min-h-9 space-y-1">
        <button
          v-for="item in filtered(group.key)"
          :key="item.id"
          type="button"
          :data-pinned-id="item.id"
          :style="{ zIndex: movingId === item.id ? 10 : 1 }"
          class="relative flex w-full items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-left text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
          @click="toggle(item.id)"
        >
          <span class="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              class="text-muted-foreground transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
              :style="{
                opacity: item.pinned ? 1 : 0,
                transform: item.pinned ? 'scale(1)' : 'scale(0.8)',
              }"
            >
              <Pin class="size-3" />
            </span>
            <span class="truncate">{{ item.label }}</span>
          </span>
          <span class="flex items-center gap-1 text-[13px] text-muted-foreground">
            <component :is="item.pinned ? PinOff : Pin" class="size-3" />
            {{ item.pinned ? "Unpin" : "Pin" }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
