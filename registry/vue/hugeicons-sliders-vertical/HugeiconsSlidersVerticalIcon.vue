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
  "strokeWidth": 1.5,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M5.00018 20.0001L4.99994 14.0001"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4.99994 11.0001V4.00006"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.99994 8.00006H14.9999"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M1.99994 14.0001H7.99994"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9999 12.0001H21.9999"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9997 8.00006L11.9999 4.00006"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.0002 20.0001L11.9999 11.0001"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18.9999 12.0001L18.9999 4.00006"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19.0002 20.0001L18.9999 15.0001"
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
