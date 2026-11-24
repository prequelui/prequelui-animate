<script>
  import { onMount } from "svelte";

  const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  let {
    hexagonSize = 46,
    hexagonMargin = 3,
    speed = 1,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let grid = $state({ rows: 0, columns: 0 });

  const width = $derived(hexagonSize);
  const height = $derived(hexagonSize * 1.1);
  const rowSpacing = $derived(height * 0.75 + hexagonMargin);
  const rows = $derived(Array.from({ length: grid.rows }, (_, index) => index));
  const columns = $derived(
    Array.from({ length: grid.columns }, (_, index) => index),
  );
  const rootStyle = $derived(
    `--hex-leave:${1000 / Math.max(0.1, speed)}ms`,
  );

  function update() {
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const nextRows = Math.ceil(rect.height / rowSpacing) + 2;
    const nextColumns = Math.ceil(rect.width / (width + hexagonMargin)) + 2;
    if (grid.rows === nextRows && grid.columns === nextColumns) return;
    grid = { rows: nextRows, columns: nextColumns };
  }

  $effect(() => {
    width;
    hexagonMargin;
    rowSpacing;
    update();
  });

  onMount(() => {
    update();
    const observer = new ResizeObserver(update);
    if (root) observer.observe(root);
    return () => observer.disconnect();
  });
</script>

<div
  bind:this={root}
  data-slot="hexagon-background"
  class={`relative isolate size-full overflow-hidden bg-[#f4f2ee] dark:bg-[#0b0b0f] ${className}`}
  style={rootStyle}
  {...rest}
>
  <div
    aria-hidden="true"
    class="absolute left-0 top-0 size-full overflow-hidden [text-rendering:optimizeSpeed]"
  >
    {#each rows as row (row)}
      <div
        class="flex w-max"
        style={`margin-top:${row === 0 ? -height / 2 : rowSpacing - height}px;margin-left:${(row % 2 === 0 ? 0 : -width / 2) - width / 2}px`}
      >
        {#each columns as column (column)}
          <div
            class="relative shrink-0"
            style={`width:${width}px;height:${height}px;margin-left:${hexagonMargin}px`}
          >
            <div
              class="absolute inset-0 bg-foreground/[0.10] transition-colors [transition-duration:var(--hex-leave)] hover:bg-foreground/[0.22] hover:[transition-duration:0ms] dark:bg-foreground/[0.14] dark:hover:bg-foreground/[0.30]"
              style={`clip-path:${HEX_CLIP}`}
            ></div>
            <div
              class="absolute bg-[#f4f2ee] transition-colors [transition-duration:var(--hex-leave)] hover:bg-foreground/[0.06] hover:[transition-duration:0ms] dark:bg-[#0b0b0f] dark:hover:bg-foreground/[0.12]"
              style={`inset:${hexagonMargin}px;clip-path:${HEX_CLIP}`}
            ></div>
          </div>
        {/each}
      </div>
    {/each}
  </div>
  <div
    class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(244,242,238,0.55))] dark:bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(11,11,15,0.65))]"
  ></div>
  <slot />
</div>
