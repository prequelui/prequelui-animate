<script>
  import { X } from "lucide-svelte";
  import { cubicBezier } from "motion";

  let {
    open = undefined,
    defaultOpen = false,
    onOpenChange = undefined,
    trigger = "Open dialog",
    title = "Edit profile",
    description = "Make changes to your profile here.",
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

  const veilEase = cubicBezier(0.215, 0.61, 0.355, 1);
  const popEase = cubicBezier(0.23, 1, 0.32, 1);

  function veil(node) {
    return {
      duration: 400,
      easing: veilEase,
      css: (t) => `opacity:${t}`,
    };
  }

  function popup(node) {
    return {
      duration: 450,
      easing: popEase,
      css: (t) =>
        `opacity:${t};transform:translateY(${8 * (1 - t)}px) scale(${0.96 + 0.04 * t});filter:blur(${4 * (1 - t)}px);`,
    };
  }
</script>

<svelte:window onkeydown={onKey} />

<button type="button" class="inline-flex h-8 items-center rounded-md bg-foreground px-3 text-[13px] font-medium text-background" onclick={() => setOpen(true)}>
  {trigger}
</button>

{#if value}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button type="button" aria-label="Close dialog" class="absolute inset-0 bg-background/60 backdrop-blur-sm" transition:veil onclick={() => setOpen(false)}></button>
    <div role="dialog" aria-modal="true" class="relative w-full max-w-sm rounded-xl border bg-background p-5 shadow-2xl" transition:popup>
      <button type="button" aria-label="Close" class="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:bg-accent" onclick={() => setOpen(false)}>
        <X class="size-4" />
      </button>
      <h2 class="text-[15px] font-medium">{title}</h2>
      <p class="mt-1.5 text-[13px] leading-6 text-muted-foreground">{description}</p>
      {#if children}{@render children()}{/if}
      <div class="mt-5 flex justify-end gap-2">
        <button type="button" class="h-8 rounded-md border px-3 text-[13px]" onclick={() => setOpen(false)}>Cancel</button>
        <button type="button" class="h-8 rounded-md bg-foreground px-3 text-[13px] font-medium text-background" onclick={() => setOpen(false)}>Save</button>
      </div>
    </div>
  </div>
{/if}
