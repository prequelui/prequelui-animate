<script>
  import { ChevronDown } from "lucide-svelte";

  let {
    items = [
      { label: "Components", content: "Every primitive, with the same motion contract." },
      { label: "Templates", content: "Full pages built on the same tokens." },
      { label: "Docs", content: "Installation, accessibility and API references." },
    ],
  } = $props();

  let open = $state(null);
  let root = $state(null);
  let timer;

  function scheduleClose() {
    clearTimeout(timer);
    timer = setTimeout(() => (open = null), 180);
  }
  function cancelClose() {
    clearTimeout(timer);
  }
  function onPointer(event) {
    if (open !== null && root && !root.contains(event.target)) open = null;
  }
  function onKey(event) {
    if (event.key === "Escape") open = null;
  }
</script>

<svelte:window onpointerdown={onPointer} onkeydown={onKey} />

<div bind:this={root} class="relative w-full max-w-sm" onpointerleave={scheduleClose} onpointerenter={cancelClose}>
  <div role="menubar" class="flex items-center gap-1 rounded-lg border p-1">
    {#each items as item, index (item.label)}
      <button
        type="button"
        aria-expanded={open === index}
        class="flex h-7 items-center gap-1 rounded-md px-2.5 text-[13px] font-medium transition-colors"
        class:bg-accent={open === index}
        class:text-foreground={open === index}
        class:text-muted-foreground={open !== index}
        onclick={() => (open = open === index ? null : index)}
        onpointerenter={() => (open = index)}
      >
        {item.label}
        <ChevronDown
          class={`size-3 transition-transform ${open === index ? "rotate-180" : ""}`}
        />
      </button>
    {/each}
  </div>
  {#if open !== null}
    <div class="nav-panel absolute left-0 top-full z-40 mt-1.5 w-full overflow-hidden rounded-xl border bg-background p-4 shadow-xl">
      <div class="nav-content text-[13px] leading-6 text-muted-foreground" data-index={open}>
        {items[open]?.content}
      </div>
    </div>
  {/if}
</div>

<style>
  .nav-panel { animation: nav-in 240ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .nav-content { animation: nav-content 200ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  @keyframes nav-in { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
  @keyframes nav-content { from { opacity: 0; transform: translateX(6px); } }
  @media (prefers-reduced-motion: reduce) { .nav-panel, .nav-content { animation: none; } }
</style>
