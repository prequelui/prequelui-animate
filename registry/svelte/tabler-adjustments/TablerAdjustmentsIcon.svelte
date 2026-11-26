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
  "name": "adjustments",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 10a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 4v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12v8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 16a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 4v10"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 7a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 4v1"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 9v11"
      }
    }
  ],
  "accents": [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8
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
