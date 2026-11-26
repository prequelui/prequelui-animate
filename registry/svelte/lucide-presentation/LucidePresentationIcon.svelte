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
  "name": "presentation",
  "category": "Media",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "grow",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M2 3h20"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m7 21 5-5 5 5"
      }
    }
  ],
  "accents": [
    0,
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
