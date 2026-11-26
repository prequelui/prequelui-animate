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
  "name": "arrows-shuffle",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sway",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M18 4l3 3l-3 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 20l3 -3l-3 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7h3a5 5 0 0 1 5 5a5 5 0 0 0 5 5h5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 7h-5a4.978 4.978 0 0 0 -3 1m-4 8a4.984 4.984 0 0 1 -3 1h-3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2
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
