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
  "name": "gift",
  "category": "Commerce",
  "viewBox": "0 0 24 24",
  "mode": "stroke",
  "strokeWidth": 1.5,
  "motion": "coin",
  "parts": [
    {
      "tag": "path",
      "attrs": {
        "d": "M20.625 11.505v8.25a1.5 1.5 0 0 1-1.5 1.5H4.875a1.5 1.5 0 0 1-1.5-1.5v-8.25m8.25-6.375A2.625 2.625 0 1 0 9 7.755h2.625m0-2.625v2.625m0-2.625a2.625 2.625 0 1 1 2.625 2.625h-2.625m0 0v13.5M3 11.505h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.622-.504-1.125-1.125-1.125H3c-.621 0-1.125.503-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
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
