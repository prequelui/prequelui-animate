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
  "name": "notebook",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "file",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2 6h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 10h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 14h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 18h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 2v20"
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
    }
  ],
  "accents": [
    0,
    1,
    2,
    3,
    4
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
