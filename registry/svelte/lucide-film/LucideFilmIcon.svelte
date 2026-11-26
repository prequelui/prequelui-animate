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
  "name": "film",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "bounce",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M7 3v18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 7.5h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 12h18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3 16.5h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 3v18"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 7.5h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M17 16.5h4"
      }
    },
    {
      "tag": "rect",
      "attrs": {
        "width": "18",
        "height": "18",
        "x": "3",
        "y": "3",
        "rx": "2"
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
