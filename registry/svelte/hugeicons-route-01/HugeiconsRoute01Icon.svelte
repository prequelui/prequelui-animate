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
  "name": "route-01",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "orbit",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 5H8.5C6.567 5 5 6.567 5 8.5C5 10.433 6.567 12 8.5 12H15.5C17.433 12 19 13.567 19 15.5C19 17.433 17.433 19 15.5 19H12"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "18",
        "cy": "5",
        "r": "3"
      }
    },
    {
      "tag": "circle",
      "attrs": {
        "cx": "6",
        "cy": "19",
        "r": "3"
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
