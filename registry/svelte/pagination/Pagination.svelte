<script>
  import { onMount } from "svelte";
  import { ChevronLeft, ChevronRight } from "lucide-svelte";
  import { animate } from "motion";

  let { pages = 5, defaultPage = 1, page = undefined, onPageChange = undefined } = $props();

  let internal = $state(defaultPage);
  const current = $derived(page ?? internal);
  let buttons = {};
  let indicator;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function place(animated) {
    const target = buttons[current];
    if (!target || !indicator) return;
    const x = target.offsetLeft;
    const width = target.offsetWidth;
    if (!animated || reduce()) {
      indicator.style.transform = `translateX(${x}px)`;
      indicator.style.width = `${width}px`;
      return;
    }
    animate(indicator, { x, width }, { type: "spring", stiffness: 500, damping: 40 });
  }

  let ready = false;

  function go(next) {
    const value = Math.min(pages, Math.max(1, next));
    if (page === undefined) internal = value;
    onPageChange?.(value);
  }

  onMount(() =>
    requestAnimationFrame(() => {
      ready = true;
      place(false);
    }),
  );

  $effect(() => {
    current;
    if (ready) requestAnimationFrame(() => place(true));
  });
</script>

<nav aria-label="Pagination" class="relative flex items-center gap-1">
  <button type="button" aria-label="Previous page" disabled={current === 1} class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40" onclick={() => go(current - 1)}>
    <ChevronLeft class="size-4" />
  </button>
  <span bind:this={indicator} class="absolute inset-y-0 left-0 rounded-md border bg-background shadow-sm" aria-hidden="true"></span>
  {#each Array.from({ length: pages }, (_, index) => index + 1) as item (item)}
    <button
      bind:this={buttons[item]}
      type="button"
      aria-current={item === current ? "page" : undefined}
      class="relative flex size-8 items-center justify-center rounded-md text-[13px] font-medium"
      class:text-foreground={item === current}
      class:text-muted-foreground={item !== current}
      onclick={() => go(item)}
    >
      {item}
    </button>
  {/each}
  <button type="button" aria-label="Next page" disabled={current === pages} class="flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent disabled:opacity-40" onclick={() => go(current + 1)}>
    <ChevronRight class="size-4" />
  </button>
</nav>
