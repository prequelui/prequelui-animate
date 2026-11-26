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
  "name": "sliders-vertical",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 8h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 21v-9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 16h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 12V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 21v-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 14h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 10V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 21v-7"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
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
