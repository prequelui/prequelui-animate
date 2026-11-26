<script>
  import { onMount } from "svelte";
  import { bindLinearScene, renderLinearScene } from "../linear-core.js";

  let {
    class: className = "",
    label = "An isometric attachment: a flat paper sheet with a thick wire loop standing at its edge.",
    interactive = true,
    replay = 0,
  } = $props();

  const markup = renderLinearScene("<svg viewBox=\"0 0 400 320\" width=\"100%\" height=\"100%\" fill=\"none\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\"><g data-linear-block=\"sheet\" data-linear-index=\"0\"><path d=\"M85.11 169.67L86.98 166.79L90.54 164.34L163.51 127.86L168.41 126.08L174.17 125.14L180.22 125.14L185.98 126.08L190.88 127.86L309.46 187.15L313.02 189.6L314.89 192.47L314.89 210.4L313.02 213.28L309.46 215.72L236.49 252.21L231.59 253.99L225.83 254.93L219.78 254.93L214.02 253.99L209.12 252.21L90.54 192.92L86.98 190.47L85.11 187.59L85.11 184.57Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M314.89 195.5L313.02 198.38L309.46 200.83L236.49 237.32L231.59 239.09L225.83 240.03L219.78 240.03L214.02 239.09L209.12 237.32L90.54 178.02L86.98 175.58L85.11 172.7\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M187.61 129.49L306.19 188.78L308.9 190.64L310.32 192.84L310.32 195.14L308.9 197.33L306.19 199.19L233.22 235.68L229.49 237.04L225.11 237.75L220.5 237.75L216.12 237.04L212.39 235.68L93.81 176.39L91.1 174.53L89.68 172.34L89.68 170.03L91.1 167.84L93.81 165.98L166.78 129.49L170.51 128.14L174.89 127.42L179.5 127.42L183.88 128.14L187.61 129.49Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M181 144.2L249.41 178.4L250.4 179.08L250.92 179.88L250.92 180.73L250.4 181.53L249.41 182.21L248.05 182.7L246.45 182.96L244.77 182.96L243.17 182.7L241.81 182.21L173.4 148L172.41 147.32L171.89 146.52L171.89 145.68L172.41 144.88L173.4 144.2L174.76 143.7L176.35 143.44L178.04 143.44L179.64 143.7L181 144.2Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M161.99 152.94L253.21 198.55L254 199.09L254.42 199.73L254.42 200.4L254 201.04L253.21 201.59L252.12 201.98L250.84 202.19L249.5 202.19L248.22 201.98L247.13 201.59L155.91 155.98L155.12 155.44L154.71 154.8L154.71 154.12L155.12 153.48L155.91 152.94L157 152.54L158.28 152.34L159.63 152.34L160.9 152.54L161.99 152.94Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g><g data-linear-block=\"clip\" data-linear-index=\"1\" data-linear-kind=\"sprite\"><path d=\"M256.25 217.57L256.25 217.57L256.25 217.57L269.41 214.96L280.57 207.5L288.03 196.34L290.65 183.17L290.65 101.47L288.03 88.31L280.57 77.15L269.41 69.69L256.25 67.07L256.25 67.07L243.09 69.69L231.93 77.15L224.47 88.31L221.85 101.47L221.85 183.17L224.47 196.34L231.93 207.5L243.09 214.96L256.25 217.57ZM256.25 187.47L250.49 186.33L245.61 183.07L242.35 178.18L241.2 172.42L241.2 120.82L242.35 115.06L245.61 110.18L250.49 106.92L256.25 105.77L256.25 105.77L262.01 106.92L266.89 110.18L270.15 115.06L271.3 120.82L271.3 172.42L270.15 178.18L266.89 183.07L262.01 186.33L256.25 187.47L256.25 187.47L256.25 187.47Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M244.09 223.66L244.09 223.66L244.09 223.66L257.25 221.04L268.41 213.58L275.87 202.42L278.49 189.26L278.49 107.56L275.87 94.39L268.41 83.23L257.25 75.77L244.09 73.16L244.09 73.16L230.92 75.77L219.76 83.23L212.31 94.39L209.69 107.56L209.69 189.26L212.31 202.42L219.76 213.58L230.92 221.04L244.09 223.66ZM244.09 193.56L238.33 192.41L233.45 189.15L230.18 184.26L229.04 178.51L229.04 126.91L230.18 121.15L233.45 116.26L238.33 113L244.09 111.86L244.09 111.86L249.85 113L254.73 116.26L257.99 121.15L259.14 126.91L259.14 178.51L257.99 184.26L254.73 189.15L249.85 192.41L244.09 193.56L244.09 193.56L244.09 193.56Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M235.49 206.46L235.49 111.86\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g></svg>", {
    className,
    label,
  });
  let host;
  let controller;

  onMount(() => {
    controller = bindLinearScene(host, { interactive });
    if (replay) controller.replay();
    return () => controller?.destroy();
  });

  $effect(() => {
    if (replay) controller?.replay();
  });
</script>

<span bind:this={host} style="display: contents">{@html markup}</span>
