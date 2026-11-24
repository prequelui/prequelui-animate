<script>
  let {
    trigger = "@prequelui",
    title = "PrequelUI Animate",
    description = "Animated primitives for interfaces that already have a design system.",
    children = undefined,
  } = $props();

  let open = $state(false);
  let enterTimer;
  let leaveTimer;

  function show() {
    clearTimeout(leaveTimer);
    enterTimer = setTimeout(() => (open = true), 200);
  }
  function hide() {
    clearTimeout(enterTimer);
    leaveTimer = setTimeout(() => (open = false), 150);
  }
</script>

<span class="relative inline-block" onpointerenter={show} onpointerleave={hide} onfocusin={show} onfocusout={hide}>
  <button type="button" class="text-[13px] font-medium underline decoration-border underline-offset-4">
    {trigger}
  </button>
  {#if open}
    <div class="card absolute left-0 top-full z-40 mt-2 w-64 rounded-xl border bg-background p-4 shadow-xl">
      <p class="text-[13px] font-medium">{title}</p>
      <p class="mt-1 text-[13px] leading-6 text-muted-foreground">{description}</p>
      {#if children}{@render children()}{/if}
    </div>
  {/if}
</span>

<style>
  .card { animation: card-pop 320ms cubic-bezier(0.23, 1, 0.32, 1) both; }
  @keyframes card-pop { from { opacity: 0; transform: translateY(4px) scale(0.95); filter: blur(2px); } }
  @media (prefers-reduced-motion: reduce) {
    .card { animation: card-fade 200ms linear both; }
    @keyframes card-fade { from { opacity: 0; } }
  }
</style>
