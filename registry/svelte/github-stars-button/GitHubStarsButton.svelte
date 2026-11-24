<script>
  import { onMount } from "svelte";
  import { animate } from "motion";
  import { Github, Star } from "lucide-svelte";

  let {
    username = "prequelui",
    repo = "prequelui-animate",
    value = 0,
    delay = 0,
    inView = true,
    type = "button",
    disabled = false,
    class: className = "",
    onclick = undefined,
    ...rest
  } = $props();

  let root;
  let starEl;
  let particles;
  let starred = $state(false);
  let burst = $state(0);
  let count = $state(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? value
      : 0,
  );
  let started = false;
  let observer;
  let controls;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function startCount() {
    if (started) return;
    started = true;
    if (reduce()) {
      count = value;
      return;
    }
    controls = animate(0, value, {
      type: "spring",
      stiffness: 90,
      damping: 50,
      delay: delay / 1000,
      onUpdate: (latest) => (count = Math.round(latest)),
    });
  }

  onMount(() => {
    if (!inView) startCount();
    else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            startCount();
            observer?.disconnect();
          }
        },
        { threshold: 0.4 },
      );
      if (root) observer.observe(root);
    }
    return () => {
      observer?.disconnect();
      controls?.stop?.();
    };
  });

  function toggle(event) {
    onclick?.(event);
    starred = !starred;
    count += starred ? 1 : -1;
    burst += 1;
    if (reduce()) return;
    if (starEl) {
      animate(
        starEl,
        { scale: [1, 1.35, 1], rotate: [0, 12, 0] },
        { duration: 0.45, ease: [0.23, 1, 0.32, 1] },
      );
    }
    const nodes = particles ? Array.from(particles.children) : [];
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      animate(
        node,
        {
          opacity: [1, 0],
          x: Math.cos(angle) * 26,
          y: Math.sin(angle) * 26,
          scale: 0.35,
        },
        { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
      );
    });
  }
</script>

<button
  bind:this={root}
  {type}
  {disabled}
  data-slot="github-stars-button"
  aria-label={`Star ${username}/${repo} on GitHub`}
  class={`relative inline-flex h-9 items-center gap-2 overflow-visible rounded-lg border bg-background px-3 text-[13px] font-medium disabled:pointer-events-none disabled:opacity-50 ${className}`}
  onclick={toggle}
  {...rest}
>
  <Github class="size-4" aria-hidden="true" />
  <span>Star</span>
  <span class="h-4 w-px bg-border" aria-hidden="true" />
  <span class="relative flex items-center gap-1 tabular-nums text-muted-foreground">
    <span bind:this={starEl} class="inline-flex">
      <Star
        class="size-3.5 transition-colors duration-300 {starred
          ? 'fill-[#f5b301] text-[#f5b301]'
          : 'text-muted-foreground'}"
      />
    </span>
    {count.toLocaleString("en-US")}
  </span>
  <span bind:this={particles} class="pointer-events-none absolute right-3 top-1/2" aria-hidden="true">
    {#each Array.from({ length: 6 }) as _, index (burst + "-" + index)}
      <span class="absolute size-1 rounded-full bg-[#f5b301] opacity-0"></span>
    {/each}
  </span>
</button>
