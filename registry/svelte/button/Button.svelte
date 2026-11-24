<script>
  import { animate } from "motion";

  let {
    hoverScale = 1,
    tapScale = 0.97,
    transition = undefined,
    type = "button",
    disabled = false,
    class: className = "",
    children = undefined,
    ...rest
  } = $props();

  const pressSpring = transition ?? {
    type: "spring",
    stiffness: 550,
    damping: 30,
    restSpeed: 10,
  };

  let node;
  let hovered = false;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function move(scale) {
    if (!node || reduce()) return;
    animate(node, { scale }, pressSpring);
  }

  function release() {
    move(hovered && hoverScale !== 1 ? hoverScale : 1);
  }
</script>

<button
  bind:this={node}
  data-slot="button"
  {type}
  {disabled}
  class={`inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
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
  {...rest}
>
  {#if children}{@render children()}{/if}
</button>
