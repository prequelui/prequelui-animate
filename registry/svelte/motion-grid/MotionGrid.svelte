<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    count = 35,
    columns = 7,
    dotSize = 8,
    gap = 10,
    speed = 1.4,
    stagger = 0.07,
    pauseOnHover = true,
    class: className = "",
    ...rest
  } = $props();

  let root;
  const controls = [];

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function play() {
    controls.length = 0;
    if (!root || reduce()) return;
    const nodes = Array.from(root.children);
    nodes.forEach((node, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      controls.push(
        animate(
          node,
          { scale: [0.65, 1, 0.65], opacity: [0.3, 1, 0.3] },
          {
            duration: speed,
            repeat: Infinity,
            delay: (row + column) * stagger,
            ease: "easeInOut",
          },
        ),
      );
    });
  }

  function pause() {
    if (!pauseOnHover || !root) return;
    controls.forEach((control) => control.stop?.());
    Array.from(root.children).forEach((node) => {
      node.style.opacity = "0.35";
      node.style.transform = "scale(1)";
    });
  }

  onMount(() => {
    play();
    return () => controls.forEach((control) => control.stop?.());
  });
</script>

<div
  bind:this={root}
  data-slot="motion-grid"
  aria-hidden="true"
  class={`grid w-fit ${className}`}
  style={`grid-template-columns:repeat(${columns}, minmax(0, 1fr));gap:${gap}px`}
  onpointerenter={pause}
  onpointerleave={play}
  {...rest}
>
  {#each Array.from({ length: count }) as _, index (index)}
    <span
      class="rounded-full bg-foreground"
      style={`width:${dotSize}px;height:${dotSize}px;opacity:0.55`}
    ></span>
  {/each}
</div>
