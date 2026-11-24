<script>
  let {
    trigger = "Hover me",
    content = "Saved just now",
    side = "top",
    delay = 180,
    closeDelay = 80,
  } = $props();

  const store = (globalThis.__prequelTip = globalThis.__prequelTip ?? { open: new Set(), cooledAt: 0 });
  const id = Symbol("tooltip");
  let open = $state(false);
  let instant = $state(false);
  let openTimer;
  let closeTimer;

  const sides = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  function show() {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    const warm = store.open.size > 0 || Date.now() - store.cooledAt < 300;
    instant = warm;
    openTimer = setTimeout(
      () => {
        store.open.add(id);
        open = true;
      },
      warm ? 0 : delay,
    );
  }
  function hide() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      store.open.delete(id);
      if (store.open.size === 0) store.cooledAt = Date.now();
      open = false;
      instant = false;
    }, closeDelay);
  }
</script>

<span class="relative inline-flex" onpointerenter={show} onpointerleave={hide} onfocusin={show} onfocusout={hide}>
  <button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium">
    {trigger}
  </button>
  {#if open}
    <span
      role="tooltip"
      class="tip pointer-events-none absolute z-50 whitespace-nowrap rounded-md bg-primary px-2 py-1 text-[13px] font-medium text-primary-foreground shadow-md {sides[side]}"
      class:instant
    >
      {content}
    </span>
  {/if}
</span>

<style>
  .tip { animation: tip-in 320ms cubic-bezier(0.23, 1, 0.32, 1) both; }
  .tip.instant { animation-duration: 1ms; }
  @keyframes tip-in { from { opacity: 0; transform: scale(0.7); filter: blur(6px); } }
  @media (prefers-reduced-motion: reduce) {
    .tip { animation: tip-fade 200ms linear both; }
    @keyframes tip-fade { from { opacity: 0; } }
  }
</style>
