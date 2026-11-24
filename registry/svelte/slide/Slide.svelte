<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    delay = 0,
    direction = "up",
    offset = 100,
    inView = false,
    inViewOnce = true,
    inViewMargin = "0px",
    transition = undefined,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let observer;
  let controls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const axis = $derived(
    direction === "up" || direction === "down" ? "y" : "x",
  );
  const start = $derived(
    direction === "right" || direction === "down" ? -offset : offset,
  );

  function options() {
    const base = transition ?? {
      type: "spring",
      stiffness: 200,
      damping: 20,
    };
    return {
      ...base,
      delay: (base.delay ?? 0) + delay / 1000,
    };
  }

  function play() {
    if (!root) return;
    controls?.stop?.();
    if (reduce()) {
      controls = animate(root, { opacity: [0, 1] }, options());
      return;
    }
    controls = animate(root, { [axis]: [start, 0] }, options());
  }

  function reset() {
    if (!root) return;
    controls?.stop?.();
    if (reduce()) root.style.opacity = "0";
    else root.style.transform = `translate${axis.toUpperCase()}(${start}px)`;
  }

  onMount(() => {
    if (!root) return;
    if (!inView) {
      play();
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          play();
          if (inViewOnce) observer?.disconnect();
        } else if (!inViewOnce) {
          reset();
        }
      },
      { threshold: 0.35, rootMargin: inViewMargin },
    );
    observer.observe(root);
    return () => observer?.disconnect();
  });

  $effect(() => () => controls?.stop?.());

  const initial = $derived(
    reduce() ? "opacity:0" : `transform:translate${axis.toUpperCase()}(${start}px)`,
  );
</script>

<div
  bind:this={root}
  data-slot="slide"
  data-direction={direction}
  class={className}
  style={initial}
  {...rest}
>
  <slot />
</div>
