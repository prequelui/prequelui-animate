<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    maxTilt = 10,
    perspective = 800,
    transition = undefined,
    as = "div",
    class: className = "",
    ...rest
  } = $props();

  let root;
  let control;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const spring = $derived(
    transition ?? {
      type: "spring",
      stiffness: 300,
      damping: 25,
      mass: 0.5,
    },
  );

  function move(event) {
    if (reduce() || !root) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = rect.width ? (event.clientX - rect.left) / rect.width : 0.5;
    const py = rect.height ? (event.clientY - rect.top) / rect.height : 0.5;
    const rotateY = (px * 2 - 1) * maxTilt;
    const rotateX = -(py * 2 - 1) * maxTilt;
    control?.stop?.();
    control = animate(
      root,
      { rotateX, rotateY, transformPerspective: perspective },
      spring,
    );
  }

  function leave() {
    if (!root) return;
    if (reduce()) {
      control?.stop?.();
      control = animate(
        root,
        { rotateX: 0, rotateY: 0, transformPerspective: perspective },
        { duration: 0 },
      );
      return;
    }
    control?.stop?.();
    control = animate(
      root,
      { rotateX: 0, rotateY: 0, transformPerspective: perspective },
      spring,
    );
  }

  onMount(() => {
    if (!root) return;
    control = animate(
      root,
      { rotateX: 0, rotateY: 0, transformPerspective: perspective },
      { duration: 0 },
    );
    return () => control?.stop?.();
  });
</script>

<svelte:element
  this={as}
  bind:this={root}
  data-slot="tilt"
  class={`will-change-transform ${className}`}
  style="transform-style:preserve-3d"
  onpointermove={move}
  onpointerleave={leave}
  {...rest}
>
  <slot />
</svelte:element>
