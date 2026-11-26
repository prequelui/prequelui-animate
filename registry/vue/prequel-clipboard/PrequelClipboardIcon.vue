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

const spec = {"slug":"clipboard","name":"Clipboard","category":"Files","parts":[{"tag":"rect","attrs":{"x":5,"y":4,"width":14,"height":18,"rx":2.5}},{"tag":"path","attrs":{"d":"M9 4a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 4v2H9V4Z"}},{"tag":"path","attrs":{"d":"M8.5 11h7"}},{"tag":"path","attrs":{"d":"M8.5 15h7"}}],"roles":["primary","accent","primary","primary"],"closed":[true,true,false,false],"draw":[false,false,true,false],"inside":[false,false,true,true],"hasClosed":true,"highlight":{"cx":9.2,"cy":9.04,"rx":2.24,"ry":1.16},"palette":{"color":{"primary":"oklch(0.62 0.13 230)","primaryDark":"oklch(0.8 0.1 230)","accent":"oklch(0.7 0.14 205)","accentDark":"oklch(0.82 0.11 205)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.65,"ease":"easeInOut"}}},"p3":{}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p3":{}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[1,0.15,1],"opacity":[1,0.6,1],"transition":{"duration":1.7,"ease":"easeInOut"}}},"p3":{}}},"component":"PrequelClipboardIcon"};
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
