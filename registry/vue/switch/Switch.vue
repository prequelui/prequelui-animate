<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  defaultChecked: { type: Boolean, default: false },
  label: { type: String, default: "Enable notifications" },
  disabled: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultChecked);
const value = computed(() => (props.modelValue === undefined ? internal.value : props.modelValue));
const pressed = ref(false);

function toggle() {
  if (props.disabled) return;
  const next = !value.value;
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}
</script>

<template>
  <label class="flex items-center gap-3 text-[13px]">
    <button
      type="button"
      role="switch"
      :aria-checked="value"
      :aria-label="label"
      :disabled="disabled"
      class="relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      :class="value ? 'bg-primary' : 'bg-input'"
      @click="toggle"
      @pointerdown="pressed = true"
      @pointerup="pressed = false"
      @pointerleave="pressed = false"
    >
      <span
        aria-hidden="true"
        class="block h-5 rounded-full bg-background shadow-sm transition-[transform,width] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
        :style="{ transform: `translateX(${value ? 20 : 0}px)`, width: pressed ? '24px' : '20px' }"
      />
    </button>
    <span v-if="label">{{ label }}</span>
  </label>
</template>
