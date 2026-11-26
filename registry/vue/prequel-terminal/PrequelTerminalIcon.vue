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

const spec = {"slug":"terminal","name":"Terminal","category":"Development","parts":[{"tag":"rect","attrs":{"x":3,"y":4,"width":18,"height":16,"rx":2}},{"tag":"path","attrs":{"d":"M7 9l3 3-3 3"}},{"tag":"path","attrs":{"d":"M13 15h4"}}],"roles":["primary","primary","primary"],"closed":[true,false,false],"draw":[false,false,false],"inside":[false,true,true],"hasClosed":true,"highlight":{"cx":8.4,"cy":8.48,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.58 0.16 275)","primaryDark":"oklch(0.77 0.13 275)","accent":"oklch(0.7 0.16 250)","accentDark":"oklch(0.82 0.13 250)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{}}},"component":"PrequelTerminalIcon"};
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
