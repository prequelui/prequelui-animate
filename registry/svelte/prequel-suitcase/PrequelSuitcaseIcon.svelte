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

  const spec = {"slug":"suitcase","name":"Suitcase","category":"Travel","parts":[{"tag":"rect","attrs":{"x":4,"y":7,"width":16,"height":13,"rx":2.5}},{"tag":"path","attrs":{"d":"M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"}},{"tag":"path","attrs":{"d":"M9 11v5M15 11v5"}},{"tag":"path","attrs":{"d":"M9 20v1M15 20v1"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,false,false],"inside":[false,false,true,false],"hasClosed":true,"highlight":{"cx":8.8,"cy":10.64,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.06,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p2":{},"p3":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.4,1],"scale":[1,1.14,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{},"p3":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"opacity":1,"scale":1},"animate":{"opacity":[1,0.55,1],"scale":[1,1.05,1],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p2":{},"p3":{}}},"component":"PrequelSuitcaseIcon"};
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
