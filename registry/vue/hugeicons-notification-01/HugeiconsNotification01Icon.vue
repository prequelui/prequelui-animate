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
  "name": "notification-01",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19.2311 18H4.76887C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 5.63401 8.13401 2.5 12 2.5C15.866 2.5 19 5.634 19 9.5V12.2558C19 13.0514 19.3161 13.8145 19.8787 14.3771L20.4819 14.9803C20.8136 15.3121 21 15.762 21 16.2311C21 17.208 20.208 18 19.2311 18Z"
      }
    }
  ],
  "accents": [
    0
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
