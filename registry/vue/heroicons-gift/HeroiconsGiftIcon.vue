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
  "name": "gift",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20.625 11.505v8.25a1.5 1.5 0 0 1-1.5 1.5H4.875a1.5 1.5 0 0 1-1.5-1.5v-8.25m8.25-6.375A2.625 2.625 0 1 0 9 7.755h2.625m0-2.625v2.625m0-2.625a2.625 2.625 0 1 1 2.625 2.625h-2.625m0 0v13.5M3 11.505h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.622-.504-1.125-1.125-1.125H3c-.621 0-1.125.503-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
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
