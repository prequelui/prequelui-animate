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
  "name": "scan",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7V5a2 2 0 0 1 2-2h2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 3h2a2 2 0 0 1 2 2v2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 17v2a2 2 0 0 1-2 2h-2"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7 21H5a2 2 0 0 1-2-2v-2"
      }
    }
  ],
  "accents": [
    1,
    2,
    3
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
