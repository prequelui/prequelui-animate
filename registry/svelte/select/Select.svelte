<script>
  import { Check, ChevronDown } from "lucide-svelte";

  let {
    items = ["Design", "Engineering", "Marketing", "Support"],
    value = undefined,
    defaultValue = "",
    placeholder = "Select an option",
    onValueChange = undefined,
  } = $props();

  const options = $derived(
    items.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
  );
  let internal = $state(defaultValue);
  const current = $derived(value === undefined ? internal : value);
  const selected = $derived(options.find((option) => option.value === current));
  let open = $state(false);
  let active = $state(0);
  let root = $state(null);

  function choose(option) {
    if (value === undefined) internal = option.value;
    onValueChange?.(option.value);
    open = false;
  }
  function onPointer(event) {
    if (open && root && !root.contains(event.target)) open = false;
  }
  function onKey(event) {
    if (event.key === "Escape") {
      open = false;
      return;
    }
    if (!open && (event.key === "Enter" || event.key === " " || event.key === "ArrowDown")) {
      event.preventDefault();
      open = true;
      return;
    }
    if (!open) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      active = Math.min(options.length - 1, active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      active = Math.max(0, active - 1);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = options[active];
      if (option) choose(option);
    }
  }
</script>

<svelte:window onpointerdown={onPointer} />

<div bind:this={root} class="relative w-[220px] text-[13px]" onkeydown={onKey}>
  <button
    type="button"
    aria-haspopup="listbox"
    aria-expanded={open}
    class="flex h-9 w-full items-center justify-between rounded-lg border bg-background px-3 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
    onclick={() => (open = !open)}
  >
    <span class:text-muted-foreground={!selected}>{selected?.label ?? placeholder}</span>
    <ChevronDown class="size-3.5 text-muted-foreground" />
  </button>
  {#if open}
    <div
      role="listbox"
      aria-label={placeholder}
      class="select absolute left-0 top-full z-40 mt-1.5 w-full origin-top rounded-xl border bg-popover p-1 shadow-lg"
    >
      {#each options as option, index (option.value)}
        <button
          type="button"
          role="option"
          aria-selected={option.value === current}
          class="select-row flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-accent"
          class:text-foreground={option.value === current}
          class:text-muted-foreground={option.value !== current}
          style={`animation-delay:${index * 30}ms`}
          onclick={() => choose(option)}
        >
          <span>{option.label}</span>
          {#if option.value === current}<Check class="size-3.5" />{/if}
        </button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .select { animation: select-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .select-row { animation: select-row 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  @keyframes select-in { from { opacity: 0; transform: scale(0.9); } }
  @keyframes select-row { from { opacity: 0; transform: translateY(-4px); } }
  @media (prefers-reduced-motion: reduce) {
    .select, .select-row { animation: select-fade 150ms linear both; }
    @keyframes select-fade { from { opacity: 0; } }
  }
</style>
