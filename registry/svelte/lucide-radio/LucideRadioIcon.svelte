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
  "name": "radio",
  "category": "Communication",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "chat",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M16.247 7.761a6 6 0 0 1 0 8.478"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M19.075 4.933a10 10 0 0 1 0 14.134"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M4.925 19.067a10 10 0 0 1 0-14.134"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.753 16.239a6 6 0 0 1 0-8.478"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "12",
        "cy": "12",
        "r": "2"
      }
    }
  ],
  "accents": [
    0,
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
