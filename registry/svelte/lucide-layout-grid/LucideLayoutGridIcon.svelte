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
  "name": "layout-grid",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "pop",
  "parts": [
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "3",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "3",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "14",
        "y": "14",
        "rx": "1"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "7",
        "height": "7",
        "x": "3",
        "y": "14",
        "rx": "1"
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
