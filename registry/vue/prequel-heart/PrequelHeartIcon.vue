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

const spec = {"slug":"heart","name":"Heart","category":"People","parts":[{"tag":"path","attrs":{"d":"M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z"}}],"roles":["primary"],"closed":[true],"draw":[false],"inside":[false],"hasClosed":true,"highlight":{"cx":9.75,"cy":6.68,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.64 0.16 355)","primaryDark":"oklch(0.81 0.12 355)","accent":"oklch(0.72 0.14 20)","accentDark":"oklch(0.84 0.11 20)"},"emoji":{"primary":"oklch(0.68 0.2 27)","secondary":"oklch(0.54 0.19 25)","accent":"oklch(0.62 0.22 350)"}},"fill":["M12 20S3 14.5 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 14.5 12 20 12 20Z"],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{"initial":{"scale":1,"transformOrigin":"50% 60%"},"animate":{"scale":[1,1.07,1],"transition":{"duration":0.5,"ease":"easeOut"},"transformOrigin":"50% 60%"}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.35,0],"transition":{"duration":0.6,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"scale":1,"transformOrigin":"50% 60%"},"animate":{"scale":[1,0.9,1.16,0.97,1],"transition":{"duration":0.65,"ease":"easeInOut"},"transformOrigin":"50% 60%"}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.55,0],"transition":{"duration":0.85,"ease":"easeInOut"}}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{"initial":{"scale":1,"transformOrigin":"50% 60%"},"animate":{"scale":[1,1.05,1],"transition":{"duration":1.4,"ease":"easeInOut"},"transformOrigin":"50% 60%"}},"fill":{"initial":{"opacity":0},"animate":{"opacity":[0,0.25,0],"transition":{"duration":1.8,"ease":"easeInOut"}}}}},"component":"PrequelHeartIcon"};
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
