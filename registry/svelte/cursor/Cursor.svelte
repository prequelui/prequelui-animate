<script>
  import { tick } from "svelte";
  import { animate } from "motion";

  let {
    label = "",
    dotSize = 12,
    labelGap = 14,
    hideNative = true,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let dot;
  let tip;
  let inside = $state(false);
  let showControls = [];
  let tipControls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  async function show() {
    inside = true;
    await tick();
    if (!dot) return;
    const options = reduce()
      ? { duration: 0 }
      : { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 };
    showControls = [animate(dot, { scale: [0, 1], opacity: [0, 1] }, options)];
    if (tip) {
      showControls.push(
        animate(
          tip,
          { scale: [0.8, 1], opacity: [0, 1] },
          reduce()
            ? { duration: 0 }
            : { type: "spring", stiffness: 550, damping: 46.9, restSpeed: 10 },
        ),
      );
    }
  }

  function hide() {
    if (!dot) return;
    const options = reduce()
      ? { duration: 0 }
      : { type: "spring", stiffness: 550, damping: 46.9, restSpeed: 10 };
    const controls = [animate(dot, { scale: 0, opacity: 0 }, options)];
    if (tip) controls.push(animate(tip, { scale: 0.8, opacity: 0 }, options));
    Promise.all(controls.map((control) => control.finished)).then(() => {
      inside = false;
    });
  }

  function move(event) {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (dot) {
      dot.style.transform = `translate3d(${x - dotSize / 2}px, ${y - dotSize / 2}px, 0)`;
    }
    if (tip) {
      tipControls?.stop?.();
      tipControls = animate(
        tip,
        { x: x + labelGap, y: y + labelGap - 8 },
        reduce()
          ? { duration: 0 }
          : { type: "spring", stiffness: 500, damping: 50, bounce: 0 },
      );
    }
  }
</script>

<div
  bind:this={root}
  data-slot="cursor"
  class={`relative ${hideNative ? "cursor-none" : ""} ${className}`}
  onpointermove={move}
  onpointerenter={show}
  onpointerleave={hide}
  {...rest}
>
  <slot />
  {#if inside}
    <span
      bind:this={dot}
      aria-hidden="true"
      data-slot="cursor-dot"
      class="pointer-events-none absolute left-0 top-0 z-50 rounded-full bg-foreground"
      style={`width:${dotSize}px;height:${dotSize}px;opacity:0`}
    ></span>
    {#if label}
      <span
        bind:this={tip}
        aria-hidden="true"
        data-slot="cursor-label"
        class="pointer-events-none absolute left-0 top-0 z-50 whitespace-nowrap rounded-full bg-foreground px-2 py-0.5 text-[13px] font-medium text-background"
        style="opacity:0"
      >
        {label}
      </span>
    {/if}
  {/if}
</div>
