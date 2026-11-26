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

  const spec = {"slug":"pause","name":"Pause","category":"Media","parts":[{"tag":"rect","attrs":{"x":7,"y":5,"width":3.5,"height":14,"rx":1.5}},{"tag":"rect","attrs":{"x":13.5,"y":5,"width":3.5,"height":14,"rx":1.5}}],"roles":["primary","accent"],"closed":[true,true],"draw":[false,false],"inside":[false,false],"hasClosed":true,"highlight":{"cx":8.05,"cy":8.92,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.62 0.18 330)","primaryDark":"oklch(0.79 0.14 330)","accent":"oklch(0.72 0.16 355)","accentDark":"oklch(0.84 0.13 355)"},"emoji":{"primary":"oklch(0.62 0.22 350)","secondary":"oklch(0.48 0.2 350)","accent":"oklch(0.6 0.2 300)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.05,1],"transition":{"duration":0.55,"ease":"easeInOut"}}},"p0":{"initial":{"scaleY":1},"animate":{"scaleY":[0.65,1.05,1],"transition":{"duration":0.5,"ease":"easeOut"}}},"p1":{"initial":{"scaleY":1},"animate":{"scaleY":[0.65,1.05,1],"transition":{"duration":0.5,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.15,1],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{"initial":{"scaleY":1},"animate":{"scaleY":[0.4,1.08,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p1":{"initial":{"scaleY":1},"animate":{"scaleY":[0.4,1.08,1],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"scale":1},"animate":{"scale":[1,1.04,1],"transition":{"duration":1.6,"ease":"easeInOut"}}},"p0":{"initial":{"scaleY":1},"animate":{"scaleY":[0.7,1.04,0.7],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p1":{"initial":{"scaleY":1},"animate":{"scaleY":[0.7,1.04,0.7],"transition":{"duration":1.5,"ease":"easeInOut"}}}}},"component":"PrequelPauseIcon"};
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
