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
        "d": "M9 6l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 12l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 18l11 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 6l0 .01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 12l0 .01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 18l0 .01"
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
