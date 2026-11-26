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
  "name": "arrow-fat-down",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideDown",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M231.39,132.94A8,8,0,0,0,224,128H184V48a16,16,0,0,0-16-16H88A16,16,0,0,0,72,48v80H32a8,8,0,0,0-5.66,13.66l96,96a8,8,0,0,0,11.32,0l96-96A8,8,0,0,0,231.39,132.94ZM128,220.69,51.31,144H80a8,8,0,0,0,8-8V48h80v88a8,8,0,0,0,8,8h28.69Z"
      }
    }
  ],
  "accents": []
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
