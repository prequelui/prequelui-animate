<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    delay = 0,
    initialBlur = 10,
    blur = 0,
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
    const from = reduce() ? 0 : initialBlur;
    controls = animate(
      root,
      { filter: [`blur(${from}px)`, `blur(${blur}px)`] },
      options(),
    );
  }

  function reset() {
    if (!root) return;
    controls?.stop?.();
    const from = reduce() ? 0 : initialBlur;
    root.style.filter = `blur(${from}px)`;
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

  const initial = $derived(`filter:blur(${reduce() ? 0 : initialBlur}px)`);
</script>

<div
  bind:this={root}
  data-slot="blur"
  class={className}
  style={initial}
  {...rest}
>
  <slot />
</div>
