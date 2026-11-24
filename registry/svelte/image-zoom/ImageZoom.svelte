<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    zoomScale = 3,
    zoomOnClick = true,
    zoomOnHover = true,
    disabled = false,
    width = "100%",
    height = "100%",
    transition = undefined,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let inner;
  let zoomed = $state(false);
  let origin = $state("50% 50%");
  let coarse = $state(false);
  let control;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const options = $derived(
    transition ?? {
      type: "spring",
      stiffness: 200,
      damping: 28,
    },
  );

  const cursor = $derived(
    disabled ? "default" : zoomed ? "zoom-out" : "zoom-in",
  );

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function originFrom(event) {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ("touches" in event && event.touches?.[0]) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else if ("clientX" in event) {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);
    origin = `${rect.width ? (x / rect.width) * 100 : 50}% ${
      rect.height ? (y / rect.height) * 100 : 50
    }%`;
  }

  function scale() {
    if (!inner) return;
    control?.stop?.();
    control = animate(
      inner,
      {
        scale: disabled || reduce() ? 1 : zoomed ? zoomScale : 1,
      },
      options,
    );
  }

  function enter(event) {
    if (disabled || coarse || !zoomOnHover) return;
    originFrom(event);
    zoomed = true;
  }

  function leave() {
    if (disabled || coarse || !zoomOnHover) return;
    zoomed = false;
  }

  function move(event) {
    if (disabled || coarse) return;
    originFrom(event);
  }

  function click(event) {
    if (disabled || !zoomOnClick) return;
    originFrom(event);
    zoomed = !zoomed;
  }

  function touchStart(event) {
    if (disabled) return;
    originFrom(event);
    if (!zoomOnClick) zoomed = true;
  }

  function touchMove(event) {
    if (disabled) return;
    originFrom(event);
  }

  function touchEnd() {
    if (disabled) return;
    if (!zoomOnClick) zoomed = false;
  }

  $effect(() => {
    zoomed;
    scale();
  });

  onMount(() => {
    coarse = window.matchMedia("(pointer: coarse)").matches;
    return () => control?.stop?.();
  });
</script>

<div
  bind:this={root}
  role="img"
  data-slot="image-zoom"
  class={`relative overflow-hidden ${className}`}
  style={`width:${typeof width === "number" ? `${width}px` : width};height:${typeof height === "number" ? `${height}px` : height};touch-action:manipulation;cursor:${cursor}`}
  onmouseenter={enter}
  onmouseleave={leave}
  onmousemove={move}
  onclick={click}
  ontouchstart={touchStart}
  ontouchmove={touchMove}
  ontouchend={touchEnd}
  {...rest}
>
  <div
    bind:this={inner}
    style={`width:100%;height:100%;display:flex;align-items:center;justify-content:center;transform-origin:${origin};will-change:transform`}
  >
    <slot />
  </div>
</div>
