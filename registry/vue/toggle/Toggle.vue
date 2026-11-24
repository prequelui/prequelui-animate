<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, default: undefined },
  defaultPressed: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultPressed);
const value = computed(() => (props.modelValue === undefined ? internal.value : props.modelValue));

function toggle() {
  const next = !value.value;
  if (props.modelValue === undefined) internal.value = next;
  emit("update:modelValue", next);
}
</script>

<template>
  <button
    type="button"
    :aria-pressed="value"
    class="relative inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-[background-color,color,transform] duration-200 active:scale-[0.97]"
    :class="value ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-accent'"
    @click="toggle"
  >
    <span
      aria-hidden="true"
      class="block size-2 rounded-full transition-colors duration-200"
      :class="value ? 'bg-[#7ee2a8]' : 'bg-muted-foreground/50'"
    />
    <slot>Live preview</slot>
  </button>
</template>
