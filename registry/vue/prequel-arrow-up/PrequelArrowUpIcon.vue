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

const spec = {"slug":"arrow-up","name":"Arrow Up","category":"Arrows","parts":[{"tag":"path","attrs":{"d":"M12 20V5"}},{"tag":"path","attrs":{"d":"M6 11l6-6 6 6"}}],"roles":["primary","primary"],"closed":[false,false],"draw":[false,false],"inside":[false,false],"hasClosed":false,"highlight":null,"palette":{"color":{"primary":"oklch(0.6 0.15 250)","primaryDark":"oklch(0.78 0.12 250)","accent":"oklch(0.7 0.16 235)","accentDark":"oklch(0.82 0.13 235)"},"emoji":{"primary":"oklch(0.72 0.19 48)","secondary":"oklch(0.58 0.18 45)","accent":"oklch(0.74 0.13 232)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelArrowUpIcon"};
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
