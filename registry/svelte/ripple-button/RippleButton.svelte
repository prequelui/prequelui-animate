<script>
  import { onDestroy, tick } from "svelte";
  import { animate } from "motion";

  let {
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
  let rippleWrap;
  let ripples = $state([]);
  let hovered = false;
  let nextId = 0;
  const timers = new Set();

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

  async function click(event) {
    if (!button) {
      onclick?.(event);
      return;
    }
    const rect = button.getBoundingClientRect();
    const scaleX = rect.width ? button.offsetWidth / rect.width : 1;
    const scaleY = rect.height ? button.offsetHeight / rect.height : 1;
    const id = nextId++;
    ripples = [
      ...ripples,
      {
        id,
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      },
    ];
    onclick?.(event);
    await tick();
    const node = rippleWrap?.querySelector(`[data-ripple="${id}"]`);
    if (node) {
      if (reduce()) {
        animate(node, { opacity: [0.5, 0] }, { duration: 0.6, ease: "easeOut" });
      } else {
        animate(
          node,
          { scale: [0, 10], opacity: [0.5, 0] },
          { duration: 0.6, ease: "easeOut" },
        );
      }
    }
    const timer = setTimeout(() => {
      ripples = ripples.filter((item) => item.id !== id);
      timers.delete(timer);
    }, 650);
    timers.add(timer);
  }

  onDestroy(() => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
  });
</script>

<button
  bind:this={button}
  {type}
  {disabled}
  data-slot="ripple-button"
  class={`relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground disabled:pointer-events-none disabled:opacity-50 ${className}`}
  onclick={click}
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
  <span bind:this={rippleWrap} aria-hidden="true" class="pointer-events-none absolute inset-0">
    {#each ripples as ripple (ripple.id)}
      <span
        data-ripple={ripple.id}
        class="absolute size-5 rounded-full bg-current opacity-50"
        style={`left:${ripple.x - 10}px;top:${ripple.y - 10}px`}
      ></span>
    {/each}
  </span>
</button>
