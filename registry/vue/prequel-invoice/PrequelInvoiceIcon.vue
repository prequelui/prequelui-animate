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

const spec = {"slug":"invoice","name":"Invoice","category":"Finance","parts":[{"tag":"path","attrs":{"d":"M6 3h9l4 4v14H6V3Z"}},{"tag":"path","attrs":{"d":"M15 3v4h4"}},{"tag":"path","attrs":{"d":"M12 9v8"}},{"tag":"path","attrs":{"d":"M14.4 10.6c-.6-.9-3.8-1.1-3.8.6 0 1.6 3.8.8 3.8 2.4 0 1.7-3.4 1.6-4 .5"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,true,false],"inside":[false,true,true,true],"hasClosed":true,"highlight":{"cx":9.9,"cy":8.04,"rx":2.08,"ry":1.08},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.65,"ease":"easeInOut"}}},"p3":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[0,1],"opacity":[0.35,1],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p3":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"pathLength":1,"opacity":1},"animate":{"pathLength":[1,0.15,1],"opacity":[1,0.6,1],"transition":{"duration":1.7,"ease":"easeInOut"}}},"p3":{}}},"component":"PrequelInvoiceIcon"};
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
