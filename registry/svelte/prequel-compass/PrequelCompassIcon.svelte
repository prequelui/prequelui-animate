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

  const spec = {"slug":"compass","name":"Compass","category":"Travel","parts":[{"tag":"circle","attrs":{"cx":12,"cy":12,"r":9}},{"tag":"path","attrs":{"d":"M14.5 9.5L11 11l-1.5 3.5L13 13l1.5-3.5Z"}},{"tag":"path","attrs":{"d":"M12 4v1.5M20 12h-1.5M12 20v-1.5M4 12h1.5"}}],"roles":["primary","accent","primary"],"closed":[true,true,false],"draw":[false,false,false],"inside":[false,true,true],"hasClosed":true,"highlight":{"cx":8.4,"cy":8.04,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.06,1],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,25,0],"transition":{"duration":0.55,"ease":"easeInOut"},"transformOrigin":"12px 12px"}},"p2":{}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,0.9,1.14,0.98,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,360],"transition":{"duration":0.85,"ease":[0.22,1,0.36,1]},"transformOrigin":"12px 12px"}},"p2":{}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"rotate":0,"transformOrigin":"12px 12px"},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"},"transformOrigin":"12px 12px"}},"p2":{}}},"component":"PrequelCompassIcon"};
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
