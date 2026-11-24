<script>
  import { onDestroy, onMount } from "svelte";
  import { animate } from "motion";

  let {
    target = null,
    barClass = "",
    class: className = "",
    ...rest
  } = $props();

  let bar;
  let controls;
  let scroller;
  let resizeHandler;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const clamp = (value) => Math.min(1, Math.max(0, value));

  function resolveTarget() {
    if (!target) return null;
    return target.current !== undefined ? target.current : target;
  }

  function read() {
    if (!bar || typeof window === "undefined") return;
    const element = resolveTarget();
    let value = 0;

    if (element && typeof element.scrollHeight === "number") {
      const max = element.scrollHeight - element.clientHeight;
      value = max > 0 ? clamp(element.scrollTop / max) : 0;
    } else {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      value = max > 0 ? clamp(window.scrollY / max) : 0;
    }

    controls?.stop?.();
    if (reduce()) {
      bar.style.transform = `scaleX(${value})`;
      return;
    }
    controls = animate(
      bar,
      { scaleX: value },
      { type: "spring", stiffness: 250, damping: 40, bounce: 0 },
    );
  }

  onMount(() => {
    scroller = resolveTarget() || window;
    read();
    scroller.addEventListener?.("scroll", read, { passive: true });
    resizeHandler = () => read();
    window.addEventListener("resize", resizeHandler);
  });

  onDestroy(() => {
    controls?.stop?.();
    scroller?.removeEventListener?.("scroll", read);
    if (resizeHandler) window.removeEventListener("resize", resizeHandler);
  });
</script>

<div
  role="progressbar"
  aria-label="Scroll progress"
  data-slot="scroll-progress"
  class={`h-1 w-full overflow-hidden bg-accent ${className}`}
  {...rest}
>
  <div
    bind:this={bar}
    class={`h-full origin-left bg-foreground ${barClass}`}
    style="transform:scaleX(0)"
  ></div>
</div>
