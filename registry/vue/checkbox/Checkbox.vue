<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  defaultChecked: { type: Boolean, default: false },
  label: { type: String, default: "Accept terms" },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultChecked);
watch(
  () => props.modelValue,
  (value) => {
    if (value !== undefined) internal.value = value;
  },
);
const value = computed(() => (props.modelValue === undefined ? internal.value : props.modelValue));

function toggle() {
  if (props.disabled) return;
  const next = !value.value;
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}
</script>

<template>
  <label class="flex items-center gap-2.5 text-[13px]">
    <button
      type="button"
      role="checkbox"
      :aria-checked="value"
      :disabled="disabled"
      class="relative flex size-4 items-center justify-center rounded-[4px] border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      :class="value ? 'border-foreground' : 'border-input'"
      @click="toggle"
    >
      <span
        aria-hidden="true"
        class="absolute inset-0 rounded-[3px] bg-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        :style="{ transform: value ? 'scale(1)' : 'scale(0.5)', opacity: value ? 1 : 0 }"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="relative size-3 text-background"
      >
        <path
          d="m5 12 4 4L19 6"
          :style="{ strokeDasharray: 20, strokeDashoffset: value ? 0 : 20, transition: 'stroke-dashoffset .25s cubic-bezier(0.23,1,0.32,1)' }"
        />
      </svg>
    </button>
    <span>{{ label }}</span>
  </label>
</template>
