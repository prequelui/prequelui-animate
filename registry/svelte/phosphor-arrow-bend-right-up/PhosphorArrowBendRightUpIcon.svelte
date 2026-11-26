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
  "name": "arrow-bend-right-up",
  "category": "Navigation",
  "viewBox": "0 0 256 256",
  "mode": "fill",
  "strokeWidth": 0,
  "motion": "slideUp",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M205.66,85.66a8,8,0,0,1-11.32,0L160,51.31V128A104.11,104.11,0,0,1,56,232a8,8,0,0,1,0-16,88.1,88.1,0,0,0,88-88V51.31L109.66,85.66A8,8,0,0,1,98.34,74.34l48-48a8,8,0,0,1,11.32,0l48,48A8,8,0,0,1,205.66,85.66Z"
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
