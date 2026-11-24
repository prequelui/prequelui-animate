<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    type = "chars",
    delay = 0,
    stagger = 0,
    disableAnimation = false,
    inView = false,
    inViewOnce = true,
    class: className = "",
    ...rest
  } = $props();

  let root;
  const controls = [];
  let observer;
  let played = false;

  const lines = $derived(Array.isArray(text) ? text : []);
  const words = $derived(Array.isArray(text) ? [] : (text.match(/\S+/g) ?? []));
  const chars = $derived(Array.isArray(text) ? [] : Array.from(text));
  const label = $derived(Array.isArray(text) ? text.join(" ") : text);
  const gap = $derived(stagger || (type === "words" ? 0.2 : type === "lines" ? 0.3 : 0.05));

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function play() {
    if (played || !root) return;
    played = true;
    const still = disableAnimation || reduce();
    const nodes = Array.from(root.querySelectorAll("[data-piece]"));
    nodes.forEach((node, index) => {
      if (still) {
        node.style.opacity = "1";
        node.style.transform = "none";
        return;
      }
      controls.push(
        animate(
          node,
          { x: [150, 0], opacity: [0, 1] },
          {
            duration: 0.7,
            ease: [0.23, 1, 0.32, 1],
            delay: delay / 1000 + index * gap,
          },
        ),
      );
    });
  }

  onMount(() => {
    if (!inView) {
      play();
      return;
    }
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      play();
      if (inViewOnce) observer?.disconnect();
    });
    if (root) observer.observe(root);
    return () => {
      observer?.disconnect();
      controls.forEach((control) => control.stop?.());
    };
  });
</script>

<span bind:this={root} data-slot="splitting-text" class={`inline ${className}`} {...rest}>
  <span aria-hidden="true">
    {#if lines.length}
      {#each lines as line, index (index)}
        <span data-piece class="inline-block will-change-transform" style="opacity:0">{line}</span>
        {#if index < lines.length - 1}<br />{/if}
      {/each}
    {:else if type === "words"}
      {#each words as word, index (index)}
        <span data-piece class="inline-block will-change-transform" style="opacity:0">{word}</span>
        {#if index < words.length - 1} {/if}
      {/each}
    {:else}
      {#each chars as char, index (index)}
        <span data-piece class="inline-block whitespace-pre will-change-transform" style="opacity:0">{char === " " ? "\u00A0" : char}</span>
      {/each}
    {/if}
  </span>
  <span class="sr-only">{label}</span>
</span>
