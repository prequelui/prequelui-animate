<script>
  import { tick } from "svelte";

  let {
    items = ["day", "week", "month"],
    type = "single",
    value = undefined,
    defaultValue = undefined,
    onValueChange = undefined,
  } = $props();

  const options = $derived(
    items.map((item) => (typeof item === "string" ? { value: item, label: item } : item)),
  );
  const asArray = (entry) => (entry === undefined ? [] : Array.isArray(entry) ? entry : [entry]);
  let internal = $state(asArray(defaultValue ?? options[0]?.value));
  const selected = $derived(asArray(value === undefined ? internal : value));
  let buttons = $state([]);
  let indicator = $state({ left: 0, width: 0 });

  function measure() {
    const index = options.findIndex((item) => selected.includes(item.value));
    const node = buttons[index];
    if (!node) return;
    indicator = { left: node.offsetLeft, width: node.offsetWidth };
  }
  function toggle(next) {
    let result;
    if (type === "single") result = selected.includes(next) ? [] : [next];
    else
      result = selected.includes(next)
        ? selected.filter((entry) => entry !== next)
        : [...selected, next];
    if (value === undefined) internal = result;
    onValueChange?.(type === "single" ? (result[0] ?? "") : result);
    tick().then(measure);
  }

  $effect(() => {
    selected;
    options;
    tick().then(measure);
  });
</script>

<div role="group" class="relative flex items-center rounded-lg bg-accent p-1">
  {#if type === "single" && selected.length}
    <span
      aria-hidden="true"
      class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"
      style={`left:${indicator.left}px;width:${indicator.width}px`}
    ></span>
  {/if}
  {#each options as item, index (item.value)}
    <button
      bind:this={buttons[index]}
      type="button"
      aria-pressed={selected.includes(item.value)}
      class="relative rounded-md px-3 py-1.5 text-[13px] capitalize transition-[color,background-color,transform] duration-200 active:scale-[0.97]"
      class:text-foreground={selected.includes(item.value)}
      class:bg-background={type !== "single" && selected.includes(item.value)}
      class:shadow-sm={type !== "single" && selected.includes(item.value)}
      class:text-muted-foreground={!selected.includes(item.value)}
      onclick={() => toggle(item.value)}
    >
      {item.label}
    </button>
  {/each}
</div>
