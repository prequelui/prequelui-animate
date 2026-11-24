<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    strength = 0.5,
    range = 120,
    springOptions = undefined,
    onlyOnHover = false,
    disableOnTouch = true,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let canHover = $state(false);
  let reduced = $state(false);
  let hovering = $state(false);
  let control;

  const enabled = $derived(!reduced && (canHover || !disableOnTouch));

  const spring = $derived(
    springOptions ?? {
      type: "spring",
      stiffness: 100,
      damping: 10,
      mass: 0.5,
    },
  );

  function reset() {
    if (!root) return;
    control?.stop?.();
    control = animate(root, { x: 0, y: 0 }, spring);
  }

  function compute(event) {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const distance = Math.hypot(dx, dy);

    if (distance <= range) {
      const factor = (1 - distance / range) * strength;
      control?.stop?.();
      control = animate(root, { x: dx * factor, y: dy * factor }, spring);
    } else {
      reset();
    }
  }

  function onWindowMove(event) {
    if (!enabled || onlyOnHover) return;
    compute(event);
  }

  function enter() {
    hovering = true;
  }

  function move(event) {
    if (enabled && onlyOnHover && hovering) compute(event);
  }

  function leave() {
    hovering = false;
    reset();
  }

  $effect(() => {
    if (!enabled) reset();
  });

  onMount(() => {
    canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!onlyOnHover) {
      window.addEventListener("mousemove", onWindowMove, { passive: true });
    }
    return () => {
      window.removeEventListener("mousemove", onWindowMove);
      control?.stop?.();
    };
  });
</script>

<div
  bind:this={root}
  data-slot="magnetic"
  class={`inline-block ${className}`}
  onpointerenter={enter}
  onpointermove={move}
  onpointerleave={leave}
  {...rest}
>
  <slot />
</div>
