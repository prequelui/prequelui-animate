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
  "name": "adjustments-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 6l8 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 6l4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 12l2 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 12l10 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4 18l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 18l1 0"
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
