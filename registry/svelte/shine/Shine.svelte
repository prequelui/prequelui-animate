<script>
  import { onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    color = "currentColor",
    opacity = 0.3,
    delay = 0,
    duration = 1200,
    loop = false,
    loopDelay = 0,
    deg = -15,
    enable = true,
    enableOnHover = false,
    enableOnTap = false,
    as = "div",
    class: className = "",
    ...rest
  } = $props();

  let overlay;
  let run = $state(0);
  let hovered = $state(false);
  let reduced = $state(false);
  let timer;
  let control;

  const active = $derived(enable && !reduced);
  const alwaysOn = $derived(active && !enableOnHover && !enableOnTap);

  function clearTimer() {
    clearTimeout(timer);
    timer = undefined;
  }

  function play() {
    run += 1;
  }

  function scheduleNext() {
    clearTimer();
    const on = alwaysOn || (enableOnHover && hovered);
    if (!loop || !on) return;
    timer = setTimeout(play, loopDelay);
  }

  function enter() {
    if (!active || !enableOnHover || alwaysOn) return;
    hovered = true;
    play();
  }

  function leave() {
    if (!active || !enableOnHover || alwaysOn) return;
    hovered = false;
    clearTimer();
  }

  function down() {
    if (!active || !enableOnTap || alwaysOn) return;
    play();
  }

  $effect(() => {
    const current = run;
    alwaysOn;
    if (!current) return;
    tick().then(() => {
      if (!overlay) return;
      control?.stop?.();
      control = animate(
        overlay,
        { x: ["-100%", "100%"], skewX: deg },
        {
          duration: duration / 1000,
          ease: [0.4, 0, 0.2, 1],
          delay: delay / 1000,
        },
      );
      control.finished.then(scheduleNext, scheduleNext);
    });
  });

  $effect(() => {
    alwaysOn;
    clearTimer();
    run = alwaysOn ? 1 : 0;
  });

  onMount(() => {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    run = alwaysOn ? 1 : 0;
    return () => {
      clearTimer();
      control?.stop?.();
    };
  });
</script>

<svelte:element
  this={as}
  data-slot="shine"
  class={`relative overflow-hidden ${className}`}
  onmouseenter={enter}
  onmouseleave={leave}
  onpointerdown={down}
  {...rest}
>
  <slot />
  {#if active && run > 0}
    <span
      bind:this={overlay}
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 z-10 block h-full w-full"
      style={`background:linear-gradient(to right, transparent, ${color}, transparent);opacity:${opacity}`}
    ></span>
  {/if}
</svelte:element>
