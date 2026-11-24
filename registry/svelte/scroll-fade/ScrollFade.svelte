<script>
  import { onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    orientation = "vertical",
    size = 40,
    transition = undefined,
    enabled = true,
    as = "div",
    class: className = "",
    ...rest
  } = $props();

  let root;
  const values = { top: 0, bottom: 0, left: 0, right: 0 };
  const edges = ["top", "bottom", "left", "right"];
  const vars = {
    top: "--scroll-fade-top",
    bottom: "--scroll-fade-bottom",
    left: "--scroll-fade-left",
    right: "--scroll-fade-right",
    size: "--scroll-fade-size",
  };

  let observer;
  let mutation;
  let control;
  let masked = false;
  let teardown = () => {};
  let started = false;

  const overflow = $derived(
    orientation === "horizontal"
      ? "overflow-x:auto"
      : orientation === "both"
        ? "overflow:auto"
        : "overflow-y:auto",
  );

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function maskFor() {
    const stop = (edge) => `rgb(0 0 0 / calc(1 - var(${vars[edge]}, 0)))`;
    const depth = (edge) =>
      `calc(var(${vars.size}) * min(1, var(${vars[edge]}, 0) * 1000))`;
    const vertical = `linear-gradient(to bottom, ${stop("top")} 0, #000 ${depth(
      "top",
    )}, #000 calc(100% - ${depth("bottom")}), ${stop("bottom")} 100%)`;
    const horizontal = `linear-gradient(to right, ${stop("left")} 0, #000 ${depth(
      "left",
    )}, #000 calc(100% - ${depth("right")}), ${stop("right")} 100%)`;

    if (orientation === "vertical") return vertical;
    if (orientation === "horizontal") return horizontal;
    return `${vertical}, ${horizontal}`;
  }

  function applyMask(element, mask) {
    if (mask) {
      element.style.setProperty("mask-image", mask);
      element.style.setProperty("-webkit-mask-image", mask);
      element.style.setProperty("mask-composite", "intersect");
      element.style.setProperty("-webkit-mask-composite", "source-in");
    } else {
      for (const property of [
        "mask-image",
        "-webkit-mask-image",
        "mask-composite",
        "-webkit-mask-composite",
      ]) {
        element.style.removeProperty(property);
      }
    }
  }

  function settle() {
    return transition ?? { duration: 0.2, ease: [0.23, 1, 0.32, 1] };
  }

  function start() {
    const element = root;
    if (!element || !enabled) return;

    const vertical = orientation !== "horizontal";
    const horizontal = orientation !== "vertical";
    const mask = maskFor();
    masked = false;

    element.style.setProperty(vars.size, `${size}px`);

    const write = () => {
      let any = false;
      for (const edge of edges) {
        const amount = clamp(values[edge], 0, 1);
        if (amount > 0.001) any = true;
        element.style.setProperty(vars[edge], amount.toFixed(4));
      }
      if (any !== masked) {
        masked = any;
        applyMask(element, any ? mask : null);
      }
    };

    const ramp = size / 2;
    const amount = (distance) =>
      ramp > 0 ? clamp(distance / ramp, 0, 1) : distance > 0.5 ? 1 : 0;

    const measure = (follow) => {
      const targets = { top: 0, bottom: 0, left: 0, right: 0 };

      if (vertical) {
        const max = element.scrollHeight - element.clientHeight;
        if (max > 1) {
          targets.top = amount(element.scrollTop);
          targets.bottom = amount(max - element.scrollTop);
        }
      }

      if (horizontal) {
        const max = element.scrollWidth - element.clientWidth;
        if (max > 1) {
          const fromStart = Math.abs(element.scrollLeft);
          const fromEnd = max - fromStart;
          const rtl = getComputedStyle(element).direction === "rtl";
          targets.left = amount(rtl ? fromEnd : fromStart);
          targets.right = amount(rtl ? fromStart : fromEnd);
        }
      }

      if (follow || reduce()) {
        for (const edge of edges) values[edge] = targets[edge];
        write();
      } else {
        control?.stop?.();
        control = animate(values, targets, {
          ...settle(),
          onUpdate: write,
        });
      }
    };

    measure(true);

    const onScroll = () => measure(true);
    element.addEventListener("scroll", onScroll, { passive: true });

    observer = new ResizeObserver(() => measure(false));
    observer.observe(element);
    for (const child of element.children) observer.observe(child);

    mutation = new MutationObserver(() => {
      measure(false);
      observer?.disconnect();
      observer = new ResizeObserver(() => measure(false));
      observer.observe(element);
      for (const child of element.children) observer.observe(child);
    });
    mutation.observe(element, { childList: true, subtree: true });

    teardown = () => {
      element.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      mutation?.disconnect();
      control?.stop?.();
      applyMask(element, null);
      for (const name of Object.values(vars)) element.style.removeProperty(name);
      for (const edge of edges) values[edge] = 0;
    };
  }

  function restart() {
    teardown();
    teardown = () => {};
    tick().then(start);
  }

  $effect(() => {
    orientation;
    size;
    enabled;
    transition;
    if (!started) return;
    restart();
  });

  onMount(() => {
    started = true;
    start();
    return () => teardown();
  });
</script>

<svelte:element
  this={as}
  bind:this={root}
  data-slot="scroll-fade"
  data-orientation={orientation}
  class={className}
  style={overflow}
  {...rest}
>
  <slot />
</svelte:element>
