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
  "name": "megaphone-01",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M9 14V6H6C5.07003 6 4.60504 6 4.22354 6.10222C3.18827 6.37962 2.37962 7.18827 2.10222 8.22354C2 8.60504 2 9.07003 2 10C2 10.93 2 11.395 2.10222 11.7765C2.37962 12.8117 3.18827 13.6204 4.22354 13.8978C4.60504 14 5.07003 14 6 14H9Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 14L9.96466 18.8233C9.98816 18.9408 10 19.0604 10 19.1802V19.3411C10 20.2573 9.25728 21 8.34109 21C7.55885 21 6.8829 20.4536 6.719 19.6887L5.5 14"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 6H9V14H10C11.2982 14 12.5614 14.4211 13.6 15.2L15.747 16.8103C15.9112 16.9334 16.111 17 16.3162 17C16.7246 17 17.0909 16.7404 17.2088 16.3495C17.5537 15.2067 18 13.2728 18 10C18 6.72718 17.5537 4.79327 17.2088 3.65054C17.0909 3.25961 16.7246 3 16.3162 3C16.111 3 15.9112 3.06658 15.747 3.18974L13.6 4.8C12.5614 5.57893 11.2982 6 10 6Z"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 9.99996H22M20.5 6.00109L21.5 5.40637M20.5 14L21.5 14.6481"
      }
    }
  ],
  "accents": [
    0,
    1,
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
