<script>
  import { onMount, tick } from "svelte";
  import { animate } from "motion";

  let {
    pageKey = 0,
    duration = 0.55,
    from = "top",
    fade = true,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let controls;
  let lastKey = pageKey;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hiddenClip() {
    if (from === "bottom") return "inset(100% 0 0 0)";
    if (from === "left") return "inset(0 100% 0 0)";
    if (from === "right") return "inset(0 0 0 100%)";
    return "inset(0 0 100% 0)";
  }

  async function play() {
    await tick();
    if (!root) return;
    controls?.stop?.();
    if (reduce()) {
      controls = animate(
        root,
        { opacity: [0, 1] },
        { duration: 0.2, ease: [0.77, 0, 0.175, 1] },
      );
      return;
    }
    controls = animate(
      root,
      {
        clipPath: [hiddenClip(), "inset(0 0 0% 0)"],
        opacity: fade ? [0.6, 1] : 1,
      },
      { duration, ease: [0.77, 0, 0.175, 1] },
    );
  }

  $effect(() => {
    if (pageKey === lastKey) return;
    lastKey = pageKey;
    play();
  });

  onMount(() => {
    play();
    return () => controls?.stop?.();
  });
</script>

<div bind:this={root} data-slot="page-transition" class={`min-w-0 ${className}`} {...rest}>
  <slot />
</div>
