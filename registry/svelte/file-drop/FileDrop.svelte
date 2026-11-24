<script>
  import { animate } from "motion";

  let {
    accept = undefined,
    multiple = false,
    maxSize = undefined,
    disabled = false,
    progress = undefined,
    status = undefined,
    fileName = undefined,
    title = "Drop a file or browse",
    hint = "SVG, PNG or JPG",
    class: className = "",
    onFiles = undefined,
    onError = undefined,
    ...rest
  } = $props();

  let root;
  let input;
  let icon;
  let bar;
  let dragging = $state(false);
  let selected = $state([]);
  let error = $state(null);
  let iconControls;
  let barControls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 102.4) / 10} KB`;
    return `${Math.round(bytes / 104857.6) / 10} MB`;
  }

  const resolvedStatus = $derived(status ?? (error ? "error" : "idle"));
  const shownName = $derived(fileName ?? selected[0]?.name);
  const shownSize = $derived(
    selected[0] ? formatSize(selected[0].size) : null,
  );
  const safeProgress = $derived(
    typeof progress === "number"
      ? Math.min(100, Math.max(0, progress))
      : null,
  );

  const stateBorder = $derived.by(() => {
    if (resolvedStatus === "error")
      return "border-destructive/60 bg-destructive/5";
    if (dragging) return "border-primary/70 bg-accent/60";
    if (resolvedStatus === "done")
      return "border-emerald-500/40 bg-emerald-500/5";
    return "border-border bg-muted/20 hover:border-border/80 hover:bg-accent/40";
  });

  function acceptFiles(list) {
    if (!list || disabled) return;
    const files = Array.from(list);
    if (!files.length) return;
    if (!multiple && files.length > 1) files.splice(1);

    if (maxSize !== undefined) {
      const oversized = files.find((file) => file.size > maxSize);
      if (oversized) {
        const message = `${oversized.name} is larger than ${formatSize(maxSize)}.`;
        error = message;
        onError?.(message);
        return;
      }
    }

    error = null;
    selected = files;
    onFiles?.(files);
  }

  function open() {
    if (disabled) return;
    input?.click();
  }

  function onKey(event) {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  }

  function onChange(event) {
    acceptFiles(event.target.files);
    event.target.value = "";
  }

  function lift(value) {
    if (!icon) return;
    iconControls?.stop?.();
    const lifted = value && !reduce();
    iconControls = animate(
      icon,
      { y: lifted ? -3 : 0, scale: lifted ? 1.04 : 1 },
      { type: "spring", stiffness: 380, damping: 24 },
    );
  }

  function onDragEnter(event) {
    event.preventDefault();
    if (disabled) return;
    if (!dragging) {
      dragging = true;
      lift(true);
    }
  }

  function onDragOver(event) {
    event.preventDefault();
    if (disabled) return;
    if (!dragging) {
      dragging = true;
      lift(true);
    }
  }

  function onDragLeave(event) {
    if (event.currentTarget.contains(event.relatedTarget)) return;
    if (!dragging) return;
    dragging = false;
    lift(false);
  }

  function onDrop(event) {
    event.preventDefault();
    dragging = false;
    lift(false);
    acceptFiles(event.dataTransfer.files);
  }

  $effect(() => {
    const value = safeProgress;
    if (!bar || value === null) return;
    barControls?.stop?.();
    barControls = animate(
      bar,
      { width: `${value}%` },
      reduce()
        ? { duration: 0 }
        : { type: "spring", stiffness: 220, damping: 26 },
    );
    return () => barControls?.stop?.();
  });
</script>

<div
  bind:this={root}
  data-slot="file-drop"
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-disabled={disabled || undefined}
  aria-label={title}
  class={`group relative flex w-full max-w-[360px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-7 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${stateBorder} ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`}
  onclick={open}
  onkeydown={onKey}
  ondragenter={onDragEnter}
  ondragover={onDragOver}
  ondragleave={onDragLeave}
  ondrop={onDrop}
  {...rest}
>
  <input
    bind:this={input}
    type="file"
    {accept}
    {multiple}
    {disabled}
    class="sr-only"
    onclick={(event) => event.stopPropagation()}
    onchange={onChange}
  />

  <slot>
    <span
      bind:this={icon}
      class="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground shadow-sm"
    >
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" class="size-5">
        <path
          d="M12 16V5m0 0L8 9m4-4 4 4"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M4.5 15.5v2A2.5 2.5 0 0 0 7 20h10a2.5 2.5 0 0 0 2.5-2.5v-2"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <span class="flex flex-col gap-1">
      <span class="text-[13px] font-medium text-foreground">{title}</span>
      <span class="text-[13px] leading-4 text-muted-foreground">{hint}</span>
    </span>

    {#if shownName}
      <span
        class="flex w-full flex-col gap-2 rounded-lg border bg-background px-2.5 py-2 text-left"
      >
        <span class="flex items-center gap-2 text-[13px] text-foreground">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
            class="size-4 shrink-0"
          >
            <path
              d="M6 2.8h5.2L15 6.6v10.6H6z"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
            <path
              d="M11 2.8v4h4"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
          </svg>
          <span class="min-w-0 flex-1 truncate">{shownName}</span>
          {#if shownSize}
            <span class="shrink-0 tabular-nums text-muted-foreground">
              {shownSize}
            </span>
          {/if}
          {#if resolvedStatus === "done"}
            <span
              class="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" class="size-4">
                <path
                  d="M4.5 10.4 8 14l7.5-8"
                  stroke="currentColor"
                  stroke-width="1.8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  pathLength="1"
                  class="file-drop-check"
                />
              </svg>
            </span>
          {/if}
        </span>
        {#if safeProgress !== null}
          <span class="block h-1 overflow-hidden rounded-full bg-border">
            <span
              bind:this={bar}
              class="block h-full rounded-full bg-primary"
              style="width:0%"
            ></span>
          </span>
        {/if}
      </span>
    {/if}

    {#if error}
      <span class="text-[13px] leading-4 text-destructive">{error}</span>
    {/if}
  </slot>
</div>

<style>
  .file-drop-check {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: file-drop-draw 320ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }

  @keyframes file-drop-draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .file-drop-check {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
