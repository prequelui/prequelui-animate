<script>
  let { items = [], children = undefined } = $props();
  let position = $state(null);

  function open(event) {
    event.preventDefault();
    position = { x: event.clientX, y: event.clientY };
  }
  function close() {
    position = null;
  }
  function onKey(event) {
    if (event.key === "Escape") close();
  }
  function select(item) {
    item.onSelect?.();
    close();
  }
</script>

<svelte:window onpointerdown={close} onkeydown={onKey} />

<div class="flex h-24 w-64 items-center justify-center rounded-xl border border-dashed text-[13px] text-muted-foreground" oncontextmenu={open}>
  {#if children}{@render children()}{:else}Right click here{/if}
</div>

{#if position}
  <div
    role="menu"
    class="ctx-panel fixed z-50 min-w-[190px] origin-top-left rounded-xl border bg-background p-1 shadow-xl"
    style={`left:${position.x}px;top:${position.y}px`}
    onpointerdown={(event) => event.stopPropagation()}
  >
    {#each items as item, index (item.label ?? index)}
      {#if item.separator}
        <div role="separator" class="my-1 h-px bg-border"></div>
      {:else}
        <button type="button" role="menuitem" class="ctx-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent" style={`animation-delay:${index * 30}ms`} onclick={() => select(item)}>
          <span>{item.label}</span>
          {#if item.shortcut}<span class="font-mono text-[13px] text-muted-foreground">{item.shortcut}</span>{/if}
        </button>
      {/if}
    {/each}
  </div>
{/if}

<style>
  .ctx-panel { animation: ctx-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .ctx-row { animation: ctx-row 200ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  @keyframes ctx-in { from { opacity: 0; transform: scale(0.96); } }
  @keyframes ctx-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
  @media (prefers-reduced-motion: reduce) { .ctx-panel, .ctx-row { animation: none; } }
</style>
