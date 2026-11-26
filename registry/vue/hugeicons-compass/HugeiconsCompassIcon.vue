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
  "name": "compass",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 3.5V2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 2H14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14.7728 10.2571C15.5061 10.9837 14.3328 16.8933 13.1289 16.9974C12.1189 17.0848 11.8041 15.0928 11.5914 14.4614C11.3815 13.8383 11.1478 13.6139 10.5298 13.4095C8.95989 12.8901 8.17492 12.6304 8.0195 12.2192C7.60796 11.1304 13.8362 9.32902 14.7728 10.2571Z"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "13",
        "r": "9"
      }
    }
  ],
  "accents": [
    0,
    1,
    2
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
