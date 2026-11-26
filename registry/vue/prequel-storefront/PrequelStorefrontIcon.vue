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

const spec = {"slug":"storefront","name":"Storefront","category":"Commerce","parts":[{"tag":"path","attrs":{"d":"M3 9l1.5-4h15L21 9"}},{"tag":"path","attrs":{"d":"M4 9h16v11H4V9Z"}},{"tag":"path","attrs":{"d":"M4 9c0 1.5 1.2 2.5 2.5 2.5S9 10.5 9 9c0 1.5 1.2 2.5 2.5 2.5S15 10.5 15 9c0 1.5 1.2 2.5 2.5 2.5S21 10.5 21 9"}},{"tag":"path","attrs":{"d":"M9 20v-5h6v5"}}],"roles":["primary","primary","primary","primary"],"closed":[false,true,false,false],"draw":[false,false,false,false],"inside":[false,false,false,true],"hasClosed":true,"highlight":{"cx":8.8,"cy":12.08,"rx":2.2,"ry":1.14},"palette":{"color":{"primary":"oklch(0.62 0.14 160)","primaryDark":"oklch(0.8 0.11 160)","accent":"oklch(0.7 0.16 130)","accentDark":"oklch(0.82 0.13 130)"},"emoji":{"primary":"oklch(0.82 0.18 130)","secondary":"oklch(0.66 0.16 130)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p3":{}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"y":0},"animate":{"y":[0,-3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p3":{}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p1":{},"p2":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p3":{}}},"component":"PrequelStorefrontIcon"};
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
