<script>
  import { onMount } from "svelte";
  import { bindSetIcon, renderSetIcon } from "../icon-set-core.js";

  let {
    size = 28,
    class: className = "",
    label = "",
    speed = 1,
    delay = 0,
    loop = false,
    animate: animateProp = false,
    animateOnHover = true,
    animateOnTap = true,
    animateOnView = false,
    animateOnViewOnce = true,
    animation = "hover",
    ...rest
  } = $props();

  const definition = {
  "name": "bell-simple",
  "category": "Interface",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "ring",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M168,224a8,8,0,0,1-8,8H96a8,8,0,1,1,0-16h64A8,8,0,0,1,168,224Zm53.85-32A15.8,15.8,0,0,1,208,200H48a16,16,0,0,1-13.8-24.06C39.75,166.38,48,139.34,48,104a80,80,0,1,1,160,0c0,35.33,8.26,62.38,13.81,71.94A15.89,15.89,0,0,1,221.84,192ZM208,184c-7.73-13.27-16-43.95-16-80a64,64,0,1,0-128,0c0,36.06-8.28,66.74-16,80Z"
      }
    }
  ],
  "accents": []
};
  let host;
  let controller;

  onMount(() => {
    controller = bindSetIcon(host, definition, () => ({
      speed,
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
  data-slot="prequel-set-icon-host"
  style="display: contents"
  class={className}
  {...rest}
>
  {@html renderSetIcon(definition, { size, className, label })}
</span>
