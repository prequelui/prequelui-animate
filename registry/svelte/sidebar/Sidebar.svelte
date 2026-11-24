<script>
  import { PanelLeft } from "lucide-svelte";

  let {
    items = [
      { value: "home", label: "Home" },
      { value: "projects", label: "Projects" },
      { value: "team", label: "Team" },
      { value: "settings", label: "Settings" },
    ],
    value = undefined,
    defaultValue = "projects",
    collapsed = undefined,
    defaultCollapsed = false,
    onValueChange = undefined,
    onCollapsedChange = undefined,
  } = $props();

  let internal = $state(defaultValue);
  const current = $derived(value === undefined ? internal : value);
  let closedInternal = $state(defaultCollapsed);
  const closed = $derived(collapsed === undefined ? closedInternal : collapsed);

  function select(next) {
    if (value === undefined) internal = next;
    onValueChange?.(next);
  }
  function toggle() {
    const next = !closed;
    if (collapsed === undefined) closedInternal = next;
    onCollapsedChange?.(next);
  }
</script>

<div class="flex h-[190px] w-full max-w-[320px] overflow-hidden rounded-xl border bg-background">
  <div
    class="sidebar flex shrink-0 flex-col overflow-hidden border-r bg-accent/40 p-2 transition-[width] duration-[280ms] ease-[cubic-bezier(0.77,0,0.175,1)] motion-reduce:transition-none"
    style={`width:${closed ? 54 : 136}px`}
  >
    <div class="mb-3 flex h-7 items-center gap-2 overflow-hidden px-1">
      <span class="flex size-5 shrink-0 items-center justify-center rounded-md bg-foreground text-[12px] font-medium text-background">P</span>
      {#if !closed}
        <span class="side-label whitespace-nowrap text-[13px] font-medium">Prequel</span>
      {/if}
    </div>
    {#each items as item (item.value)}
      <button
        type="button"
        aria-pressed={item.value === current}
        class="relative mb-0.5 flex h-7 items-center gap-2 overflow-hidden rounded-md px-2 text-[13px] transition-colors {item.value === current
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground'}"
        onclick={() => select(item.value)}
      >
        <span class="relative shrink-0">
          <span class="block size-1.5 rounded-full bg-current"></span>
        </span>
        {#if !closed}
          <span class="side-label relative whitespace-nowrap">{item.label}</span>
        {/if}
      </button>
    {/each}
  </div>
  <div class="flex min-w-0 flex-1 flex-col p-3">
    <div class="flex items-center justify-between">
      <p class="truncate text-[13px] font-medium">
        {items.find((item) => item.value === current)?.label ?? "Projects"}
      </p>
      <button
        type="button"
        aria-label="Toggle sidebar"
        aria-expanded={!closed}
        class="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        onclick={toggle}
      >
        <PanelLeft class="size-3.5" />
      </button>
    </div>
    <div class="mt-3 space-y-2">
      {#each [70, 92, 58] as width}
        <div class="flex items-center gap-2">
          <span class="size-1.5 rounded-full bg-border"></span>
          <span class="h-1.5 rounded-full bg-accent" style={`width:${width}%`}></span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .side-label { animation: side-label-in 140ms cubic-bezier(0.23, 1, 0.32, 1) both; }
  @keyframes side-label-in { from { opacity: 0; filter: blur(2px); transform: translateX(-4px); } }
  @media (prefers-reduced-motion: reduce) {
    .side-label { animation: side-label-fade 140ms linear both; }
    @keyframes side-label-fade { from { opacity: 0; } }
  }
</style>
