<script>
  let {
    pressed = undefined,
    defaultPressed = false,
    onPressedChange = undefined,
    children = undefined,
  } = $props();

  let internal = $state(defaultPressed);
  const value = $derived(pressed === undefined ? internal : pressed);

  function toggle() {
    const next = !value;
    if (pressed === undefined) internal = next;
    onPressedChange?.(next);
  }
</script>

<button
  type="button"
  aria-pressed={value}
  class="relative inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-[13px] font-medium transition-[background-color,color,transform] duration-200 hover:bg-accent active:scale-[0.97] {value
    ? 'bg-primary text-primary-foreground'
    : 'bg-background text-muted-foreground'}"
  onclick={toggle}
>
  <span
    aria-hidden="true"
    class="block size-2 rounded-full transition-colors duration-200 {value ? 'bg-[#7ee2a8]' : 'bg-muted-foreground/50'}"
  ></span>
  {#if children}{@render children()}{:else}Live preview{/if}
</button>
