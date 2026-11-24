<script>
  let {
    value = undefined,
    defaultValue = 42,
    min = 0,
    max = 100,
    step = 1,
    label = "Volume",
    showValue = true,
    onValueChange = undefined,
  } = $props();

  let internal = $state(defaultValue);
  const current = $derived(value === undefined ? internal : value);
  const safeMax = $derived(max > min ? max : min + 1);
  const percent = $derived(Math.min(100, Math.max(0, ((current - min) / (safeMax - min)) * 100)));
  let dragging = $state(false);
  let track = $state(null);

  function commit(next) {
    const snapped = Math.round((next - min) / step) * step + min;
    const clamped = Math.min(safeMax, Math.max(min, snapped));
    if (value === undefined) internal = clamped;
    onValueChange?.(clamped);
  }
  function fromClientX(clientX) {
    const rect = track?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    commit(min + ratio * (safeMax - min));
  }
  function onDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragging = true;
    fromClientX(event.clientX);
  }
  function onMove(event) {
    if (dragging) fromClientX(event.clientX);
  }
  function onKey(event) {
    const delta =
      event.key === "ArrowRight" || event.key === "ArrowUp"
        ? step
        : event.key === "ArrowLeft" || event.key === "ArrowDown"
          ? -step
          : event.key === "Home"
            ? min - current
            : event.key === "End"
              ? safeMax - current
              : 0;
    if (!delta) return;
    event.preventDefault();
    commit(current + delta);
  }
</script>

<div class="w-full max-w-[360px]">
  <div class="mb-2 flex items-center justify-between text-[13px]">
    <span class="text-muted-foreground">{label}</span>
    {#if showValue}<span class="tabular-nums">{current}</span>{/if}
  </div>
  <div
    bind:this={track}
    role="slider"
    tabindex="0"
    aria-valuemin={min}
    aria-valuemax={safeMax}
    aria-valuenow={current}
    aria-label={label}
    class="relative flex h-6 w-full touch-none select-none items-center outline-none"
    onpointerdown={onDown}
    onpointermove={onMove}
    onpointerup={() => (dragging = false)}
    onpointercancel={() => (dragging = false)}
    onkeydown={onKey}
  >
    <div class="h-1.5 w-full overflow-hidden rounded-full bg-accent">
      <div
        class="h-full rounded-full bg-foreground transition-[width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
        style={`width:${percent}%`}
      ></div>
    </div>
    <span
      aria-hidden="true"
      class="absolute top-1/2 block h-3 -translate-y-1/2 rounded-full border bg-background shadow-sm transition-[left,width] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none {dragging
        ? 'border-foreground/40'
        : ''}"
      style={`left:${percent}%;width:${dragging ? 14.25 : 12}px;margin-left:-6px`}
    ></span>
  </div>
</div>
