<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  modelValue: { type: Number, default: undefined },
  defaultValue: { type: Number, default: 42 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  label: { type: String, default: "Volume" },
  showValue: { type: Boolean, default: true },
});
const emit = defineEmits(["update:modelValue"]);

const internal = ref(props.defaultValue);
const current = computed(() => props.modelValue ?? internal.value);
const safeMax = computed(() => (props.max > props.min ? props.max : props.min + 1));
const percent = computed(() =>
  Math.min(100, Math.max(0, ((current.value - props.min) / (safeMax.value - props.min)) * 100)),
);
const dragging = ref(false);
const track = ref(null);

function commit(next) {
  const snapped = Math.round((next - props.min) / props.step) * props.step + props.min;
  const clamped = Math.min(safeMax.value, Math.max(props.min, snapped));
  internal.value = clamped;
  emit("update:modelValue", clamped);
}
function fromClientX(clientX) {
  const rect = track.value?.getBoundingClientRect();
  if (!rect || rect.width === 0) return;
  const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
  commit(props.min + ratio * (safeMax.value - props.min));
}
function onDown(event) {
  event.currentTarget.setPointerCapture(event.pointerId);
  dragging.value = true;
  fromClientX(event.clientX);
}
function onMove(event) {
  if (dragging.value) fromClientX(event.clientX);
}
function onKey(event) {
  const delta =
    event.key === "ArrowRight" || event.key === "ArrowUp"
      ? props.step
      : event.key === "ArrowLeft" || event.key === "ArrowDown"
        ? -props.step
        : event.key === "Home"
          ? props.min - current.value
          : event.key === "End"
            ? safeMax.value - current.value
            : 0;
  if (!delta) return;
  event.preventDefault();
  commit(current.value + delta);
}
</script>

<template>
  <div class="w-full max-w-[360px]">
    <div class="mb-2 flex items-center justify-between text-[13px]">
      <span class="text-muted-foreground">{{ label }}</span>
      <span v-if="showValue" class="tabular-nums">{{ current }}</span>
    </div>
    <div
      ref="track"
      role="slider"
      tabindex="0"
      :aria-valuemin="min"
      :aria-valuemax="safeMax"
      :aria-valuenow="current"
      :aria-label="label"
      class="relative flex h-6 w-full touch-none select-none items-center outline-none"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="dragging = false"
      @pointercancel="dragging = false"
      @keydown="onKey"
    >
      <div class="h-1.5 w-full overflow-hidden rounded-full bg-accent">
        <div
          class="h-full rounded-full bg-foreground transition-[width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          :style="{ width: `${percent}%` }"
        />
      </div>
      <span
        aria-hidden="true"
        class="absolute top-1/2 block h-3 -translate-y-1/2 rounded-full border bg-background shadow-sm transition-[left,width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        :class="dragging ? 'border-foreground/40' : ''"
        :style="{ left: `${percent}%`, width: dragging ? '14.25px' : '12px', marginLeft: '-6px' }"
      />
    </div>
  </div>
</template>
