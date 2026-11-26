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
  "name": "loader",
  "category": "Interface",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 2v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.2 7.8 2.9-2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 12h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m16.2 16.2 2.9 2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18v4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.9 19.1 2.9-2.9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M2 12h4"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "m4.9 4.9 2.9 2.9"
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
