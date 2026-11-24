<script setup>
import { nextTick, onMounted, ref, watch } from "vue";
import { animate } from "motion";
import { ChevronLeft, ChevronRight } from "@lucide/vue";

const props = defineProps({
  pages: { type: Number, default: 5 },
  defaultPage: { type: Number, default: 1 },
  modelValue: { type: Number, default: undefined },
});
const emit = defineEmits(["update:modelValue"]);

const current = ref(props.modelValue ?? props.defaultPage);
const buttons = ref({});
const indicator = ref(null);

watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) current.value = value;
  },
);

const reduce = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function place(animated) {
  const target = buttons.value[current.value];
  if (!target || !indicator.value) return;
  const x = target.offsetLeft;
  const width = target.offsetWidth;
  if (!animated || reduce()) {
    indicator.value.style.transform = `translateX(${x}px)`;
    indicator.value.style.width = `${width}px`;
    return;
  }
  animate(indicator.value, { x, width }, { type: "spring", stiffness: 500, damping: 40 });
}

function go(next) {
  const value = Math.min(props.pages, Math.max(1, next));
  if (props.modelValue === undefined) current.value = value;
  emit("update:modelValue", value);
  nextTick(() => place(true));
}

onMounted(() => nextTick(() => place(false)));
</script>

<template>
  <nav aria-label="Pagination" class="relative flex items-center gap-1">
    <button type="button" aria-label="Previous page" :disabled="current === 1"
      class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40"
      @click="go(current - 1)">
      <ChevronLeft class="size-4" />
    </button>
    <span ref="indicator" class="absolute inset-y-0 left-0 rounded-md border bg-background shadow-sm" aria-hidden="true" />
    <button
      v-for="item in pages"
      :key="item"
      :ref="(node) => (buttons[item] = node)"
      type="button"
      :aria-current="item === current ? 'page' : undefined"
      class="relative flex size-8 items-center justify-center rounded-md text-[13px] font-medium"
      :class="item === current ? 'text-foreground' : 'text-muted-foreground'"
      @click="go(item)"
    >
      {{ item }}
    </button>
    <button type="button" aria-label="Next page" :disabled="current === pages"
      class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40"
      @click="go(current + 1)">
      <ChevronRight class="size-4" />
    </button>
  </nav>
</template>
