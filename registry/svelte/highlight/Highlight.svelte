<script>
  import { onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    items = [],
    value = undefined,
    defaultValue = null,
    onValueChange = undefined,
    hover = false,
    click = true,
    disabled = false,
    activeClassName = "bg-background shadow-sm",
    itemClassName = "rounded-lg px-4 py-2 text-[13px] font-medium",
    highlightStyle = undefined,
    transition = undefined,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let surface;
  let internal = $state(defaultValue);
  let canHover = $state(false);
  let controls;
  let previous = null;

  const options = $derived(
    transition ?? {
      type: "spring",
      stiffness: 500,
      damping: 40,
    },
  );

  const entries = $derived(
    items.map((item) =>
      typeof item === "string"
        ? { value: item, label: item }
        : { value: item.value, label: item.label ?? item.value },
    ),
  );

  const active = $derived(value !== undefined ? value : internal);

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function select(next) {
    if (disabled) return;
    if (value === undefined) internal = next;
    onValueChange?.(next);
  }

  function enter(entry) {
    if (disabled) return;
    if (hover && canHover) select(entry);
  }

  function leave(entry) {
    if (disabled) return;
    if (hover && canHover && active === entry) select(null);
  }

  function onClick(entry) {
    if (disabled) return;
    if (!(hover && canHover) && click) select(entry);
  }

  function position() {
    const current = active;
    if (!surface || current === null || current === undefined) {
      if (surface) surface.style.opacity = "0";
      previous = null;
      return;
    }

    const node = root?.querySelector(
      `[data-highlight-value="${current}"]`,
    );
    if (!node || !root) return;

    const box = root.getBoundingClientRect();
    const rect = node.getBoundingClientRect();
    const next = {
      left: rect.left - box.left,
      top: rect.top - box.top,
      width: rect.width,
      height: rect.height,
    };

    surface.style.opacity = "1";

    if (!previous || reduce()) {
      surface.style.width = `${next.width}px`;
      surface.style.height = `${next.height}px`;
      surface.style.transform = `translate(${next.left}px, ${next.top}px)`;
      previous = next;
      return;
    }

    const from = previous;
    previous = next;
    controls?.stop?.();
    controls = animate(
      surface,
      {
        width: [from.width, next.width],
        height: [from.height, next.height],
        x: [from.left, next.left],
        y: [from.top, next.top],
      },
      options,
    );
  }

  $effect(() => {
    active;
    tick().then(position);
  });

  $effect(() => {
    if (defaultValue !== null) internal = defaultValue;
  });

  onMount(() => {
    canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    tick().then(position);
    return () => controls?.stop?.();
  });
</script>

<div
  bind:this={root}
  data-slot="highlight"
  class={`relative ${className}`}
  {...rest}
>
  <span
    bind:this={surface}
    aria-hidden="true"
    data-slot="highlight-surface"
    class={`pointer-events-none absolute left-0 top-0 z-0 rounded-[inherit] ${activeClassName}`}
    style={`opacity:0;${highlightStyle ?? ""}`}
  ></span>
  {#each entries as entry (entry.value)}
    <button
      type="button"
      data-slot="highlight-item"
      data-value={entry.value}
      data-highlight-value={entry.value}
      data-active={active === entry.value ? "true" : "false"}
      aria-pressed={active === entry.value}
      class={`relative z-[1] ${itemClassName}`}
      onclick={() => onClick(entry.value)}
      onpointerenter={() => enter(entry.value)}
      onpointerleave={() => leave(entry.value)}
    >
      {entry.label}
    </button>
  {/each}
</div>
