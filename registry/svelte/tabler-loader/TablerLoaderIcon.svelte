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
        "d": "M12 6l0 -3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16.25 7.75l2.15 -2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18 12l3 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16.25 16.25l2.15 2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 18l0 3"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.75 16.25l-2.15 2.15"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M6 12l-3 0"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M7.75 7.75l-2.15 -2.15"
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
