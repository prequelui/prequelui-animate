<script>
  let {
    value = 0,
    max = 100,
    label = "Uploading assets",
    showValue = true,
  } = $props();

  const safeMax = $derived(max > 0 ? max : 100);
  const clamped = $derived(Math.min(safeMax, Math.max(0, value)));
  const percent = $derived((clamped / safeMax) * 100);
  const shown = $derived(Math.round(clamped));
</script>

<div class="w-full max-w-[380px]">
  <div class="mb-2 flex items-center justify-between text-[13px] text-muted-foreground">
    <span>{label}</span>
    {#if showValue}<span class="tabular-nums">{shown}%</span>{/if}
  </div>
  <div
    role="progressbar"
    aria-valuemin={0}
    aria-valuemax={safeMax}
    aria-valuenow={clamped}
    class="h-2 w-full overflow-hidden rounded-full bg-accent"
  >
    <div
      class="h-full rounded-full bg-foreground transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
      style={`width:${percent}%`}
    ></div>
  </div>
</div>
