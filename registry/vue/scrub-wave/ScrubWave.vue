<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { createScrubWave } from "./scrub-wave.js";

const props = defineProps({
  className: { type: String, default: "" },
  preview: { type: Boolean, default: false },
});

const host = ref(null);
let instance;

onMounted(() => {
  if (!host.value) return;
  instance = createScrubWave(host.value, {
    className: props.className,
    preview: props.preview,
  });
  const extra = String(props.className || "").split(/\s+/).filter(Boolean);
  if (extra.length) host.value.classList.add(...extra);
});

watch(
  () => props.preview,
  (value) => instance?.update({ preview: value }),
);

onBeforeUnmount(() => {
  instance?.destroy();
  instance = undefined;
});
</script>

<template>
  <div ref="host"></div>
</template>
