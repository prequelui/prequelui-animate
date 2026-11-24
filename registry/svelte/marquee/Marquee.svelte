<script>
  import { onMount, tick } from "svelte";

  let {
    speed = 42,
    reverse = false,
    pauseOnHover = true,
    fade = true,
    gap = 32,
    repeat = 2,
    itemClassName = "",
    class: className = "",
    ...rest
  } = $props();

  let root;
  let track;
  let paused = $state(false);
  let ready = false;
  let span = 0;
  let position = 0;
  let raf = 0;
  let last = 0;
  let observer;
  let measured = false;

  const copies = $derived(Math.max(2, Math.round(repeat)));

  const mask = $derived(
    fade
      ? {
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }
      : {},
  );

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function apply() {
    if (track) track.style.transform = `translate3d(${position}px, 0, 0)`;
  }

  function measure() {
    const first = track?.children?.[0];
    if (!first) return;
    const width = first.scrollWidth + gap;
    span = width;
    if (reverse) position = -width;
    ready = width > 0;
    apply();
  }

  function frame(now) {
    if (!last) last = now;
    const delta = Math.min(now - last, 64);
    last = now;

    if (!reduce() && !paused && ready && speed > 0) {
      const direction = reverse ? 1 : -1;
      let next = position + (direction * speed * delta) / 1000;
      if (span > 0) {
        if (!reverse && next <= -span) next += span;
        if (reverse && next >= 0) next -= span;
        position = next;
        apply();
      }
    }

    raf = requestAnimationFrame(frame);
  }

  $effect(() => {
    gap;
    reverse;
    repeat;
    if (!measured) return;
    tick().then(measure);
  });

  onMount(() => {
    measured = true;
    measure();
    if (track?.children?.[0]) {
      observer = new ResizeObserver(measure);
      observer.observe(track.children[0]);
    }
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  });
</script>

<div
  bind:this={root}
  data-slot="marquee"
  class={`relative overflow-hidden ${className}`}
  style={mask}
  onpointerenter={() => {
    if (pauseOnHover) paused = true;
  }}
  onpointerleave={() => {
    if (pauseOnHover) paused = false;
  }}
  {...rest}
>
  <div
    bind:this={track}
    class="flex w-max items-center will-change-transform"
    style={`gap:${gap}px`}
    data-paused={paused ? "true" : undefined}
  >
    {#each Array.from({ length: copies }) as _, copy (copy)}
      <div
        aria-hidden={copy > 0 ? "true" : undefined}
        class={`flex shrink-0 items-center ${itemClassName}`}
        style={`gap:${gap}px`}
      >
        <slot />
      </div>
    {/each}
  </div>
</div>
