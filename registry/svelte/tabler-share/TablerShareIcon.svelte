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
  "name": "share",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.7 10.7l6.6 -3.4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8.7 13.3l6.6 3.4"
      }
    }
  ],
  "accents": [
    1,
    2,
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
