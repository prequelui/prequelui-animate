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
  "name": "calculator",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 10h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 14h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 14h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18h.01"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M8 18h.01"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "16",
        "height": "20",
        "x": "4",
        "y": "2",
        "rx": "2"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "8",
        "x2": "16",
        "y1": "6",
        "y2": "6"
      }
    },
    {
      "tag": "line",
      "attrs": {
        "x1": "16",
        "x2": "16",
        "y1": "14",
        "y2": "18"
      }
    }
  ],
  "accents": []
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
