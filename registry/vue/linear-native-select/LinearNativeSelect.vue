<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { bindLinearScene, renderLinearScene } from "../linear-core.js";

const props = defineProps({
  className: { type: String, default: "" },
  label: { type: String, default: "An isometric native select: a compact box with a base line and a small chevron key." },
  interactive: { type: Boolean, default: true },
  replay: { type: Number, default: 0 },
});

const markup = renderLinearScene("<svg viewBox=\"0 0 400 320\" width=\"100%\" height=\"100%\" fill=\"none\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\"><g data-linear-block=\"box\" data-linear-index=\"0\"><path d=\"M100.92 118.08L102.58 115.52L105.74 113.34L127.03 102.7L131.38 101.12L136.5 100.29L141.88 100.29L147 101.12L151.35 102.7L294.26 174.15L297.42 176.33L299.08 178.89L299.08 203.92L297.42 206.48L294.26 208.66L272.97 219.3L268.62 220.88L263.5 221.71L258.12 221.71L253 220.88L248.65 219.3L105.74 147.85L102.58 145.67L100.92 143.11Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M299.08 181.58L297.42 184.14L294.26 186.31L272.97 196.96L268.62 198.54L263.5 199.37L258.12 199.37L253 198.54L248.65 196.96L105.74 125.5L102.58 123.33L100.92 120.77\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M148.08 104.33L290.99 175.79L293.3 177.38L294.52 179.25L294.52 181.22L293.3 183.09L290.99 184.68L269.7 195.32L266.52 196.48L262.78 197.09L258.84 197.09L255.1 196.48L251.92 195.32L109.01 123.87L106.7 122.28L105.48 120.41L105.48 118.44L106.7 116.57L109.01 114.98L130.3 104.33L133.48 103.18L137.22 102.57L141.16 102.57L144.9 103.18L148.08 104.33Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M149.07 116.76L223.56 154.01L224.55 154.69L225.07 155.49L225.07 156.33L224.55 157.13L223.56 157.81L222.2 158.3L220.6 158.56L218.92 158.56L217.32 158.3L215.96 157.81L141.47 120.56L140.48 119.88L139.96 119.08L139.96 118.24L140.48 117.44L141.47 116.76L142.83 116.27L144.43 116.01L146.11 116.01L147.71 116.27L149.07 116.76Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M117.9 128.54L242.57 190.88\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g><g data-linear-block=\"chevron\" data-linear-index=\"1\"><path d=\"M238.03 161.28L238.03 159.59L239.07 158L241.05 156.64L253.21 150.55L255.93 149.57L259.13 149.05L262.49 149.05L265.69 149.57L268.41 150.55L283.62 158.16L285.59 159.52L286.63 161.12L286.63 179.55L285.59 181.15L283.62 182.51L271.45 188.6L268.73 189.58L265.53 190.1L262.17 190.1L258.97 189.58L256.25 188.6L241.05 180.99L239.07 179.63L238.03 178.03Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M286.63 162.8L285.59 164.4L283.62 165.76L271.45 171.84L268.73 172.83L265.53 173.35L262.17 173.35L258.97 172.83L256.25 171.84L241.05 164.24L239.07 162.88L238.03 161.28\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M265.14 152.19L280.35 159.79L281.47 160.57L282.07 161.48L282.07 162.44L281.47 163.35L280.35 164.12L268.18 170.2L266.63 170.77L264.81 171.06L262.89 171.06L261.07 170.77L259.52 170.2L244.32 162.6L243.19 161.83L242.6 160.91L242.6 159.96L243.19 159.04L244.32 158.27L256.48 152.19L258.03 151.62L259.85 151.33L261.77 151.33L263.59 151.62L265.14 152.19Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M259.29 156.64L259.29 162.72L271.45 162.72\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g></svg>", {
  className: props.className,
  label: props.label,
});

const host = ref(null);
let controller = null;

onMounted(() => {
  controller = bindLinearScene(host.value, { interactive: props.interactive });
  if (props.replay) controller.replay();
});

watch(
  () => props.replay,
  () => controller?.replay(),
);

onBeforeUnmount(() => controller?.destroy());
</script>

<template>
  <span ref="host" style="display: contents" v-html="markup"></span>
</template>
