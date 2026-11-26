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

  const spec = {"slug":"music","name":"Music","category":"Media","parts":[{"tag":"path","attrs":{"d":"M9 18V5l11-2v13"}},{"tag":"circle","attrs":{"cx":6,"cy":18,"r":3}},{"tag":"circle","attrs":{"cx":17,"cy":16,"r":3}}],"roles":["primary","primary","accent"],"closed":[false,true,true],"draw":[false,false,false],"inside":[false,false,false],"hasClosed":true,"highlight":{"cx":4.8,"cy":16.68,"rx":1.1,"ry":0.7},"palette":{"color":{"primary":"oklch(0.62 0.18 330)","primaryDark":"oklch(0.79 0.14 330)","accent":"oklch(0.72 0.16 355)","accentDark":"oklch(0.84 0.13 355)"},"emoji":{"primary":"oklch(0.62 0.22 350)","secondary":"oklch(0.48 0.2 350)","accent":"oklch(0.6 0.2 300)"}},"fill":[],"animations":{"hover":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":0.45,"ease":"easeOut"}}}},"tap":{"group":{"initial":{"y":0},"animate":{"y":[0,-6,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-4,0],"transition":{"duration":0.5,"ease":[0.22,1,0.36,1]}}}},"loop":{"group":{"initial":{"y":0},"animate":{"y":[0,-2,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p0":{},"p1":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}},"p2":{"initial":{"y":0},"animate":{"y":[0,-1.5,0],"transition":{"duration":1.4,"ease":"easeInOut"}}}}},"component":"PrequelMusicIcon"};
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
