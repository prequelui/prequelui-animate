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
  "name": "map-pin",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 9.00183C4.82497 9.01495 3.64706 9.11944 2.87868 9.95185C2 10.9038 2 12.4358 2 15.4999C2 18.5641 2 20.0961 2.87868 21.048C3.75736 21.9999 5.17157 21.9999 8 21.9999H16C18.8284 21.9999 20.2426 21.9999 21.1213 21.048C22 20.0961 22 18.5641 22 15.4999C22 12.4358 22 10.9038 21.1213 9.95185C20.3529 9.11944 19.175 9.01495 17 9.00183"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12L10.5 14.625M18 19L13.8 16.55M13.8 16.55L18 13.75M13.8 16.55L10.5 14.625M10.5 14.625L6 17.6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 7C13.3807 7 14.5 5.88071 14.5 4.5C14.5 3.11929 13.3807 2 12 2C10.6193 2 9.5 3.11929 9.5 4.5C9.5 5.88071 10.6193 7 12 7ZM12 7V11"
      }
    }
  ],
  "accents": [
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
