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

const spec = {"slug":"thermometer","name":"Thermometer","category":"Health","parts":[{"tag":"path","attrs":{"d":"M10 13.5V5a2 2 0 0 1 4 0v8.5a4 4 0 1 1-4 0Z"}},{"tag":"rect","attrs":{"x":11,"y":9,"width":2,"height":6,"rx":1}},{"tag":"path","attrs":{"d":"M16 7h2M16 10h2M16 13h2"}}],"roles":["primary","accent","primary"],"closed":[true,true,false],"draw":[false,false,false],"inside":[false,true,false],"hasClosed":true,"highlight":{"cx":9,"cy":7.06,"rx":1.6,"ry":0.83},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.65,1.05,1],"transition":{"duration":0.5,"ease":"easeOut"},"transformOrigin":"50% 100%"}},"p2":{}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.4,1.08,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]},"transformOrigin":"50% 100%"}},"p2":{}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.7,1.04,0.7],"transition":{"duration":1.5,"ease":"easeInOut"},"transformOrigin":"50% 100%"}},"p2":{}}},"component":"PrequelThermometerIcon"};
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
