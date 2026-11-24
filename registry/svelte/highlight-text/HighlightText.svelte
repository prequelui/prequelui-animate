<script>
  import { onMount } from "svelte";
  import { animate } from "motion";

  let {
    text = "",
    delay = 0,
    color = "color-mix(in oklab, #f5c542 38%, transparent)",
    inView = false,
    inViewOnce = true,
    class: className = "",
    ...rest
  } = $props();

  let root;
  const controls = [];
  let observer;
  let played = false;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function play() {
    if (played || !root) return;
    played = true;
    if (reduce()) {
      root.style.backgroundSize = "100% 100%";
      return;
    }
    controls.push(
      animate(
        root,
        { backgroundSize: ["0% 100%", "100% 100%"] },
        { duration: 2, ease: [0.42, 0, 0.58, 1], delay: delay / 1000 },
      ),
    );
  }

  onMount(() => {
    if (!inView) {
      play();
      return;
    }
    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          play();
          if (inViewOnce) observer?.disconnect();
        } else if (!inViewOnce) {
          played = false;
          if (root) root.style.backgroundSize = "0% 100%";
        }
      },
      { threshold: 0.35 },
    );
    if (root) observer.observe(root);
    return () => {
      observer?.disconnect();
      controls.forEach((control) => control.stop?.());
    };
  });
</script>

<span
  bind:this={root}
  data-slot="highlight-text"
  class={`relative inline-block ${className}`}
  style={`background-image:linear-gradient(${color}, ${color});background-repeat:no-repeat;background-position:left center;background-size:0% 100%`}
  {...rest}
>
  {text}
</span>
