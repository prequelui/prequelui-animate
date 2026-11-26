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
  "name": "database",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 10.842C7.60158 11.0229 8.27434 11.1718 9 11.282"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12C20 13.6569 16.4183 15 12 15C7.58172 15 4 13.6569 4 12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 17.842C7.60158 18.0229 8.27434 18.1718 9 18.282"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 5V19C20 20.6569 16.4183 22 12 22C7.58172 22 4 20.6569 4 19V5"
      }
    },
    {
      "tag": "ellipse",
      "attrs": {
        "cx": "12",
        "cy": "5",
        "rx": "8",
        "ry": "3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3
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
