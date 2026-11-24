<script>
  import { X } from "lucide-svelte";

  let {
    trigger = "Open sheet",
    title = "Workspace",
    description = "Choose where this project lives.",
    side = "right",
    open = undefined,
    defaultOpen = false,
    onOpenChange = undefined,
    children = undefined,
  } = $props();

  let internal = $state(defaultOpen);
  const value = $derived(open === undefined ? internal : open);

  function setOpen(next) {
    if (open === undefined) internal = next;
    onOpenChange?.(next);
  }
  function onKey(event) {
    if (event.key === "Escape" && value) setOpen(false);
  }
</script>

<svelte:window onkeydown={onKey} />

<button
  type="button"
  class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium"
  onclick={() => setOpen(true)}
>
  {trigger}
</button>

{#if value}
  <div class="fixed inset-0 z-50">
    <button
      type="button"
      aria-label="Close sheet"
      class="sheet-veil absolute inset-0 bg-black/20 backdrop-blur-[3px]"
      onclick={() => setOpen(false)}
    ></button>
    <div
      role="dialog"
      aria-modal="true"
      class="sheet-panel absolute top-0 flex h-full w-[85%] max-w-sm flex-col border bg-popover p-5 shadow-2xl"
      data-side={side}
      class:right-0={side === "right"}
      class:border-l={side === "right"}
      class:left-0={side !== "right"}
      class:border-r={side !== "right"}
    >
      <button
        type="button"
        aria-label="Close"
        class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent"
        onclick={() => setOpen(false)}
      >
        <X class="size-4" />
      </button>
      <h2 class="pr-8 text-[15px] font-medium">{title}</h2>
      <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">{description}</p>
      {#if children}{@render children()}{/if}
    </div>
  </div>
{/if}

<style>
  .sheet-veil { animation: veil-in 400ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .sheet-panel { animation: sheet-in 400ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .sheet-panel[data-side="right"] { animation-name: sheet-in-right; }
  .sheet-panel[data-side="left"] { animation-name: sheet-in-left; }
  @keyframes veil-in { from { opacity: 0; } }
  @keyframes sheet-in-right { from { transform: translateX(100%); } }
  @keyframes sheet-in-left { from { transform: translateX(-100%); } }
  @media (prefers-reduced-motion: reduce) {
    .sheet-veil, .sheet-panel { animation: sheet-fade 200ms linear both; }
    @keyframes sheet-fade { from { opacity: 0; } }
  }
</style>
