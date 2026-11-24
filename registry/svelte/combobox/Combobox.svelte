<script>
  import { Check, ChevronDown } from "lucide-svelte";

  let {
    options = [
      { value: "base-ui", label: "Base UI" },
      { value: "radix-ui", label: "Radix UI" },
      { value: "react-aria", label: "React Aria" },
      { value: "reka-ui", label: "Reka UI" },
    ],
    placeholder = "Pick a library",
    defaultValue = "",
    onChange = undefined,
  } = $props();

  let query = $state(defaultValue);
  let value = $state(defaultValue);
  let open = $state(false);
  let active = $state(0);
  let root = $state(null);

  const filtered = $derived(
    options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())),
  );

  function choose(option) {
    value = option.value;
    query = option.label;
    open = false;
    onChange?.(option.value);
  }
  function onPointer(event) {
    if (open && root && !root.contains(event.target)) open = false;
  }
  function onKey(event) {
    if (event.key === "Escape") open = false;
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      open = true;
      active = Math.min(filtered.length - 1, active + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      active = Math.max(0, active - 1);
    } else if (event.key === "Enter" && filtered[active]) {
      choose(filtered[active]);
    }
  }
</script>

<svelte:window onpointerdown={onPointer} />

<div bind:this={root} class="relative w-56 text-[13px]">
  <div class="flex h-9 items-center rounded-lg border bg-background px-2.5">
    <input
      role="combobox"
      aria-expanded={open}
      aria-controls="combobox-list"
      aria-autocomplete="list"
      bind:value={query}
      {placeholder}
      class="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
      oninput={() => {
        open = true;
        active = 0;
      }}
      onfocus={() => (open = true)}
      onkeydown={onKey}
    />
    <ChevronDown class="size-4 shrink-0 text-muted-foreground" />
  </div>
  {#if open}
    <ul id="combobox-list" role="listbox" class="combo-panel absolute top-full z-40 mt-1.5 w-full rounded-xl border bg-background p-1 shadow-xl">
      {#if !filtered.length}
        <li class="px-2 py-2 text-muted-foreground">No result</li>
      {/if}
      {#each filtered as option, index (option.value)}
        <li
          role="option"
          aria-selected={option.value === value}
          class="combo-row relative flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5"
          style={`animation-delay:${index * 30}ms`}
          onpointerenter={() => (active = index)}
          onclick={() => choose(option)}
        >
          {option.label}
          {#if option.value === value}<Check class="size-3.5" />{/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .combo-panel { animation: combo-in 220ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  .combo-row { animation: combo-row 200ms cubic-bezier(0.215, 0.61, 0.355, 1) both; }
  @keyframes combo-in { from { opacity: 0; transform: translateY(-4px); } }
  @keyframes combo-row { from { opacity: 0; transform: translateY(-4px); filter: blur(2px); } }
  @media (prefers-reduced-motion: reduce) {
    .combo-panel, .combo-row { animation: none; }
  }
</style>
