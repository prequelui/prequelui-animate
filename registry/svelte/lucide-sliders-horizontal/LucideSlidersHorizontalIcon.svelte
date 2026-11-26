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
  "name": "sliders-horizontal",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 5H3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 19H3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 3v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 17v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 12h-9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 19h-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 5h-7"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 10v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 12H3"
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
