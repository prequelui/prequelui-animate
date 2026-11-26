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
  "name": "more-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M6.00449 12.5V12M18.0045 12.5V12M12.0045 12.5V12M7.00449 12.5C7.00449 11.9477 6.55677 11.5 6.00449 11.5C5.4522 11.5 5.00449 11.9477 5.00449 12.5C5.00449 13.0523 5.4522 13.5 6.00449 13.5C6.55677 13.5 7.00449 13.0523 7.00449 12.5ZM19.0045 12.5C19.0045 11.9477 18.5568 11.5 18.0045 11.5C17.4522 11.5 17.0045 11.9477 17.0045 12.5C17.0045 13.0523 17.4522 13.5 18.0045 13.5C18.5568 13.5 19.0045 13.0523 19.0045 12.5ZM13.0045 12.5C13.0045 11.9477 12.5568 11.5 12.0045 11.5C11.4522 11.5 11.0045 11.9477 11.0045 12.5C11.0045 13.0523 11.4522 13.5 12.0045 13.5C12.5568 13.5 13.0045 13.0523 13.0045 12.5Z"
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
