<script>
  import { onDestroy, tick } from "svelte";
  import { animate } from "motion";

  let {
    shimmerColor = "color-mix(in oklab, var(--primary-foreground) 55%, transparent)",
    shimmerDuration = 900,
    shimmerDelay = 60,
    shimmer = true,
    tapScale = 0.97,
    transition = undefined,
    type = "button",
    disabled = false,
    class: className = "",
    onclick = undefined,
    onpointerenter = undefined,
    children = undefined,
    ...rest
  } = $props();

  const pressSpring = transition ?? {
    type: "spring",
    stiffness: 550,
    damping: 30,
    restSpeed: 10,
  };

  let button;
  let beam;
  let run = $state(0);
  let timer;
  let controls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function play(delay = shimmerDelay) {
    if (!shimmer || reduce()) return;
    clearTimeout(timer);
    timer = setTimeout(async () => {
      run += 1;
      await tick();
      if (!beam) return;
      controls = animate(
        beam,
        { x: ["-180%", "260%"], skewX: -14, opacity: [0, 1, 1, 0] },
        {
          duration: shimmerDuration / 1000,
          ease: [0.33, 0, 0.2, 1],
          times: [0, 0.16, 0.72, 1],
        },
      );
    }, delay);
  }

  function press() {
    if (!button || reduce()) return;
    animate(button, { scale: tapScale }, pressSpring);
  }

  function release() {
    if (!button || reduce()) return;
    animate(button, { scale: 1 }, pressSpring);
  }

  onDestroy(() => {
    clearTimeout(timer);
    controls?.stop?.();
  });
</script>

<button
  bind:this={button}
  {type}
  {disabled}
  data-slot="shimmer-button"
  class={`relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  onpointerenter={(event) => {
    onpointerenter?.(event);
    if (event.pointerType !== "touch") play();
  }}
  onclick={(event) => {
    onclick?.(event);
    play(0);
  }}
  onpointerdown={() => !disabled && press()}
  onpointerup={release}
  onpointercancel={release}
  onpointerleave={release}
  {...rest}
>
  {#if run > 0}
    <span
      bind:this={beam}
      aria-hidden="true"
      data-slot="shimmer-button-beam"
      class="pointer-events-none absolute inset-y-0 left-0 z-0 w-[52%] opacity-0"
      style={`background:linear-gradient(105deg, transparent 0%, ${shimmerColor} 50%, transparent 100%)`}
    ></span>
  {/if}
  <span class="relative z-10 inline-flex items-center gap-2">
    {#if children}{@render children()}{/if}
  </span>
</button>
