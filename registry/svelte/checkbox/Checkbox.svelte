<script>
  let {
    checked = undefined,
    defaultChecked = false,
    onCheckedChange = undefined,
    label = "Accept terms",
    disabled = false,
  } = $props();

  let internal = $state(defaultChecked);
  const value = $derived(checked === undefined ? internal : checked);

  function toggle() {
    if (disabled) return;
    const next = !value;
    if (checked === undefined) internal = next;
    onCheckedChange?.(next);
  }
</script>

<label class="flex items-center gap-2.5 text-[13px]">
  <button
    type="button"
    role="checkbox"
    aria-checked={value}
    {disabled}
    onclick={toggle}
    class="relative flex size-4 items-center justify-center rounded-[4px] border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    class:border-foreground={value}
    class:border-input={!value}
  >
    <span
      aria-hidden="true"
      class="absolute inset-0 rounded-[3px] bg-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
      style={`transform:scale(${value ? 1 : 0.5});opacity:${value ? 1 : 0}`}
    />
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="relative size-3 text-background"
    >
      <path
        d="m5 12 4 4L19 6"
        style={`stroke-dasharray:20;stroke-dashoffset:${value ? 0 : 20};transition:stroke-dashoffset .25s cubic-bezier(0.23,1,0.32,1)`}
      />
    </svg>
  </button>
  <span>{label}</span>
</label>
