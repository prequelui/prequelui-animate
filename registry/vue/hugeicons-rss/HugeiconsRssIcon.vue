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
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "signal",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M19.5 19.5C19.5 11.2157 12.7843 4.5 4.5 4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.5 19.5C12.5 15.0817 8.91828 11.5 4.5 11.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5.25 19H5M5.5 19C5.5 19.2761 5.27614 19.5 5 19.5C4.72386 19.5 4.5 19.2761 4.5 19C4.5 18.7239 4.72386 18.5 5 18.5C5.27614 18.5 5.5 18.7239 5.5 19Z"
      }
    }
  ],
  "accents": [
    0,
    1
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
