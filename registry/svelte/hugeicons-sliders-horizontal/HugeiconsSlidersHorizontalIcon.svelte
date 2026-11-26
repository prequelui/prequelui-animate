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
  "strokeWidth": 1.5,
  "motion": "gear",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 5.00055L9.99963 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12.9996 5.00031L19.9996 5.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 9.00031L15.9996 15.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9.99963 2.00031L9.99963 8.00031"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 16.0003L11.9996 22.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M15.9996 12.0001L19.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 12.0005L12.9996 12.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M11.9996 19.0003L19.9996 19.0003"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.99963 19.0005L8.99963 19.0003"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4,
    5,
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
