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
  "name": "sliders-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 5.00055L9.99963 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.9996 5.00031L19.9996 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 9.00031L15.9996 15.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9.99963 2.00031L9.99963 8.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 16.0003L11.9996 22.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 12.0001L19.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 12.0005L12.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 19.0003L19.9996 19.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 19.0005L8.99963 19.0003"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4,
    5,
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
