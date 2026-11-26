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
  "name": "rss",
  "category": "Communication",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "signal",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M106.91,149.09A71.53,71.53,0,0,1,128,200a8,8,0,0,1-16,0,56,56,0,0,0-56-56,8,8,0,0,1,0-16A71.53,71.53,0,0,1,106.91,149.09ZM56,80a8,8,0,0,0,0,16A104,104,0,0,1,160,200a8,8,0,0,0,16,0A120,120,0,0,0,56,80Zm118.79,1.21A166.9,166.9,0,0,0,56,32a8,8,0,0,0,0,16A151,151,0,0,1,163.48,92.52,151,151,0,0,1,208,200a8,8,0,0,0,16,0A166.9,166.9,0,0,0,174.79,81.21ZM60,184a12,12,0,1,0,12,12A12,12,0,0,0,60,184Z"
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
