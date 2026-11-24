<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    gradient = "linear-gradient(90deg, #3b82f6 0%, #a855f7 20%, #ec4899 50%, #a855f7 80%, #3b82f6 100%)",
    neon = false,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let layer;
  let glow;
  const controls = [];
  let observer;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function play() {
    if (reduce()) return;
    for (const node of [layer, glow]) {
      if (!node) continue;
      controls.push(
        animate(
          node,
          { backgroundPosition: ["0% 0%", "500% 100%"] },
          { duration: 50, repeat: Infinity, ease: "linear" },
        ),
      );
    }
  }

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        play();
        observer?.disconnect();
      }
    });
    if (root) observer.observe(root);
    return () => {
      observer?.disconnect();
      controls.forEach((control) => control.stop?.());
    };
  });
</script>

<span bind:this={root} data-slot="gradient-text" class={`relative inline-block ${className}`} {...rest}>
  <span
    bind:this={layer}
    class="inline-block bg-clip-text text-transparent"
    style={`background-image:${gradient};background-size:700% 100%`}
  >
    {text}
  </span>
  {#if neon}
    <span
      bind:this={glow}
      aria-hidden="true"
      class="absolute inset-0 inline-block bg-clip-text text-transparent"
      style={`background-image:${gradient};background-size:700% 100%;mix-blend-mode:plus-lighter;filter:blur(8px)`}
    >
      {text}
    </span>
  {/if}
</span>
