<script>
  import { tick } from "svelte";

  let {
    items = [
      { value: "overview", label: "Overview", content: "A calm summary of the workspace, its members and the latest activity." },
      { value: "activity", label: "Activity", content: "Every change, in order. Hover a row to see who made it and when." },
      { value: "settings", label: "Settings", content: "Name, visibility and notification preferences for this project." },
    ],
    value = undefined,
    defaultValue = "",
    onValueChange = undefined,
  } = $props();

  let internal = $state(defaultValue || items[0]?.value || "");
  const current = $derived(value === undefined ? internal : value);
  const active = $derived(items.find((item) => item.value === current) ?? items[0]);
  let buttons = $state([]);
  let indicator = $state({ left: 0, width: 0 });
  let list = $state(null);

  function measure() {
    const index = items.findIndex((item) => item.value === current);
    const node = buttons[index];
    if (!node) return;
    indicator = { left: node.offsetLeft, width: node.offsetWidth };
  }
  function select(next) {
    if (value === undefined) internal = next;
    onValueChange?.(next);
  }
  function onKey(event, index) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + items.length) % items.length;
    const item = items[next];
    if (!item) return;
    select(item.value);
    tick().then(() => buttons[next]?.focus());
  }

  $effect(() => {
    current;
    items;
    tick().then(measure);
  });
</script>

<div class="w-full max-w-[460px]">
  <div
    bind:this={list}
    role="tablist"
    aria-label="Tabs"
    class="relative flex items-center gap-1 rounded-lg bg-accent p-1"
  >
    <span
      aria-hidden="true"
      class="absolute inset-y-1 rounded-md bg-background shadow-sm transition-[left,width] duration-300 ease-[cubic-bezier(0.34,1.3,0.64,1)] motion-reduce:transition-none"
      style={`left:${indicator.left}px;width:${indicator.width}px`}
    ></span>
    {#each items as item, index (item.value)}
      <button
        bind:this={buttons[index]}
        type="button"
        role="tab"
        aria-selected={item.value === current}
        tabindex={item.value === current ? 0 : -1}
        class="relative flex-1 rounded-md px-3 py-1.5 text-[13px] outline-none transition-colors duration-200 {item.value === current
          ? 'text-foreground'
          : 'text-muted-foreground hover:text-foreground'}"
        onclick={() => select(item.value)}
        onkeydown={(event) => onKey(event, index)}
      >
        {item.label}
      </button>
    {/each}
  </div>
  <div class="relative mt-4 min-h-[72px] overflow-hidden">
    {#key active?.value}
      {#if active}
        <div
          role="tabpanel"
          class="tab-panel rounded-lg border bg-background p-4 text-[13px] leading-6 text-muted-foreground outline-none"
        >
          {active.content}
        </div>
      {/if}
    {/key}
  </div>
</div>

<style>
  .tab-panel { animation: tab-in 300ms cubic-bezier(0.25, 0.1, 0.35, 1) both; }
  @keyframes tab-in { from { opacity: 0; transform: translateX(12px); filter: blur(5px); } }
  @media (prefers-reduced-motion: reduce) {
    .tab-panel { animation: tab-fade 200ms linear both; }
    @keyframes tab-fade { from { opacity: 0; } }
  }
</style>
