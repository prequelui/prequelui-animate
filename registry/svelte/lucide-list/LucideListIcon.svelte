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
  "name": "list",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 5h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 19h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 5h13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 12h13"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 19h13"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5
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
