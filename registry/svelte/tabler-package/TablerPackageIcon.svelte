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
  "name": "package",
  "category": "Files",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 2,
  "motion": "float",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l0 9"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M12 12l-8 -4.5"
      }
    },
    {
      "tag": "path",
      "attrs": {
        "d": "M16 5.25l-8 4.5"
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
