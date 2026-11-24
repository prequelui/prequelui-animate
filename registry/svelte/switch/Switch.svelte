<script>
  let {
    checked = undefined,
    defaultChecked = false,
    onCheckedChange = undefined,
    label = "Enable notifications",
    disabled = false,
  } = $props();

  let internal = $state(defaultChecked);
  const value = $derived(checked === undefined ? internal : checked);
  let pressed = $state(false);

  function toggle() {
    if (disabled) return;
    const next = !value;
    if (checked === undefined) internal = next;
    onCheckedChange?.(next);
  }
</script>

<label class="flex items-center gap-3 text-[13px]">
  <button
    type="button"
    role="switch"
    aria-checked={value}
    aria-label={label}
    {disabled}
    class="relative flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
    class:bg-primary={value}
    class:bg-input={!value}
    onclick={toggle}
    onpointerdown={() => (pressed = true)}
    onpointerup={() => (pressed = false)}
    onpointerleave={() => (pressed = false)}
  >
    <span
      aria-hidden="true"
      class="block h-5 rounded-full bg-background shadow-sm transition-[transform,width] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none"
      style={`transform:translateX(${value ? 20 : 0}px);width:${pressed ? 24 : 20}px`}
    ></span>
  </button>
  {#if label}<span>{label}</span>{/if}
</label>
