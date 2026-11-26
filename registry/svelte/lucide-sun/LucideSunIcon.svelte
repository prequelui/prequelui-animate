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
  "name": "sun",
  "category": "Status",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "sun",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 2v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 20v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.93 4.93 1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m17.66 17.66 1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 12h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M20 12h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m6.34 17.66-1.41 1.41"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m19.07 4.93-1.41 1.41"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "4"
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
    6,
    7
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
