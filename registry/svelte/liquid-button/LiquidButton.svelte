<script>
  import { animate } from "motion";

  let {
    delay = "0.3s",
    fillHeight = "3px",
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

  let button;
  let fill;
  let hovered = $state(false);
  let pointerHovered = false;
  const seconds = Number.parseFloat(delay) || 0.3;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function paint(next) {
    hovered = next;
    if (!fill) return;
    const active = next && !reduce();
    if (reduce()) {
      fill.style.transform = `scaleY(${active ? 1 : 0.06})`;
      fill.style.opacity = active ? "1" : "0.55";
      return;
    }
    animate(
      fill,
      { scaleY: active ? 1 : 0.06, opacity: active ? 1 : 0.55 },
      { duration: seconds, ease: [0.25, 0.1, 0.35, 1] },
    );
  }

  function press() {
    if (!button || reduce()) return;
    animate(button, { scale: tapScale }, pressSpring);
  }

  function release() {
    if (!button || reduce()) return;
    animate(
      button,
      { scale: pointerHovered && hoverScale !== 1 ? hoverScale : 1 },
      pressSpring,
    );
  }

  function enter() {
    pointerHovered = true;
    paint(true);
    release();
  }

  function leave() {
    pointerHovered = false;
    paint(false);
    release();
  }
</script>

<button
  bind:this={button}
  {type}
  {disabled}
  data-slot="liquid-button"
  class={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-background px-4 text-[13px] font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 ${className}`}
  onpointerenter={enter}
  onpointerleave={leave}
  onpointercancel={release}
  onfocus={() => paint(true)}
  onblur={() => paint(false)}
  onpointerdown={() => !disabled && press()}
  onpointerup={release}
  {...rest}
>
  <span
    bind:this={fill}
    aria-hidden="true"
    class="pointer-events-none absolute inset-x-0 bottom-0 origin-bottom bg-primary"
    style={`height:${hovered ? "100%" : fillHeight};opacity:0.55;transform:scaleY(0.06)`}
  ></span>
  <span
    class="relative z-10 transition-colors {hovered && !reduce()
      ? 'text-primary-foreground'
      : 'text-foreground'}"
    style={`transition-duration:${seconds}s`}
  >
    {#if children}{@render children()}{/if}
  </span>
</button>
