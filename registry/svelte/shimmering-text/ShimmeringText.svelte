<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    duration = 1,
    wave = false,
    color = "var(--muted-foreground)",
    shimmeringColor = "var(--foreground)",
    class: className = "",
    ...rest
  } = $props();

  let root;
  let track;
  const chars = Array.from(text ?? "");
  const controls = [];
  let observer;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function play() {
    if (reduce() || !track) return;
    const nodes = Array.from(track.children);
    nodes.forEach((node, index) => {
      controls.push(
        animate(
          node,
          {
            ...(wave ? { x: [0, 5, 0], y: [0, -5, 0], scale: [1, 1.1, 1], rotateY: [0, 15, 0] } : {}),
            opacity: [1, 0.35, 1],
          },
          {
            duration,
            repeat: Infinity,
            repeatDelay: chars.length * 0.05,
            delay: (index * duration) / Math.max(1, chars.length),
            ease: "easeInOut",
          },
        ),
      );
    });
  }

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      play();
      observer?.disconnect();
    });
    if (root) observer.observe(root);
    return () => {
      observer?.disconnect();
      controls.forEach((control) => control.stop?.());
    };
  });
</script>

<span
  bind:this={root}
  data-slot="shimmering-text"
  class={`relative inline-block ${className}`}
  style={`--shimmer-color:${shimmeringColor};--shimmer-base:${color};color:${color};perspective:500px`}
  {...rest}
>
  <span class="sr-only">{text}</span>
  <span bind:this={track} aria-hidden="true" class="inline-block" style="perspective:inherit">
    {#each chars as char, index (char + "-" + index)}
      <span class="inline-block whitespace-pre" style="transform-style:preserve-3d">{char}</span>
    {/each}
  </span>
</span>
