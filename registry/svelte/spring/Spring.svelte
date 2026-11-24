<script>
  import { animate } from "motion";

  let {
    stiffness = 200,
    damping = 16,
    elastic = 0.7,
    snapBack = true,
    pressScale = 1.06,
    class: className = "",
    ...rest
  } = $props();

  let root;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;

  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function down(event) {
    if (reduce() || !root || event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    lastX = 0;
    lastY = 0;
    root.setPointerCapture?.(event.pointerId);
    root.style.cursor = "grabbing";
    animate(
      root,
      { scale: pressScale },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  function move(event) {
    if (!dragging || !root) return;
    lastX = (event.clientX - startX) * elastic;
    lastY = (event.clientY - startY) * elastic;
    root.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) scale(${pressScale})`;
  }

  function up() {
    if (!dragging || !root) return;
    dragging = false;
    root.style.cursor = "grab";
    if (!snapBack) return;
    animate(
      root,
      { x: [lastX, 0], y: [lastY, 0], scale: 1 },
      { type: "spring", stiffness, damping },
    ).finished.then(() => {
      if (root) root.style.transform = "none";
    });
  }
</script>

<div
  bind:this={root}
  data-slot="spring"
  class={`cursor-grab touch-none select-none active:cursor-grabbing ${className}`}
  onpointerdown={down}
  onpointermove={move}
  onpointerup={up}
  onpointercancel={up}
  {...rest}
>
  <slot />
</div>
