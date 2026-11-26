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

const spec = {"slug":"bug","name":"Bug","category":"Development","parts":[{"tag":"path","attrs":{"d":"M8 9h8v5a4 4 0 0 1-8 0V9Z"}},{"tag":"path","attrs":{"d":"M9 9V7a3 3 0 0 1 6 0v2"}},{"tag":"path","attrs":{"d":"M4 12h3M17 12h3"}},{"tag":"path","attrs":{"d":"M5 18l2-2M19 18l-2-2"}},{"tag":"path","attrs":{"d":"M5 6l2 2M19 6l-2 2"}}],"roles":["primary","primary","primary","primary","primary"],"closed":[true,false,false,false,false],"draw":[false,false,false,false,false],"inside":[false,false,false,false,false],"hasClosed":true,"highlight":{"cx":7.6,"cy":11.52,"rx":1.8,"ry":0.94},"palette":{"color":{"primary":"oklch(0.58 0.16 275)","primaryDark":"oklch(0.77 0.13 275)","accent":"oklch(0.7 0.16 250)","accentDark":"oklch(0.82 0.13 250)"},"emoji":{"primary":"oklch(0.6 0.2 300)","secondary":"oklch(0.46 0.18 300)","accent":"oklch(0.78 0.14 165)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-5,4,-2,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-2.5,2.5,-1.5,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-2.5,2.5,-1.5,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p4":{"initial":{"x":0},"animate":{"x":[0,-2.5,2.5,-1.5,0],"transition":{"duration":0.5,"ease":"easeInOut"}}}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-11,10,-6,3,0],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-4,4,-3,2,0],"transition":{"duration":0.75,"ease":"easeInOut"}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-4,4,-3,2,0],"transition":{"duration":0.75,"ease":"easeInOut"}}},"p4":{"initial":{"x":0},"animate":{"x":[0,-4,4,-3,2,0],"transition":{"duration":0.75,"ease":"easeInOut"}}}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-3,3,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"x":0},"animate":{"x":[0,-2,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p3":{"initial":{"x":0},"animate":{"x":[0,-2,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p4":{"initial":{"x":0},"animate":{"x":[0,-2,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelBugIcon"};
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
