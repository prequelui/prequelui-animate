import { animate } from "motion";

export function createMotionGrid(root, options = {}) {
  const {
    count = 35,
    columns = 7,
    dotSize = 8,
    gap = 10,
    speed = 1.4,
    stagger = 0.07,
    pauseOnHover = true,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const controls = [];

  root.innerHTML = `
    <div data-slot="motion-grid" aria-hidden="true" class="grid w-fit ${className}"
      style="grid-template-columns:repeat(${columns}, minmax(0, 1fr));gap:${gap}px">
      ${Array.from(
        { length: count },
        () =>
          `<span class="rounded-full bg-foreground" style="width:${dotSize}px;height:${dotSize}px;opacity:0.55"></span>`,
      ).join("")}
    </div>`;
  const grid = root.querySelector("[data-slot]");

  function play() {
    controls.length = 0;
    if (reduce()) return;
    const nodes = Array.from(grid.children);
    nodes.forEach((node, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      controls.push(
        animate(
          node,
          { scale: [0.65, 1, 0.65], opacity: [0.3, 1, 0.3] },
          {
            duration: speed,
            repeat: Infinity,
            delay: (row + column) * stagger,
            ease: "easeInOut",
          },
        ),
      );
    });
  }

  function pause() {
    if (!pauseOnHover) return;
    controls.forEach((control) => control.stop?.());
    Array.from(grid.children).forEach((node) => {
      node.style.opacity = "0.35";
      node.style.transform = "scale(1)";
    });
  }

  play();
  grid.addEventListener("pointerenter", pause);
  grid.addEventListener("pointerleave", play);

  return {
    element: grid,
    destroy() {
      controls.forEach((control) => control.stop?.());
      grid.removeEventListener("pointerenter", pause);
      grid.removeEventListener("pointerleave", play);
      root.innerHTML = "";
    },
  };
}
