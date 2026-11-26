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
  "name": "trash",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "trash",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M4 7l16 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M10 11l0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M14 11l0 6"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"
      }
    }
  ],
  "accents": [
    0,
    1,
    2,
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
