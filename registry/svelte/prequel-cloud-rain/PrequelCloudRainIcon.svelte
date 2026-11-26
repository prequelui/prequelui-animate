<script>
  import { onMount } from "svelte";
  import { bindPrequelIcon, renderIcon } from "./prequel-icon-core.js";

  let {
    size = 28,
    variant = "outline",
    weight = "regular",
    speed = 1,
    tempo = 1,
    delay = 0,
    loop = false,
    animate: animateProp = false,
    animateOnHover = true,
    animateOnTap = true,
    animateOnView = false,
    animateOnViewOnce = true,
    animation = "hover",
    class: className = "",
    label = "",
    ...rest
  } = $props();

  const spec = {"slug":"cloud-rain","name":"Cloud Rain","category":"Weather","parts":[{"tag":"path","attrs":{"d":"M6.5 16h11a3.5 3.5 0 0 0 .4-7 5.5 5.5 0 0 0-10.6-1.6A4.25 4.25 0 0 0 6.5 16Z"}},{"tag":"path","attrs":{"d":"M8 19v2"}},{"tag":"path","attrs":{"d":"M12 19v3"}},{"tag":"path","attrs":{"d":"M16 19v2"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,false,false],"inside":[false,false,false,false],"hasClosed":true,"highlight":{"cx":7.68,"cy":7.04,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.62 0.14 235)","primaryDark":"oklch(0.79 0.11 235)","accent":"oklch(0.74 0.16 85)","accentDark":"oklch(0.85 0.13 85)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.6,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut","delay":0.05}}},"p3":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut","delay":0.1}}}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.7,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,4,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"y":0},"animate":{"y":[0,4,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.05}}},"p3":{"initial":{"y":0},"animate":{"y":[0,4,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1],"delay":0.1}}}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2.5,0],"transition":{"duration":1.8,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"y":0},"animate":{"y":[0,2,0],"transition":{"duration":1.4,"ease":"easeInOut","delay":0.05}}},"p3":{"initial":{"y":0},"animate":{"y":[0,2,0],"transition":{"duration":1.4,"ease":"easeInOut","delay":0.1}}}}},"component":"PrequelCloudRainIcon"};
  let host;
  let controller;

  onMount(() => {
    controller = bindPrequelIcon(host, spec, () => ({
      speed,
      tempo,
      delay,
      loop,
      animate: animateProp,
      animateOnHover,
      animateOnTap,
      animateOnView,
      animateOnViewOnce,
      animation,
    }));
    return () => controller?.destroy();
  });
</script>

<span
  bind:this={host}
  data-slot="prequel-icon-host"
  style="display: contents"
  {...rest}
>
  {@html renderIcon(spec, {
    size,
    variant: variant,
    weight,
    className,
    label,
  })}
</span>
