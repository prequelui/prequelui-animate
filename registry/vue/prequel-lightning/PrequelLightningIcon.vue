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

const spec = {"slug":"lightning","name":"Lightning","category":"Weather","parts":[{"tag":"polygon","attrs":{"points":"13,2 5,13 11,13 9,22 19,10 13,10 13,2"}}],"roles":["primary"],"closed":[true],"draw":[false],"inside":[false],"hasClosed":true,"highlight":{"cx":9.2,"cy":7.6,"rx":2.24,"ry":1.16},"palette":{"color":{"primary":"oklch(0.62 0.14 235)","primaryDark":"oklch(0.79 0.11 235)","accent":"oklch(0.74 0.16 85)","accentDark":"oklch(0.85 0.13 85)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":["M13 2L5 13h6l-2 9 10-12h-6V2Z"],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"opacity":1},"animate":{"opacity":[1,0.4,1],"transition":{"duration":0.5,"ease":"easeInOut"}}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.35,0],"transition":{"duration":0.6,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"opacity":1},"animate":{"opacity":[0.3,1],"transition":{"duration":0.55,"ease":"easeOut"}}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.55,0],"transition":{"duration":0.85,"ease":"easeInOut"}}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"opacity":1},"animate":{"opacity":[0.6,1,0.6],"transition":{"duration":1.6,"ease":"easeInOut"}}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.25,0],"transition":{"duration":1.8,"ease":"easeInOut"}}}}},"component":"PrequelLightningIcon"};
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
