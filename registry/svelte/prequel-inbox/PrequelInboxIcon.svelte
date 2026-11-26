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

  const spec = {"slug":"inbox","name":"Inbox","category":"Communication","parts":[{"tag":"path","attrs":{"d":"M4 4h16v16H4V4Z"}},{"tag":"path","attrs":{"d":"M4 13h4l2 3h4l2-3h4"}},{"tag":"path","attrs":{"d":"M8 8h8"}}],"roles":["primary","primary","primary"],"closed":[true,false,false],"draw":[false,false,false],"inside":[false,true,true],"hasClosed":true,"highlight":{"cx":8.8,"cy":8.48,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.56 0.1 225)","primaryDark":"oklch(0.78 0.08 225)","accent":"oklch(0.66 0.13 200)","accentDark":"oklch(0.8 0.1 200)"},"emoji":{"primary":"oklch(0.74 0.13 232)","secondary":"oklch(0.58 0.13 232)","accent":"oklch(0.82 0.16 85)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,3,0],"transition":{"duration":0.55,"ease":[0.22,1,0.36,1]}}},"p2":{}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{}}},"component":"PrequelInboxIcon"};
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
