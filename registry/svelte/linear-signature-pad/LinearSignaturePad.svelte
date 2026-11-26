<script>
  import { onMount } from "svelte";
  import { bindLinearScene, renderLinearScene } from "../linear-core.js";

  let {
    class: className = "",
    label = "An isometric signature pad: a flat pad with a traced signature and a slim stylus at its edge.",
    interactive = true,
    replay = 0,
  } = $props();

  const markup = renderLinearScene("<svg viewBox=\"0 0 400 320\" width=\"100%\" height=\"100%\" fill=\"none\" preserveAspectRatio=\"xMidYMid meet\" aria-hidden=\"true\"><g data-linear-block=\"pad\" data-linear-index=\"0\"><path d=\"M79.95 117.66L82.03 114.47L85.98 111.74L116.38 96.54L121.83 94.56L128.22 93.53L134.95 93.53L141.35 94.56L146.79 96.54L314.02 180.16L317.97 182.88L320.05 186.08L320.05 204.34L317.97 207.53L314.02 210.26L283.62 225.46L278.17 227.44L271.78 228.47L265.05 228.47L258.65 227.44L253.21 225.46L85.98 141.84L82.03 139.12L79.95 135.92Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M320.05 189.44L317.97 192.64L314.02 195.36L283.62 210.56L278.17 212.54L271.78 213.58L265.05 213.58L258.65 212.54L253.21 210.56L85.98 126.95L82.03 124.23L79.95 121.03\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M143.52 98.18L310.75 181.79L313.86 183.93L315.49 186.44L315.49 189.08L313.86 191.59L310.75 193.73L280.35 208.93L276.07 210.48L271.05 211.3L265.77 211.3L260.75 210.48L256.48 208.93L89.25 125.31L86.14 123.18L84.51 120.67L84.51 118.03L86.14 115.51L89.25 113.38L119.65 98.18L123.93 96.62L128.95 95.81L134.23 95.81L139.25 96.62L143.52 98.18Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M113.34 119.35L137.67 119.35L143.75 128.47L174.16 128.47L174.16 140.63L198.48 143.67L201.52 157.35\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><ellipse cx=\"113.34\" cy=\"119.35\" rx=\"5.38\" ry=\"2.69\" stroke=\"none\" fill=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><ellipse cx=\"201.52\" cy=\"157.35\" rx=\"5.38\" ry=\"2.69\" stroke=\"none\" fill=\"var(--ls-hi)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M98.14 126.95L207.6 181.68\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g><g data-linear-block=\"stylus\" data-linear-index=\"1\"><path d=\"M248.65 136.3L265.37 132.5L304.9 167.47L304.9 178.64L288.18 182.44L248.65 147.47Z\" fill=\"var(--ls-plate)\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-edge)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M304.9 167.47L288.18 171.27\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M266.68 134.72L301.8 165.75L286.87 169.05L251.75 138.02Z\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-mid)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /><path d=\"M265.37 141.62L289.7 162.9\" fill=\"none\" stroke-width=\"0.9\" stroke-linecap=\"round\" stroke-linejoin=\"round\" vector-effect=\"non-scaling-stroke\" stroke=\"var(--ls-lo)\" style=\"transition:stroke 260ms cubic-bezier(0.5,0,0.1,1), fill 260ms cubic-bezier(0.5,0,0.1,1)\" /></g></svg>", {
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
