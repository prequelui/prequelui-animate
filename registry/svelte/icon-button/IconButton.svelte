<script>
  import { animate } from "motion";

  let {
    size = 4,
    count = 8,
    distance = 24,
    hoverScale = 1,
    tapScale = 0.97,
    transition = undefined,
    type = "button",
    disabled = false,
    class: className = "",
    onclick = undefined,
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
  let particles;
  let hovered = false;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function move(scale) {
    if (!button || reduce()) return;
    animate(button, { scale }, pressSpring);
  }

  function release() {
    move(hovered && hoverScale !== 1 ? hoverScale : 1);
  }

  function burst(event) {
    onclick?.(event);
    if (reduce()) return;
    const nodes = particles ? Array.from(particles.children) : [];
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      animate(
        node,
        {
          opacity: [1, 0],
          x: [0, Math.cos(angle) * distance],
          y: [0, Math.sin(angle) * distance],
          scale: [1, 0.2],
        },
        { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
      );
    });
  }
</script>

<button
  bind:this={button}
  {type}
  {disabled}
  data-slot="icon-button"
  class={`relative inline-flex size-10 items-center justify-center rounded-lg border bg-background p-0 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  onpointerdown={() => !disabled && move(tapScale)}
  onpointerup={release}
  onpointercancel={release}
  onpointerenter={() => {
    hovered = true;
    if (hoverScale !== 1) move(hoverScale);
  }}
  onpointerleave={() => {
    hovered = false;
    move(1);
  }}
  onclick={burst}
  {...rest}
>
  {#if children}{@render children()}{/if}
  <span
    bind:this={particles}
    data-slot="icon-button-particles"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0"
  >
    {#each Array.from({ length: count }) as _, index}
      <span
        class="absolute left-1/2 top-1/2 rounded-full bg-current opacity-0"
        style={`width:${size}px;height:${size}px`}
      ></span>
    {/each}
  </span>
</button>
