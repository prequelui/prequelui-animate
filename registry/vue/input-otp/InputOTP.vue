<script setup>
import { computed, nextTick, ref, watch } from "vue";

const props = defineProps({
  length: { type: Number, default: 6 },
  defaultValue: { type: String, default: "" },
  modelValue: { type: String, default: undefined },
});
const emit = defineEmits(["update:modelValue", "complete"]);

const values = ref(
  Array.from({ length: props.length }, (_, index) =>
    (props.modelValue ?? props.defaultValue)[index] ?? "",
  ),
);
const inputs = ref([]);

watch(
  () => props.modelValue,
  (value) => {
    if (value === undefined) return;
    values.value = Array.from({ length: props.length }, (_, index) => value[index] ?? "");
  },
);

const joined = computed(() => values.value.join(""));

function commit() {
  emit("update:modelValue", joined.value);
  if (joined.value.length === props.length) emit("complete", joined.value);
}

function write(index, text) {
  const chars = text.replace(/\D/g, "").slice(0, props.length - index).split("");
  if (!chars.length) return;
  chars.forEach((char, offset) => {
    values.value[index + offset] = char;
  });
  commit();
  nextTick(() => inputs.value[Math.min(props.length - 1, index + chars.length)]?.focus());
}

function onInput(event, index) {
  const digits = event.target.value.replace(/\D/g, "");
  if (!digits) {
    values.value[index] = "";
    commit();
    return;
  }
  write(index, digits);
  event.target.value = values.value[index] ?? "";
}
</script>

<template>
  <div class="flex items-center gap-2" role="group" aria-label="One-time code">
    <input
      v-for="(value, index) in values"
      :key="index"
      :ref="(node) => (inputs[index] = node)"
      :value="value"
      inputmode="numeric"
      autocomplete="one-time-code"
      maxlength="1"
      :aria-label="`Digit ${index + 1}`"
      class="otp-input size-10 rounded-lg border bg-background text-center font-mono text-[15px] outline-none focus-visible:ring-2 focus-visible:ring-ring"
      :class="{ filled: value }"
      :style="{ animationDelay: `${index * 30}ms` }"
      @input="onInput($event, index)"
      @keydown.backspace.prevent="
        values[index] ? ((values[index] = ''), commit()) : index > 0 && ((values[index - 1] = ''), commit(), inputs[index - 1]?.focus())
      "
      @paste.prevent="write(index, $event.clipboardData.getData('text'))"
    />
  </div>
</template>

<style>
.otp-input.filled { animation: otp-pop 240ms cubic-bezier(0.23, 1, 0.32, 1) both; }
@keyframes otp-pop { from { transform: scale(0.9); opacity: 0.4; } }
@media (prefers-reduced-motion: reduce) {
  .otp-input.filled { animation: none; }
}
</style>
