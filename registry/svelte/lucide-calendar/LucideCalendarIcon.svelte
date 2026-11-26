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
  "name": "calendar",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "flip",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M8 2v3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 2v3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 9h18"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "x": "3",
        "y": "3",
        "width": "18",
        "height": "18",
        "rx": "2"
      }
    }
  ],
  "accents": [
    0,
    1,
    2
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
