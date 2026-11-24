<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [
      { value: "standard", label: "Standard", hint: "5–7 business days" },
      { value: "express", label: "Express", hint: "2–3 business days" },
      { value: "overnight", label: "Overnight", hint: "Next business day" },
    ],
  },
  modelValue: { type: String, default: undefined },
  defaultValue: { type: String, default: "standard" },
});
const emit = defineEmits(["update:modelValue"]);

const current = computed(() => props.modelValue ?? props.defaultValue);

function choose(value) {
  emit("update:modelValue", value);
}
</script>

<template>
  <div role="radiogroup" class="flex flex-col gap-2">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      role="radio"
      :aria-checked="item.value === current"
      class="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left text-[13px] transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.97]"
      @click="choose(item.value)"
    >
      <span class="flex size-4 items-center justify-center rounded-full border">
        <span
          aria-hidden="true"
          class="size-2 rounded-full bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
          :style="{ transform: item.value === current ? 'scale(1)' : 'scale(0)' }"
        />
      </span>
      <span class="flex-1">{{ item.label }}</span>
      <span v-if="item.hint" class="text-[13px] text-muted-foreground">{{ item.hint }}</span>
    </button>
  </div>
</template>
