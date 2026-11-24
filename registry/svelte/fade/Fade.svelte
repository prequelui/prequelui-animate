<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    delay = 0,
    initialOpacity = 0,
    opacity = 1,
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
    controls = animate(
      root,
      { opacity: [initialOpacity, opacity] },
      options(),
    );
  }

  function reset() {
    if (!root) return;
    controls?.stop?.();
    root.style.opacity = String(initialOpacity);
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
</script>

<div
  bind:this={root}
  data-slot="fade"
  class={className}
  style={`opacity:${initialOpacity}`}
  {...rest}
>
  <slot />
</div>
