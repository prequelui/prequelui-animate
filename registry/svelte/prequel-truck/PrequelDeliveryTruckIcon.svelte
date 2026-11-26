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

  const spec = {"slug":"truck","name":"Delivery Truck","category":"Commerce","parts":[{"tag":"path","attrs":{"d":"M3 6h11v11H3V6Z"}},{"tag":"path","attrs":{"d":"M14 9h4l3 3v5h-7"}},{"tag":"circle","attrs":{"cx":7,"cy":19,"r":1.8}},{"tag":"circle","attrs":{"cx":17.5,"cy":19,"r":1.8}},{"tag":"path","attrs":{"d":"M6 10h4"}}],"roles":["primary","primary","accent","accent","primary"],"closed":[true,false,true,true,false],"draw":[false,false,false,false,false],"inside":[false,false,false,false,true],"hasClosed":true,"highlight":{"cx":6.3,"cy":9.08,"rx":1.76,"ry":0.92},"palette":{"color":{"primary":"oklch(0.62 0.14 160)","primaryDark":"oklch(0.8 0.11 160)","accent":"oklch(0.7 0.16 130)","accentDark":"oklch(0.82 0.13 130)"},"emoji":{"primary":"oklch(0.82 0.18 130)","secondary":"oklch(0.66 0.16 130)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"x":0},"animate":{"x":[0,1.5,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p3":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p4":{}},"tap":{"group":{"initial":{"x":0},"animate":{"x":[0,5,0],"transition":{"duration":0.6,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p3":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p4":{}},"loop":{"group":{"initial":{"x":0},"animate":{"x":[0,2.4,0],"transition":{"duration":1.5,"ease":"easeInOut"}}},"p0":{},"p1":{},"p2":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p3":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p4":{}}},"component":"PrequelDeliveryTruckIcon"};
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
