<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    delay = 0,
    initialScale = 0.5,
    scale = 1,
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
    controls = animate(root, { scale: [initialScale, scale] }, options());
  }

  function reset() {
    if (!root) return;
    controls?.stop?.();
    if (reduce()) root.style.opacity = "0";
    else root.style.transform = `scale(${initialScale})`;
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

  const initial = $derived(reduce() ? "opacity:0" : `transform:scale(${initialScale})`);
</script>

<div
  bind:this={root}
  data-slot="zoom"
  class={className}
  style={initial}
  {...rest}
>
  <slot />
</div>
