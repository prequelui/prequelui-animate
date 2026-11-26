<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

const props = defineProps({
  size: { type: Number, default: 28 },
  className: { type: String, default: "" },
  label: { type: String, default: "" },
  speed: { type: Number, default: 1 },
  delay: { type: Number, default: 0 },
  loop: { type: Boolean, default: false },
  animate: { type: [Boolean, String], default: false },
  animateOnHover: { type: Boolean, default: true },
  animateOnTap: { type: Boolean, default: true },
  animateOnView: { type: [Boolean, String], default: false },
  animateOnViewOnce: { type: Boolean, default: true },
  animation: { type: String, default: "hover" },
});

const definition = {
  "name": "trash",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "trash",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11v6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 11v6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 6h18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      }
    }
  ],
  "accents": [
    0,
    1,
    3,
    4
  ]
};
const host = ref(null);
let controller = null;

const markup = computed(() =>
  renderSetIcon(definition, {
    size: props.size,
    className: props.className,
    label: props.label,
  }),
);

onMounted(() => {
  controller = bindSetIcon(host.value, definition, () => ({
    speed: props.speed,
    delay: props.delay,
    loop: props.loop,
    animate: props.animate,
    animateOnHover: props.animateOnHover,
    animateOnTap: props.animateOnTap,
    animateOnView: props.animateOnView,
    animateOnViewOnce: props.animateOnViewOnce,
    animation: props.animation,
  }));
});

onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <span
    ref="host"
    data-slot="prequel-set-icon-host"
    style="display: contents"
    v-html="markup"
  ></span>
</template>
