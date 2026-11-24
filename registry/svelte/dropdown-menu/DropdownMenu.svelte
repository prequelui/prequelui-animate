<script>
  import { ChevronDown } from "lucide-svelte";

  let { trigger = "Actions", items = [], align = "start" } = $props();
  let open = $state(false);
  let root = $state(null);

  function onPointer(event) {
    if (open && root && !root.contains(event.target)) open = false;
  }
  function onKey(event) {
    if (event.key === "Escape") open = false;
  }
  function select(item) {
    item.onSelect?.();
    open = false;
  }
</script>

<svelte:window onpointerdown={onPointer} onkeydown={onKey} />

<div bind:this={root} class="relative inline-block">
  <button
    type="button"
    aria-haspopup="menu"
    aria-expanded={open}
    class="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-[13px] font-medium"
    onclick={() => (open = !open)}
  >
    {trigger}
    <ChevronDown class="size-3.5 text-muted-foreground" />
  </button>
  {#if open}
    <div
      role="menu"
      class="menu-panel absolute top-full z-40 mt-1.5 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl"
      class:right-0={align === "end"}
      class:left-0={align !== "end"}
    >
      {#each items as item, index (item.label ?? index)}
        {#if item.separator}
          <div role="separator" class="my-1 h-px bg-border"></div>
        {:else}
          <button
            type="button"
            role="menuitem"
            class="menu-item flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
            style={`animation-delay:${index * 30}ms`}
            onclick={() => select(item)}
          >
            <span>{item.label}</span>
            {#if item.shortcut}
              <span class="font-mono text-[13px] text-muted-foreground">{item.shortcut}</span>
            {/if}
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .menu-panel { animation: menu-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .menu-item { animation: menu-item-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  @keyframes menu-in { from { opacity: 0; } }
  @keyframes menu-item-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
  @media (prefers-reduced-motion: reduce) {
    .menu-panel, .menu-item { animation: none; }
  }
</style>
