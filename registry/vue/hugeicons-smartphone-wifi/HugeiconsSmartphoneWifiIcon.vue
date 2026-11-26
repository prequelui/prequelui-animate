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
  "name": "smartphone-wifi",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "shake",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M8 6C6.37274 6.02975 5.43781 6.1682 4.80546 6.81237C4 7.63289 4 8.9535 4 11.5947V16.3971C4 19.0384 4 20.359 4.80546 21.1795C5.61091 22 6.90728 22 9.5 22C12.0927 22 13.3891 22 14.1945 21.1795C15 20.359 15 19.0384 15 16.3971V13.4958"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.5 6.8647C13.2106 6.2981 14.0929 5.99038 15.0018 5.9922C15.9106 5.99401 16.7917 6.30527 17.5 6.8747M15 10H15.01M10 3.755C11.4189 2.61897 13.1824 2 15 2C16.8176 2 18.5811 2.61897 20 3.755"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 19H10"
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
