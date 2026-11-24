<script>
  import { X } from "lucide-svelte";
  import { cubicBezier } from "motion";

  let {
    open = undefined,
    defaultOpen = false,
    onOpenChange = undefined,
    trigger = "Open drawer",
    title = "Notifications",
    description = "Updates from the projects you follow.",
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

  const drawerEase = cubicBezier(0.34, 1.2, 0.64, 1);
  function veil() {
    return { duration: 400, easing: cubicBezier(0.215, 0.61, 0.355, 1), css: (t) => `opacity:${t}` };
  }
  function panel() {
    return { duration: 400, easing: drawerEase, css: (t) => `transform:translateX(${(1 - t) * 100}%);` };
  }
</script>

<svelte:window onkeydown={onKey} />

<button type="button" class="inline-flex h-8 items-center rounded-md border px-3 text-[13px] font-medium" onclick={() => setOpen(true)}>
  {trigger}
</button>

{#if value}
  <div class="fixed inset-0 z-50">
    <button type="button" aria-label="Close drawer" class="absolute inset-0 bg-background/60 backdrop-blur-sm" transition:veil onclick={() => setOpen(false)}></button>
    <div role="dialog" aria-modal="true" class="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l bg-background p-5 shadow-2xl" transition:panel>
      <button type="button" aria-label="Close" class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent" onclick={() => setOpen(false)}>
        <X class="size-4" />
      </button>
      <p class="text-[15px] font-medium">{title}</p>
      <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">{description}</p>
      {#if children}{@render children()}{/if}
    </div>
  </div>
{/if}
