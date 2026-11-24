<script>
  let {
    menus = [
      { label: "File", items: [{ label: "New file", shortcut: "⌘N" }, { label: "Open", shortcut: "⌘O" }, { separator: true, label: "sep" }, { label: "Save", shortcut: "⌘S" }] },
      { label: "Edit", items: [{ label: "Undo", shortcut: "⌘Z" }, { label: "Redo", shortcut: "⇧⌘Z" }] },
      { label: "View", items: [{ label: "Zoom in" }, { label: "Zoom out" }] },
    ],
  } = $props();

  let open = $state(null);
  let root = $state(null);

  function onPointer(event) {
    if (open !== null && root && !root.contains(event.target)) open = null;
  }
  function onKey(event) {
    if (event.key === "Escape") open = null;
  }
  function select(item) {
    item.onSelect?.();
    open = null;
  }
</script>

<svelte:window onpointerdown={onPointer} onkeydown={onKey} />

<div bind:this={root} role="menubar" class="flex items-center gap-1 rounded-lg border p-1">
  {#each menus as menu, index (menu.label)}
    <div class="relative">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open === index}
        class="h-7 rounded-md px-2.5 text-[13px] font-medium transition-colors"
        class:bg-accent={open === index}
        class:text-foreground={open === index}
        class:text-muted-foreground={open !== index}
        onclick={() => (open = open === index ? null : index)}
        onpointerenter={() => open !== null && (open = index)}
      >
        {menu.label}
      </button>
      {#if open === index}
        <div role="menu" class="mb-panel absolute left-0 top-full z-40 mt-1 min-w-[190px] rounded-xl border bg-background p-1 shadow-xl">
          {#each menu.items as item, itemIndex (item.label ?? itemIndex)}
            {#if item.separator}
              <div role="separator" class="my-1 h-px bg-border"></div>
            {:else}
              <button type="button" role="menuitem" class="mb-row flex w-full items-center justify-between gap-6 rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent" style={`animation-delay:${itemIndex * 30}ms`} onclick={() => select(item)}>
                <span>{item.label}</span>
                {#if item.shortcut}<span class="font-mono text-[13px] text-muted-foreground">{item.shortcut}</span>{/if}
              </button>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .mb-panel { animation: mb-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .mb-row { animation: mb-row 200ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  @keyframes mb-in { from { opacity: 0; } }
  @keyframes mb-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
  @media (prefers-reduced-motion: reduce) { .mb-panel, .mb-row { animation: none; } }
</style>
