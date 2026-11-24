<script>
  import { onDestroy, onMount, tick } from "svelte";
  import { animate } from "motion";
  import { Bell, Compass, Home, User } from "lucide-svelte";

  const fallbackItems = [
    { value: "home", label: "Home", icon: Home },
    { value: "explore", label: "Explore", icon: Compass },
    { value: "alerts", label: "Alerts", icon: Bell },
    { value: "you", label: "You", icon: User },
  ];

  let {
    items = fallbackItems,
    value = undefined,
    defaultValue = undefined,
    onValueChange = undefined,
    hideOnScroll = false,
    class: className = "",
    ...rest
  } = $props();

  const selectionSpring = { type: "spring", stiffness: 300, damping: 30 };

  let internal = $state(defaultValue ?? items[0]?.value ?? "");
  const current = $derived(value ?? internal);

  let nav;
  let indicator;
  let hidden = $state(false);
  let ready = $state(false);
  let lastY = 0;
  let currentLeft = 0;
  let currentWidth = 0;
  let observer;
  let navControls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function select(next) {
    internal = next;
    onValueChange?.(next);
  }

  function activeIndex() {
    return items.findIndex((item) => item.value === current);
  }

  function measure(animated) {
    const index = activeIndex();
    if (!nav || !indicator || index < 0) return;
    const nodes = nav.querySelectorAll("[data-nav-item]");
    const node = nodes[index];
    if (!node) return;

    const left = node.offsetLeft;
    const width = node.offsetWidth;
    if (!animated || reduce()) {
      currentLeft = left;
      currentWidth = width;
      indicator.style.left = `${left}px`;
      indicator.style.width = `${width}px`;
      return;
    }

    animate(
      indicator,
      { left: [currentLeft, left], width: [currentWidth, width] },
      selectionSpring,
    );
    currentLeft = left;
    currentWidth = width;
  }

  function onScroll() {
    const y = window.scrollY;
    hidden = y > 24 && y > lastY;
    lastY = y;
  }

  $effect(() => {
    const target = current;
    if (!ready) return;
    tick().then(() => {
      if (target === current) measure(true);
    });
  });

  $effect(() => {
    const isHidden = hidden;
    if (!nav) return;
    navControls?.stop?.();
    navControls = animate(
      nav,
      { y: isHidden && !reduce() ? 110 : 0 },
      reduce() ? { duration: 0 } : selectionSpring,
    );
    return () => navControls?.stop?.();
  });

  onMount(() => {
    ready = true;
    measure(false);
    if (nav) {
      observer = new ResizeObserver(() => measure(false));
      observer.observe(nav);
    }
    if (hideOnScroll) window.addEventListener("scroll", onScroll, { passive: true });
  });

  onDestroy(() => {
    observer?.disconnect();
    navControls?.stop?.();
    window.removeEventListener("scroll", onScroll);
  });
</script>

<nav
  bind:this={nav}
  data-slot="bottom-navigation"
  class={`relative flex w-full max-w-[340px] items-center justify-between gap-1 rounded-2xl border bg-background p-1.5 shadow-sm ${className}`}
  {...rest}
>
  <span
    bind:this={indicator}
    aria-hidden="true"
    class="absolute bottom-1.5 top-1.5 z-0 rounded-xl bg-accent"
    style="left:0;width:0"
  ></span>
  {#each items as item, index (item.value)}
    {@const Icon = item.icon}
    <button
      type="button"
      data-nav-item
      aria-current={current === item.value ? "page" : undefined}
      data-state={current === item.value ? "active" : "inactive"}
      class={`relative z-10 flex h-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring/40 ${current === item.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
      onclick={() => select(item.value)}
    >
      <span class="relative flex items-center justify-center [&_svg]:size-4">
        {#if Icon}
          <Icon aria-hidden="true" />
        {/if}
      </span>
      <span class="relative text-[13px] font-medium">{item.label}</span>
    </button>
  {/each}
</nav>
