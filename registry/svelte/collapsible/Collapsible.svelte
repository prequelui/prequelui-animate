<script>
  import { ChevronDown } from "lucide-svelte";
  import { cubicBezier } from "motion";

  let {
    open = undefined,
    defaultOpen = false,
    onOpenChange = undefined,
    trigger = "Show details",
    children = undefined,
  } = $props();

  let internal = $state(defaultOpen);
  const value = $derived(open === undefined ? internal : open);

  function toggle() {
    const next = !value;
    if (open === undefined) internal = next;
    onOpenChange?.(next);
  }

  const ease = cubicBezier(0.4, 0, 0.1, 1);

  function reveal(node) {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return { duration: 200, easing: cubicBezier(0.23, 1, 0.32, 1), css: (t) => `opacity:${t}` };
    }
    const height = node.scrollHeight;
    return {
      duration: 450,
      easing: ease,
      css: (t) => `height:${t * height}px;opacity:${Math.min(1, t * 1.5)};overflow:hidden;`,
    };
  }
</script>

<div data-slot="collapsible" class="w-full">
  <button
    type="button"
    aria-expanded={value}
    aria-controls="collapsible-panel"
    class="flex w-full items-center justify-between gap-4 py-3 text-left text-[13.5px] font-medium outline-none"
    onclick={toggle}
  >
    <span>{trigger}</span>
    <ChevronDown
      aria-hidden="true"
      class="size-4 text-muted-foreground transition-transform duration-[450ms] ease-[cubic-bezier(0.4,0,0.1,1)]"
      style={`transform:rotate(${value ? 180 : 0}deg)`}
    />
  </button>
  {#if value}
    <div id="collapsible-panel" role="region" class="overflow-hidden" transition:reveal>
      <div class="pb-3 text-[13px] leading-6 text-muted-foreground">
        {#if children}{@render children()}{/if}
      </div>
    </div>
  {/if}
</div>
