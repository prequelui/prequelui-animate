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
  "name": "sliders-vertical",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M10 8h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 21v-9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 8V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 16h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 12V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19 21v-5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 14h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 10V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 21v-7"
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
