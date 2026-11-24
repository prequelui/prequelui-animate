<script>
  import { onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    animate: enabled = true,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    trigger = 0,
    side = "top",
    align = "center",
    count = 6,
    radius = 30,
    spread = 360,
    duration = 0.8,
    holdDelay = 0.05,
    sideOffset = 0,
    alignOffset = 0,
    delay = 0,
    size = 4,
    color = "currentColor",
    transition = undefined,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let layer;
  let onScreen = $state(!inView);
  let bursts = $state([]);
  let observer;
  let timer;
  let generation = 0;
  let controls = [];

  const vertical = $derived(side === "top" || side === "bottom");
  const alignPercent = $derived(
    align === "start" ? "0%" : align === "end" ? "100%" : "50%",
  );

  const top = $derived(
    vertical
      ? side === "top"
        ? `calc(0% - ${sideOffset}px)`
        : `calc(100% + ${sideOffset}px)`
      : `calc(${alignPercent} + ${alignOffset}px)`,
  );

  const left = $derived(
    vertical
      ? `calc(${alignPercent} + ${alignOffset}px)`
      : side === "left"
        ? `calc(0% - ${sideOffset}px)`
        : `calc(100% + ${sideOffset}px)`,
  );

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stopControls() {
    for (const control of controls) control?.stop?.();
    controls = [];
  }

  async function burst() {
    if (!enabled || !onScreen || reduce()) return;
    generation += 1;
    const current = generation;
    bursts = Array.from({ length: count }, (_, index) => ({
      key: `${current}-${index}`,
      index,
    }));

    await tick();
    const nodes = Array.from(layer?.children ?? []);
    const fullCircle = spread % 360 === 0;
    const step =
      ((spread * Math.PI) / 180) /
      Math.max(1, fullCircle ? count : count - 1);

    nodes.forEach((node, index) => {
      const angle = index * step;
      const x = Math.round(Math.cos(angle) * radius * 100) / 100;
      const y = Math.round(Math.sin(angle) * radius * 100) / 100;
      controls.push(
        animate(
          node,
          {
            x: [0, x],
            y: [0, y],
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          },
          {
            duration,
            delay: delay + index * holdDelay,
            ease: "easeOut",
            ...(transition ?? {}),
          },
        ),
      );
    });

    const total = (duration + delay + holdDelay * (count - 1)) * 1000;
    clearTimeout(timer);
    timer = setTimeout(() => {
      bursts = [];
    }, total + 80);
  }

  export function fire() {
    return burst();
  }

  $effect(() => {
    const value = trigger;
    if (value === 0) return;
    burst();
  });

  onMount(() => {
    if (!inView) return;
    observer = new IntersectionObserver(
      (records) => {
        const visible = records.some((record) => record.isIntersecting);
        onScreen = visible;
        if (visible && inViewOnce) observer?.disconnect();
      },
      { threshold: 0.35, rootMargin: inViewMargin },
    );
    if (root) observer.observe(root);

    return () => {
      observer?.disconnect();
      clearTimeout(timer);
      stopControls();
    };
  });
</script>

<div
  bind:this={root}
  data-slot="particles"
  class={`relative ${className}`}
  {...rest}
>
  <slot />
  <div
    bind:this={layer}
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-10"
  >
    {#each bursts as dot (dot.key)}
      <span
        class="pointer-events-none absolute rounded-full"
        style={`top:${top};left:${left};width:${size}px;height:${size}px;margin-left:${-size / 2}px;margin-top:${-size / 2}px;background:${color}`}
      ></span>
    {/each}
  </div>
</div>
