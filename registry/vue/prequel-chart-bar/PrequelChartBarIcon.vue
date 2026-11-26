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

const spec = {"slug":"chart-bar","name":"Chart Bar","category":"Charts","parts":[{"tag":"path","attrs":{"d":"M4 20h16"}},{"tag":"rect","attrs":{"x":6,"y":12,"width":3,"height":7,"rx":1}},{"tag":"rect","attrs":{"x":10.5,"y":8,"width":3,"height":11,"rx":1}},{"tag":"rect","attrs":{"x":15,"y":4,"width":3,"height":15,"rx":1}}],"roles":["primary","accent","accent","primary"],"closed":[false,true,true,true],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":true,"highlight":{"cx":15.9,"cy":8.2,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.6 0.16 290)","primaryDark":"oklch(0.78 0.13 290)","accent":"oklch(0.7 0.15 310)","accentDark":"oklch(0.82 0.12 310)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.68 0.2 27)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.65,1.05,1],"transition":{"duration":0.5,"ease":"easeOut"},"transformOrigin":"50% 100%"}},"p2":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.65,1.05,1],"transition":{"duration":0.5,"ease":"easeOut","delay":0.05},"transformOrigin":"50% 100%"}},"p3":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.65,1.05,1],"transition":{"duration":0.5,"ease":"easeOut","delay":0.1},"transformOrigin":"50% 100%"}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.4,1.08,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]},"transformOrigin":"50% 100%"}},"p2":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.4,1.08,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.05},"transformOrigin":"50% 100%"}},"p3":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.4,1.08,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.1},"transformOrigin":"50% 100%"}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.7,1.04,0.7],"transition":{"duration":1.5,"ease":"easeInOut"},"transformOrigin":"50% 100%"}},"p2":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.7,1.04,0.7],"transition":{"duration":1.5,"ease":"easeInOut","delay":0.05},"transformOrigin":"50% 100%"}},"p3":{"initial":{"scaleY":1,"transformOrigin":"50% 100%"},"animate":{"scaleY":[0.7,1.04,0.7],"transition":{"duration":1.5,"ease":"easeInOut","delay":0.1},"transformOrigin":"50% 100%"}}}},"component":"PrequelChartBarIcon"};
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
