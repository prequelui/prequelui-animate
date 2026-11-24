<script>
  import { onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    includeParentBox = true,
    includeSelfBox = false,
    animate: extra = undefined,
    transition = undefined,
    wrapperClassName = "",
    as = "div",
    class: className = "",
    ...rest
  } = $props();

  let root;
  let content;
  let controls;
  let observer;
  let frame;
  let lastHeight = -1;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function spring() {
    return (
      transition ?? {
        type: "spring",
        stiffness: 300,
        damping: 30,
        bounce: 0,
        restDelta: 0.01,
      }
    );
  }

  function measure() {
    const el = content;
    if (!el) return 0;

    const base = el.getBoundingClientRect().height;
    let offset = 0;

    if (includeParentBox && el.parentElement) {
      const box = el.parentElement.getBoundingClientRect();
      const inner = Array.from(el.parentElement.children).reduce(
        (total, child) => total + child.getBoundingClientRect().height,
        0,
      );
      offset = Math.max(0, box.height - inner);
    }

    if (includeSelfBox) {
      const style = getComputedStyle(el);
      offset +=
        (parseFloat(style.paddingTop) || 0) +
        (parseFloat(style.paddingBottom) || 0) +
        (parseFloat(style.borderTopWidth) || 0) +
        (parseFloat(style.borderBottomWidth) || 0);
    }

    const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
    return Math.ceil((base + offset) * dpr) / dpr;
  }

  function commit(next, instant) {
    if (!root) return;
    lastHeight = next;
    if (instant || reduce()) {
      controls?.stop?.();
      root.style.height = `${next}px`;
      return;
    }
    controls?.stop?.();
    controls = animate(
      root,
      { height: `${next}px`, ...(extra ?? {}) },
      spring(),
    );
  }

  async function refresh(instant = false) {
    await tick();
    const next = measure();
    if (!next && !lastHeight) {
      lastHeight = 0;
      return;
    }
    commit(next, instant);
  }

  onMount(() => {
    refresh(true);

    observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => refresh(false));
    });

    if (content) observer.observe(content);
    if (includeParentBox && content?.parentElement) {
      observer.observe(content.parentElement);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      controls?.stop?.();
    };
  });
</script>

<svelte:element
  this={as}
  bind:this={root}
  data-slot="auto-height"
  class={className}
  style="overflow:hidden"
  {...rest}
>
  <div bind:this={content} class={`w-full ${wrapperClassName}`}>
    <slot />
  </div>
</svelte:element>
