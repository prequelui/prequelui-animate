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
  "name": "arrow-reload-horizontal",
  "category": "Navigation",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "spin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20.5 5.5H9.5C5.78672 5.5 3 8.18503 3 12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M3.5 18.5H14.5C18.2133 18.5 21 15.815 21 12"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M18.5 3C18.5 3 21 4.84122 21 5.50002C21 6.15882 18.5 8 18.5 8"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M5.49998 16C5.49998 16 3.00001 17.8412 3 18.5C2.99999 19.1588 5.5 21 5.5 21"
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
