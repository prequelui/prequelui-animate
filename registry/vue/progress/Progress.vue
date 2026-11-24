<script setup>
import { computed } from "vue";

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  label: { type: String, default: "Uploading assets" },
  showValue: { type: Boolean, default: true },
});

const safeMax = computed(() => (props.max > 0 ? props.max : 100));
const clamped = computed(() => Math.min(safeMax.value, Math.max(0, props.value)));
const percent = computed(() => (clamped.value / safeMax.value) * 100);
const shown = computed(() => Math.round(clamped.value));
</script>

<template>
  <div class="w-full max-w-[380px]">
    <div class="mb-2 flex items-center justify-between text-[13px] text-muted-foreground">
      <span>{{ label }}</span>
      <span v-if="showValue" class="tabular-nums">{{ shown }}%</span>
    </div>
    <div
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="safeMax"
      :aria-valuenow="clamped"
      class="h-2 w-full overflow-hidden rounded-full bg-accent"
    >
      <div
        class="h-full rounded-full bg-foreground transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        :style="{ width: `${percent}%` }"
      />
    </div>
  </div>
</template>
