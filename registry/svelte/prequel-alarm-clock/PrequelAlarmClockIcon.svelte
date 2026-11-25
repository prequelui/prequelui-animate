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

  const spec = {"slug":"alarm-clock","name":"Alarm Clock","category":"Time","parts":[{"tag":"circle","attrs":{"cx":12,"cy":13,"r":8}},{"tag":"path","attrs":{"d":"M4 4l3 2M20 4l-3 2"}},{"tag":"path","attrs":{"d":"M6 21l-1 1M18 21l1 1"}},{"tag":"path","attrs":{"d":"M12 9v4l2 2"}}],"roles":["primary","primary","primary","primary"],"closed":[true,false,false,false],"draw":[false,false,false,false],"inside":[false,false,false,true],"hasClosed":true,"highlight":{"cx":8.8,"cy":9.48,"rx":2.4,"ry":1.25},"palette":{"color":{"primary":"oklch(0.68 0.14 75)","primaryDark":"oklch(0.82 0.11 75)","accent":"oklch(0.62 0.16 40)","accentDark":"oklch(0.76 0.13 40)"},"emoji":{"primary":"oklch(0.82 0.16 85)","secondary":"oklch(0.66 0.15 80)","accent":"oklch(0.72 0.19 48)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-5,4,-2,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,-2.5,2.5,-1.5,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p2":{"initial":{"x":0},"animate":{"x":[0,-2.5,2.5,-1.5,0],"transition":{"duration":0.5,"ease":"easeInOut"}}},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 13px"},"animate":{"rotate":[0,25,0],"transition":{"duration":0.55,"ease":"easeInOut"},"transformOrigin":"12px 13px"}}},"tap":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-11,10,-6,3,0],"transition":{"duration":0.8,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,-4,4,-3,2,0],"transition":{"duration":0.75,"ease":"easeInOut"}}},"p2":{"initial":{"x":0},"animate":{"x":[0,-4,4,-3,2,0],"transition":{"duration":0.75,"ease":"easeInOut"}}},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 13px"},"animate":{"rotate":[0,360],"transition":{"duration":0.85,"ease":[0.22,1,0.36,1]},"transformOrigin":"12px 13px"}}},"loop":{"group":{"initial":{"rotate":0},"animate":{"rotate":[0,-3,3,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"x":0},"animate":{"x":[0,-2,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"x":0},"animate":{"x":[0,-2,2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p3":{"initial":{"rotate":0,"transformOrigin":"12px 13px"},"animate":{"rotate":[0,360],"transition":{"duration":1.8,"ease":"easeInOut"},"transformOrigin":"12px 13px"}}}},"component":"PrequelAlarmClockIcon"};
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
