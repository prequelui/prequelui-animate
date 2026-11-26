<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { bindLinearScene, renderLinearScene } from "../linear-core.js";

const props = defineProps({
  className: { type: String, default: "" },
  label: { type: String, default: "An isometric clipboard: a tall board with ruled lines, a wide clip and a tick." },
  interactive: { type: Boolean, default: true },
  replay: { type: Number, default: 0 },
});

const markup = renderLinearScene("<svg viewBox=\"0 0 400 320\" width=\"100%\" height=\"100%\" fill=\"none\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\"><g data-linear-block=\"clip\" data-linear-index=\"1\"><path d=\"M213.42 94.78L215.08 92.22L218.24 90.05L221.28 88.53L225.64 86.95L230.76 86.11L236.14 86.11L241.25 86.95L245.61 88.53L288.18 109.81L291.34 111.99L293 114.55L293 139.58L291.34 142.14L288.18 144.32L285.14 145.84L280.78 147.42L275.66 148.25L270.28 148.25L265.16 147.42L260.81 145.84L218.24 124.55L215.08 122.38L213.42 119.82Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M293 117.24L291.34 119.8L288.18 121.97L285.14 123.49L280.78 125.08L275.66 125.91L270.28 125.91L265.16 125.08L260.81 123.49L218.24 102.21L215.08 100.03L213.42 97.47\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M242.34 90.16L284.91 111.45L287.22 113.04L288.44 114.91L288.44 116.88L287.22 118.75L284.91 120.34L281.87 121.86L278.68 123.02L274.94 123.62L271.01 123.62L267.26 123.02L264.08 121.86L221.51 100.58L219.2 98.98L217.98 97.11L217.98 95.14L219.2 93.27L221.51 91.68L224.55 90.16L227.74 89.01L231.48 88.4L235.41 88.4L239.16 89.01L242.34 90.16Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M246.37 98.03L269.17 109.43L270.16 110.11L270.68 110.91L270.68 111.75L270.16 112.55L269.17 113.23L267.81 113.73L266.21 113.99L264.53 113.99L262.93 113.73L261.57 113.23L238.77 101.83L237.78 101.15L237.26 100.35L237.26 99.51L237.78 98.71L238.77 98.03L240.13 97.53L241.73 97.28L243.41 97.28L245.01 97.53L246.37 98.03Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g><g data-linear-block=\"board\" data-linear-index=\"0\"><path d=\"M75.39 141.12L77.46 137.92L81.42 135.2L160.47 95.67L165.91 93.69L172.31 92.65L179.04 92.65L185.44 93.69L190.88 95.67L318.58 159.52L322.54 162.24L324.61 165.44L324.61 187.42L322.54 190.62L318.58 193.34L239.53 232.87L234.09 234.85L227.69 235.89L220.96 235.89L214.56 234.85L209.12 232.87L81.42 169.02L77.46 166.3L75.39 163.1Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M324.61 168.8L322.54 172L318.58 174.72L239.53 214.25L234.09 216.23L227.69 217.27L220.96 217.27L214.56 216.23L209.12 214.25L81.42 150.4L77.46 147.68L75.39 144.48\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M187.61 97.3L315.31 161.15L318.42 163.29L320.05 165.8L320.05 168.44L318.42 170.95L315.31 173.09L236.26 212.62L231.99 214.17L226.96 214.98L221.68 214.98L216.66 214.17L212.39 212.62L84.69 148.76L81.58 146.63L79.95 144.12L79.95 141.48L81.58 138.97L84.69 136.83L163.74 97.3L168.01 95.75L173.04 94.93L178.32 94.93L183.34 95.75L187.61 97.3Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M182.52 112.77L260.05 151.54L261.04 152.22L261.56 153.02L261.56 153.86L261.04 154.66L260.05 155.34L258.69 155.83L257.09 156.09L255.41 156.09L253.81 155.83L252.45 155.34L174.92 116.57L173.93 115.89L173.41 115.09L173.41 114.25L173.93 113.45L174.92 112.77L176.28 112.28L177.88 112.02L179.56 112.02L181.16 112.28L182.52 112.77Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M163.51 121.51L266.89 173.2L267.68 173.75L268.1 174.39L268.1 175.06L267.68 175.7L266.89 176.24L265.8 176.64L264.52 176.85L263.18 176.85L261.9 176.64L260.81 176.24L157.43 124.55L156.64 124.01L156.23 123.37L156.23 122.7L156.64 122.06L157.43 121.51L158.52 121.12L159.8 120.91L161.15 120.91L162.42 121.12L163.51 121.51Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M142.23 129.11L142.23 138.24L178.72 138.24\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g></svg>", {
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
