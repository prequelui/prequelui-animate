<script>
  import { ChevronDown } from "lucide-svelte";
  import { cubicBezier } from "motion";

  let {
    items = [],
    type = "single",
    defaultValue = undefined,
    collapsible = true,
  } = $props();

  const initial =
    defaultValue === undefined
      ? []
      : Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue];

  let open = $state(initial);

  function toggle(value) {
    const isOpen = open.includes(value);
    if (type === "single") {
      open = isOpen ? (collapsible ? [] : open) : [value];
    } else {
      open = isOpen ? open.filter((entry) => entry !== value) : [...open, value];
    }
  }

  function isOpen(value) {
    return open.includes(value);
  }

  const ease = cubicBezier(0.215, 0.61, 0.355, 1);

  function reveal(node) {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return { duration: 0 };
    }
    const height = node.scrollHeight;
    return {
      duration: 350,
      easing: ease,
      css: (t) =>
        `height:${t * height}px;opacity:${t};filter:blur(${2 * (1 - t)}px);overflow:hidden;`,
    };
  }
</script>

<div data-slot="accordion" class="w-full">
  {#each items as item (item.value)}
    <div
      data-slot="accordion-item"
      data-state={isOpen(item.value) ? "open" : "closed"}
      class="border-b last:border-b-0"
    >
      <button
        type="button"
        aria-expanded={isOpen(item.value)}
        aria-controls={`accordion-${item.value}`}
        class="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[13.5px] font-medium outline-none transition-colors focus-visible:text-foreground"
        onclick={() => toggle(item.value)}
      >
        <span>{item.title}</span>
        <ChevronDown
          aria-hidden="true"
          class="size-4 text-muted-foreground transition-transform duration-[350ms]"
          style={`transition-timing-function:cubic-bezier(0.215,0.61,0.355,1);transform:rotate(${isOpen(item.value) ? 180 : 0}deg)`}
        />
      </button>
      {#if isOpen(item.value)}
        <div
          id={`accordion-${item.value}`}
          role="region"
          class="overflow-hidden"
          transition:reveal
        >
          <div class="pb-4 pr-6 text-[13px] leading-6 text-muted-foreground">
            {item.content}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>
