<script>
  import { onDestroy, tick } from "svelte";
  import { animate } from "motion";
  import { Pin, PinOff } from "lucide-svelte";

  const fallbackItems = [
    { id: "aurora", label: "Aurora", pinned: true },
    { id: "atlas", label: "Atlas", pinned: true },
    { id: "beacon", label: "Beacon", pinned: false },
    { id: "canvas", label: "Canvas", pinned: false },
  ];

  let {
    items = undefined,
    defaultItems = fallbackItems,
    onItemsChange = undefined,
    pinnedLabel = "Pinned",
    unpinnedLabel = "Everything else",
    class: className = "",
    ...rest
  } = $props();

  const pinnedSpring = {
    type: "spring",
    stiffness: 320,
    damping: 25,
    mass: 0.8,
  };

  let root;
  let movingId = $state(null);
  let internal = $state((items ?? defaultItems).map((item) => ({ ...item })));

  const list = $derived(items ?? internal);
  const groups = $derived([
    { key: true, title: pinnedLabel },
    { key: false, title: unpinnedLabel },
  ]);

  function filtered(pinned) {
    return list.filter((item) => item.pinned === pinned);
  }

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function readRects() {
    const elements = {};
    const rects = {};
    if (!root) return { elements, rects };
    root.querySelectorAll("[data-pinned-id]").forEach((element) => {
      const id = element.getAttribute("data-pinned-id");
      elements[id] = element;
      rects[id] = element.getBoundingClientRect();
    });
    return { elements, rects };
  }

  async function toggle(id) {
    const before = readRects();
    const next = list.map((item) =>
      item.id === id ? { ...item, pinned: !item.pinned } : item,
    );
    if (items === undefined) internal = next;
    onItemsChange?.(next);

    if (reduce()) return;

    movingId = id;
    await tick();
    const after = readRects();
    const controls = [];
    for (const [key, element] of Object.entries(after.elements)) {
      const old = before.rects[key];
      if (!old) continue;
      const now = after.rects[key];
      const dx = old.left - now.left;
      const dy = old.top - now.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue;
      controls.push(
        animate(element, { x: [dx, 0], y: [dy, 0] }, pinnedSpring),
      );
    }
    Promise.all(controls.map((control) => control.finished)).then(() => {
      if (movingId === id) movingId = null;
    });
  }

  onDestroy(() => {
    movingId = null;
  });
</script>

<div
  bind:this={root}
  data-slot="pinned-list"
  class={`w-full max-w-[300px] space-y-4 ${className}`}
  {...rest}
>
  {#each groups as group (group.title)}
    <div>
      <p
        class="mb-1.5 text-[13px] uppercase tracking-[0.14em] text-muted-foreground"
      >
        {group.title}
      </p>
      <div class="min-h-9 space-y-1">
        {#each filtered(group.key) as item (item.id)}
          <button
            type="button"
            data-pinned-id={item.id}
            style={`z-index:${movingId === item.id ? 10 : 1}`}
            class="relative flex w-full items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2 text-left text-[13px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
            onclick={() => toggle(item.id)}
          >
            <span class="flex min-w-0 items-center gap-2">
              <span
                aria-hidden="true"
                class="text-muted-foreground transition-[opacity,transform] duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
                style={`opacity:${item.pinned ? 1 : 0};transform:scale(${item.pinned ? 1 : 0.8})`}
              >
                <Pin class="size-3" />
              </span>
              <span class="truncate">{item.label}</span>
            </span>
            <span class="flex items-center gap-1 text-[13px] text-muted-foreground">
              {#if item.pinned}
                <PinOff class="size-3" />
              {:else}
                <Pin class="size-3" />
              {/if}
              {item.pinned ? "Unpin" : "Pin"}
            </span>
          </button>
        {/each}
      </div>
    </div>
  {/each}
</div>
