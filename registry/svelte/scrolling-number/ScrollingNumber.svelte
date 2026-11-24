<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    number,
    fromNumber = 0,
    step = 1,
    itemsSize = 30,
    sideItemsCount = 2,
    inView = false,
    inViewOnce = true,
    delay = 0,
    transition = undefined,
    onCompleted = undefined,
    class: className = "",
    ...rest
  } = $props();

  const bandSpring = {
    type: "spring",
    stiffness: 90,
    damping: 30,
    restDelta: 0.001,
    restSpeed: 0.01,
  };

  let root;
  let band;
  let started = $state(false);
  let observer;
  let timer;
  let controls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let values = $derived.by(() => {
    const size = Math.max(1, step);
    const from = Math.round(fromNumber / size) * size;
    const to = Math.round(number / size) * size;
    const direction = to >= from ? 1 : -1;
    const count = Math.abs(Math.round((to - from) / size)) + 1;
    return Array.from(
      { length: count },
      (_, index) => from + index * size * direction,
    );
  });

  let targetIndex = $derived(values.length - 1);
  let height = $derived(itemsSize * (1 + sideItemsCount * 2));
  let initialY = $derived(sideItemsCount * itemsSize);
  let finalY = $derived((sideItemsCount - targetIndex) * itemsSize);

  function move() {
    if (!band) return;
    controls?.stop?.();
    if (reduce()) {
      band.style.transform = `translateY(${finalY}px)`;
      onCompleted?.();
      return;
    }
    controls = animate(band, { y: finalY }, {
      ...(transition ?? bandSpring),
    });
    controls.finished.then(() => onCompleted?.());
  }

  function start() {
    if (started) return;
    if (reduce()) {
      started = true;
      tick().then(move);
      return;
    }
    timer = setTimeout(() => {
      started = true;
      tick().then(move);
    }, delay);
  }

  let lastFinalY = finalY;

  $effect(() => {
    const current = finalY;
    if (current === lastFinalY) return;
    lastFinalY = current;
    if (started) tick().then(move);
  });

  onMount(() => {
    if (band) band.style.transform = `translateY(${initialY}px)`;
    if (!inView) {
      start();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        start();
        if (inViewOnce) observer?.disconnect();
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
  });

  onDestroy(() => {
    clearTimeout(timer);
    controls?.stop?.();
    observer?.disconnect();
  });
</script>

<div
  bind:this={root}
  data-slot="scrolling-number"
  class={`relative isolate inline-block overflow-hidden rounded-lg [mask-image:linear-gradient(to_bottom,transparent,black_24%,black_76%,transparent)] ${className}`}
  style={`height: ${height}px`}
  {...rest}
>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-x-1 top-1/2 z-10 -translate-y-1/2 rounded-md border bg-foreground/[0.06] dark:bg-background/20"
    style={`height: ${itemsSize}px`}
  ></div>
  <div bind:this={band} aria-hidden="true" class="relative flex flex-col">
    {#each values as value (value)}
      <div
        class={`flex shrink-0 items-center justify-center font-medium tabular-nums ${
          value === number ? "text-foreground" : "text-muted-foreground/50"
        }`}
        style={`height: ${itemsSize}px`}
      >
        {value.toLocaleString("en-US")}
      </div>
    {/each}
  </div>
  <span class="sr-only">{number.toLocaleString("en-US")}</span>
</div>
