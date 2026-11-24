<script>
  let {
    trigger = "Share project",
    title = "Anyone with the link",
    description = "People with the link can view this project but cannot edit it.",
    side = "bottom",
    children = undefined,
  } = $props();

  let open = $state(false);
  let root = $state(null);

  function onPointer(event) {
    if (open && root && !root.contains(event.target)) open = false;
  }
  function onKey(event) {
    if (event.key === "Escape") open = false;
  }
</script>

<svelte:window onpointerdown={onPointer} onkeydown={onKey} />

<div bind:this={root} class="relative inline-block">
  <button
    type="button"
    aria-haspopup="dialog"
    aria-expanded={open}
    class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
    onclick={() => (open = !open)}
  >
    {trigger}
  </button>
  {#if open}
    <div
      role="dialog"
      class="pop absolute left-0 z-40 w-64 rounded-xl border bg-popover p-3 text-popover-foreground shadow-xl"
      class:bottom-full={side === "top"}
      class:mb-2={side === "top"}
      class:top-full={side !== "top"}
      class:mt-2={side !== "top"}
    >
      <p class="text-[13px] font-medium">{title}</p>
      <p class="mt-1 text-[13px] leading-5 text-muted-foreground">{description}</p>
      {#if children}{@render children()}{/if}
    </div>
  {/if}
</div>

<style>
  .pop { animation: pop-in 320ms cubic-bezier(0.23, 1, 0.32, 1) both; transform-origin: top; }
  @keyframes pop-in { from { opacity: 0; transform: scale(0.8); } }
  @media (prefers-reduced-motion: reduce) {
    .pop { animation: pop-fade 150ms linear both; }
    @keyframes pop-fade { from { opacity: 0; } }
  }
</style>
