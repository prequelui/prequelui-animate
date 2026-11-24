<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { value: "overview", label: "Overview", content: "A calm summary of the workspace, its members and the latest activity." },
      { value: "activity", label: "Activity", content: "Every change, in order. Hover a row to see who made it and when." },
      { value: "settings", label: "Settings", content: "Name, visibility and notification preferences for this project." },
    ],
  },
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultValue || props.items[0]?.value || "");
const current = computed(() => props.modelValue ?? internal.value);
const active = computed(
  () => props.items.find((item) => item.value === current.value) ?? props.items[0],
);
const buttons = ref([]);
const indicator = ref({ left: 0, width: 0 });
let observer;

function measure() {
  const index = props.items.findIndex((item) => item.value === current.value);
  const node = buttons.value[index];
  if (!node) return;
  indicator.value = { left: node.offsetLeft, width: node.offsetWidth };
}
function select(value) {
  internal.value = value;
  emit("update:modelValue", value);
}
function onKey(event, index) {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const next = (index + direction + props.items.length) % props.items.length;
  const item = props.items[next];
  if (!item) return;
  select(item.value);
  nextTick(() => buttons.value[next]?.focus());
}
watch(current, () => nextTick(measure));
onMounted(() => {
  measure();
  observer = new ResizeObserver(measure);
  if (buttons.value[0]?.parentElement) observer.observe(buttons.value[0].parentElement);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div class="w-full max-w-[460px]">
    <div role="tablist" aria-label="Tabs" class="relative flex items-center gap-1 rounded-lg bg-accent p-1">
      <span
        aria-hidden="true"
        class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"
        :style="{ left: `${indicator.left}px`, width: `${indicator.width}px` }"
      />
      <button
        v-for="(item, index) in items"
        :key="item.value"
        :ref="(node) => (buttons[index] = node)"
        type="button"
        role="tab"
        :aria-selected="item.value === current"
        :tabindex="item.value === current ? 0 : -1"
        class="relative flex-1 rounded-md px-3 py-1.5 text-[13px] outline-none transition-colors duration-200"
        :class="item.value === current ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'"
        @click="select(item.value)"
        @keydown="onKey($event, index)"
      >
        {{ item.label }}
      </button>
    </div>
    <div class="relative mt-4 min-h-[72px] overflow-hidden">
      <Transition name="tab-panel" mode="out-in">
        <div
          v-if="active"
          :key="active.value"
          role="tabpanel"
          class="rounded-lg border bg-background p-4 text-[13px] leading-6 text-muted-foreground outline-none"
        >
          {{ active.content }}
        </div>
      </Transition>
    </div>
  </div>
</template>

<style>
.tab-panel-enter-active { animation: tab-in 300ms cubic-bezier(0.25, 0.1, 0.35, 1) both; }
.tab-panel-leave-active { animation: tab-out 150ms cubic-bezier(0, 0, 0.58, 1) both; }
@keyframes tab-in { from { opacity: 0; transform: translateX(12px); filter: blur(5px); } }
@keyframes tab-out { to { opacity: 0; transform: translateX(-12px); filter: blur(5px); } }
@media (prefers-reduced-motion: reduce) {
  .tab-panel-enter-active, .tab-panel-leave-active { animation: tab-fade 200ms linear both; }
  @keyframes tab-fade { from { opacity: 0; } to { opacity: 1; } }
}
</style>
