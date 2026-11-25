<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

const props = defineProps({
  size: { type: Number, default: 28 },
  variant: { type: String, default: "outline" },
  weight: { type: String, default: "regular" },
  speed: { type: Number, default: 1 },
  tempo: { type: Number, default: 1 },
  delay: { type: Number, default: 0 },
  loop: { type: Boolean, default: false },
  animate: { type: [Boolean, String], default: false },
  animateOnHover: { type: Boolean, default: true },
  animateOnTap: { type: Boolean, default: true },
  animateOnView: { type: [Boolean, String], default: false },
  animateOnViewOnce: { type: Boolean, default: true },
  animation: { type: String, default: "hover" },
  className: { type: String, default: "" },
  label: { type: String, default: "" },
});

const spec = {"slug":"bluetooth","name":"Bluetooth","category":"Connectivity","parts":[{"tag":"path","attrs":{"d":"M7 7l10 10-5 5V2l5 5L7 17"}}],"roles":["primary"],"closed":[false],"draw":[false],"inside":[false],"hasClosed":false,"highlight":null,"palette":{"color":{"primary":"oklch(0.64 0.12 195)","primaryDark":"oklch(0.8 0.1 195)","accent":"oklch(0.68 0.14 170)","accentDark":"oklch(0.8 0.12 170)"},"emoji":{"primary":"oklch(0.78 0.14 165)","secondary":"oklch(0.62 0.13 165)","accent":"oklch(0.74 0.13 232)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,18,0],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p0":{}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,180,360],"transition":{"duration":0.8,"ease":[0.22,1,0.36,1]}}},"p0":{}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"}}},"p0":{}}},"component":"PrequelBluetoothIcon"};
const host = ref(null);
let controller = null;

const markup = computed(() =>
  renderIcon(spec, {
    size: props.size,
    variant: props.variant,
    weight: props.weight,
    className: props.className,
    label: props.label,
  }),
);

onMounted(() => {
  controller = bindPrequelIcon(host.value, spec, () => ({
    speed: props.speed,
    tempo: props.tempo,
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
    data-slot="prequel-icon-host"
    style="display: contents"
    v-html="markup"
  ></span>
</template>
