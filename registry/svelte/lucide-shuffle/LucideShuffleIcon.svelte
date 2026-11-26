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
  "name": "shuffle",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sway",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "m18 14 4 4-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m18 2 4 4-4 4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 6h1.972a4 4 0 0 1 3.6 2.2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45"
      }
    }
  ],
  "accents": [
    0,
    1,
    3,
    4
  ]
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
