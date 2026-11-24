<script>
  import { ArrowUpRight } from "lucide-svelte";

  let {
    href = "https://prequelui.dev",
    trigger = "prequelui.dev",
    title = "PrequelUI Animate",
    description = "Motion for the primitives you already use.",
    image = "",
    delay = 200,
    closeDelay = 150,
  } = $props();

  let open = $state(false);
  let enterTimer;
  let leaveTimer;

  function show() {
    clearTimeout(leaveTimer);
    enterTimer = setTimeout(() => (open = true), delay);
  }
  function hide() {
    clearTimeout(enterTimer);
    leaveTimer = setTimeout(() => (open = false), closeDelay);
  }
</script>

<span class="relative inline-block" onpointerenter={show} onpointerleave={hide} onfocusin={show} onfocusout={hide}>
  <a
    {href}
    target="_blank"
    rel="noreferrer"
    class="inline-flex items-center gap-1 text-[13px] font-medium underline decoration-border underline-offset-4"
    onclick={(event) => event.preventDefault()}
  >
    {trigger}
    <ArrowUpRight class="size-3.5" />
  </a>
  {#if open}
    <div class="preview absolute left-1/2 top-8 z-40 w-[260px] -translate-x-1/2 overflow-hidden rounded-xl border bg-popover shadow-xl">
      {#if image}
        <img src={image} alt="" class="h-[92px] w-full object-cover" />
      {:else}
        <div class="h-[92px] bg-[radial-gradient(circle_at_30%_20%,#f6c7ae,transparent_60%),linear-gradient(135deg,#efe9df,#dbe7e2)] dark:bg-[radial-gradient(circle_at_30%_20%,#3a2b2b,transparent_60%),linear-gradient(135deg,#1a1a1a,#101816)]"></div>
      {/if}
      <div class="p-3">
        <p class="text-[13px] font-medium">{title}</p>
        <p class="mt-1 text-[13px] leading-5 text-muted-foreground">{description}</p>
      </div>
    </div>
  {/if}
</span>

<style>
  .preview { animation: preview-in 250ms cubic-bezier(0.23, 1, 0.32, 1) both; }
  @keyframes preview-in { from { opacity: 0; transform: translate(-50%, 8px) scale(0.97); filter: blur(6px); } }
  @media (prefers-reduced-motion: reduce) {
    .preview { animation: preview-fade 150ms linear both; }
    @keyframes preview-fade { from { opacity: 0; } }
  }
</style>
