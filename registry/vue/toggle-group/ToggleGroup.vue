<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const props = defineProps({
  items: { type: Array, default: () => ["day", "week", "month"] },
  type: { type: String, default: "single" },
  modelValue: { type: [String, Array], default: undefined },
  defaultValue: { type: [String, Array], default: undefined },
});
const emit = defineEmits(["update:modelValue"]);

const options = computed(() =>
  props.items.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
);
const asArray = (value) => (value === undefined ? [] : Array.isArray(value) ? value : [value]);
const internal = ref(asArray(props.defaultValue ?? options.value[0]?.value));
const selected = computed(() => asArray(props.modelValue ?? internal.value));
const buttons = ref([]);
const indicator = ref({ left: 0, width: 0 });
let observer;

function measure() {
  const index = options.value.findIndex((item) => selected.value.includes(item.value));
  const node = buttons.value[index];
  if (!node) return;
  indicator.value = { left: node.offsetLeft, width: node.offsetWidth };
}
function toggle(value) {
  let result;
  if (props.type === "single") result = selected.value.includes(value) ? [] : [value];
  else
    result = selected.value.includes(value)
      ? selected.value.filter((entry) => entry !== value)
      : [...selected.value, value];
  internal.value = result;
  emit("update:modelValue", props.type === "single" ? result[0] ?? "" : result);
  nextTick(measure);
}
watch(selected, () => nextTick(measure));
onMounted(() => {
  measure();
  observer = new ResizeObserver(measure);
  if (buttons.value[0]?.parentElement) observer.observe(buttons.value[0].parentElement);
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <div role="group" class="relative flex items-center rounded-lg bg-accent p-1">
    <span
      v-if="type === 'single' && selected.length"
      aria-hidden="true"
      class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"
      :style="{ left: `${indicator.left}px`, width: `${indicator.width}px` }"
    />
    <button
      v-for="(item, index) in options"
      :key="item.value"
      :ref="(node) => (buttons[index] = node)"
      type="button"
      :aria-pressed="selected.includes(item.value)"
      class="relative rounded-md px-3 py-1.5 text-[13px] capitalize transition-[color,background-color,transform] duration-200 active:scale-[0.97]"
      :class="
        selected.includes(item.value)
          ? type === 'single'
            ? 'text-foreground'
            : 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'
      "
      @click="toggle(item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
