<script>
  import { onMount, tick, untrack } from "svelte";
  import { animate } from "motion";

  let {
    text: textProp = "",
    duration = 2000,
    delay = 0,
    direction = "up",
    stagger = 0.04,
    transition,
    class: className = "",
    style = "",
    ...rest
  } = $props();

  const DEFAULT_TWEEN = { duration: 0.2, ease: [0.4, 0, 0.2, 1] };

  let root;
  let index = $state(0);
  let onScreen = $state(true);
  let pageVisible = $state(true);
  let observer;
  let timer;
  let settleTimer;
  let cycled = false;
  let controls = [];
  let segmenter;
  function reduce() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function splitGraphemes(value) {
    if (segmenter === undefined) {
      segmenter =
        typeof Intl !== "undefined" && typeof Intl.Segmenter === "function"
          ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
          : null;
    }
    if (!segmenter) return Array.from(value);
    return Array.from(segmenter.segment(value), (entry) => entry.segment);
  }

  const tween = $derived(transition ?? DEFAULT_TWEEN);
  const texts = $derived(Array.isArray(textProp) ? textProp : [textProp]);
  const current = $derived(texts[index % texts.length] ?? "");
  const chars = $derived(splitGraphemes(current));
  const initialChars = splitGraphemes(texts[0] ?? "");
  let swap = $state({
    id: 0,
    from: initialChars,
    to: initialChars,
    widths: null,
  });
  const slots = $derived(Math.max(swap.from.length, swap.to.length));
  const positions = $derived(
    Array.from({ length: slots }, (_, position) => position),
  );
  const animated = $derived(swap.id > 0 && !reduce());

  function measure(element, values) {
    if (!element || typeof document === "undefined") return null;
    const context = document.createElement("canvas").getContext("2d");
    if (!context) return null;
    const computed = getComputedStyle(element);
    context.font = computed.font;
    const spacing = Number.parseFloat(computed.letterSpacing) || 0;
    return values.map((char) => context.measureText(char).width + spacing);
  }

  function isAnimatedSlot(position) {
    if (!animated) return false;
    const from = swap.from[position] ?? "";
    const to = swap.to[position] ?? "";
    return from !== to;
  }

  function stopControls() {
    for (const control of controls) control?.stop?.();
    controls = [];
  }

  function schedule() {
    clearTimeout(timer);
    if (texts.length <= 1 || !onScreen || !pageVisible) return;
    timer = setTimeout(
      () => {
        cycled = true;
        index = (index + 1) % texts.length;
        schedule();
      },
      cycled ? duration : delay + duration,
    );
  }

  function runSwap() {
    if (!root) return;
    const state = swap;
    stopControls();
    const nodes = Array.from(root.querySelectorAll("[data-swap-slot]"));
    let order = 0;
    for (const node of nodes) {
      if (node.dataset.animate !== "true") continue;
      const position = Number(node.dataset.index ?? 0);
      const fromNode = node.querySelector("[data-swap-from]");
      const toNode = node.querySelector("[data-swap-to]");
      const timing = { ...tween, delay: order * stagger };
      order += 1;
      const sign = direction === "up" ? 1 : -1;
      const enter = `${sign * 0.5}em`;
      const exit = `${-sign * 0.5}em`;

      if (state.widths) {
        controls.push(
          animate(
            node,
            {
              width: [
                `${(state.widths.from[position] ?? 0) / 16}rem`,
                `${(state.widths.to[position] ?? 0) / 16}rem`,
              ],
            },
            timing,
          ),
        );
      }

      if (fromNode) {
        controls.push(
          animate(
            fromNode,
            { y: [0, exit], opacity: [1, 0], filter: ["blur(0px)", "blur(2px)"] },
            timing,
          ),
        );
      }
      if (toNode) {
        controls.push(
          animate(
            toNode,
            { y: [enter, 0], opacity: [0, 1], filter: ["blur(2px)", "blur(0px)"] },
            timing,
          ),
        );
      }
    }
  }

  function onVisibilityChange() {
    pageVisible = !document.hidden;
  }

  $effect(() => {
    const next = chars;
    untrack(() => {
      const state = swap;
      if (state.to.join("") === next.join("")) return;
      if (reduce()) {
        swap = { id: 0, from: next, to: next, widths: null };
        return;
      }
      const fromWidths = measure(root, state.to);
      const toWidths = measure(root, next);
      swap = {
        id: state.id + 1,
        from: state.to,
        to: next,
        widths: fromWidths && toWidths ? { from: fromWidths, to: toWidths } : null,
      };
      tick().then(() => {
        runSwap();
        clearTimeout(settleTimer);
        const id = swap.id;
        settleTimer = setTimeout(() => {
          if (swap.id !== id) return;
          swap = {
            id,
            from: swap.to,
            to: swap.to,
            widths: null,
          };
        }, 700);
      });
    });
    return () => {};
  });

  $effect(() => {
    const active = texts.length > 1 && onScreen && pageVisible;
    untrack(() => {
      if (active) schedule();
      else clearTimeout(timer);
    });
    return () => clearTimeout(timer);
  });

  onMount(() => {
    observer = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((entry) => entry.isIntersecting);
      },
      { threshold: 0 },
    );
    if (root) observer.observe(root);
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    schedule();
    return () => {
      clearTimeout(timer);
      clearTimeout(settleTimer);
      observer?.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      stopControls();
    };
  });
</script>

<span
  bind:this={root}
  data-slot="swapping-text"
  class={`inline-block whitespace-pre ${className}`}
  style={style}
  {...rest}
>
  <span aria-hidden="true" class="inline-flex">
    {#each positions as position (swap.id + "-" + position)}
      {#if !isAnimatedSlot(position)}
        {#if swap.to[position]}
          <span class="inline-block">{swap.to[position] === " " ? "\u00A0" : swap.to[position]}</span>
        {/if}
      {:else}
        <span
          data-swap-slot
          data-index={position}
          data-animate="true"
          class="relative inline-block"
          style={swap.widths ? `width:${(swap.widths.from[position] ?? 0) / 16}rem` : ""}
        >
          {#if swap.from[position]}
            <span data-swap-from class="absolute left-0 top-0">{swap.from[position] === " " ? "\u00A0" : swap.from[position]}</span>
          {/if}
          {#if swap.to[position]}
            <span
              data-swap-to
              class="inline-block"
              style={`position:${swap.widths ? "absolute" : "relative"};left:0;top:0`}
            >{swap.to[position] === " " ? "\u00A0" : swap.to[position]}</span>
          {/if}
        </span>
      {/if}
    {/each}
  </span>
  <span class="sr-only">{current}</span>
</span>
