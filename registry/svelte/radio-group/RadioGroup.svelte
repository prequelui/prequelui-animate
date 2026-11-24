<script>
  let {
    items = [
      { value: "standard", label: "Standard", hint: "5–7 business days" },
      { value: "express", label: "Express", hint: "2–3 business days" },
      { value: "overnight", label: "Overnight", hint: "Next business day" },
    ],
    value = undefined,
    defaultValue = "standard",
    onValueChange = undefined,
  } = $props();

  let internal = $state(defaultValue);
  const current = $derived(value === undefined ? internal : value);

  function choose(next) {
    if (value === undefined) internal = next;
    onValueChange?.(next);
  }
</script>

<div role="radiogroup" class="flex flex-col gap-2">
  {#each items as item (item.value)}
    <button
      type="button"
      role="radio"
      aria-checked={item.value === current}
      class="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5 text-left text-[13px] transition-[background-color,transform] duration-200 hover:bg-accent active:scale-[0.97]"
      onclick={() => choose(item.value)}
    >
      <span class="flex size-4 items-center justify-center rounded-full border">
        <span
          aria-hidden="true"
          class="size-2 rounded-full bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
          style={`transform:scale(${item.value === current ? 1 : 0})`}
        ></span>
      </span>
      <span class="flex-1">{item.label}</span>
      {#if item.hint}<span class="text-[13px] text-muted-foreground">{item.hint}</span>{/if}
    </button>
  {/each}
</div>
