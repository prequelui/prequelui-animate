import { animate } from "motion";

export function createSpring(root, options = {}) {
  const {
    content = "drag",
    stiffness = 200,
    damping = 16,
    elastic = 0.7,
    snapBack = true,
    pressScale = 1.06,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let dragging = false;
  let startX = 0;
  let startY = 0;
  let lastX = 0;
  let lastY = 0;

  root.innerHTML = `<div data-slot="spring"
    class="cursor-grab touch-none select-none active:cursor-grabbing ${className}">${content}</div>`;
  const node = root.querySelector("[data-slot]");

  function down(event) {
    if (reduce() || event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    lastX = 0;
    lastY = 0;
    node.setPointerCapture?.(event.pointerId);
    node.style.cursor = "grabbing";
    animate(
      node,
      { scale: pressScale },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  function move(event) {
    if (!dragging) return;
    lastX = (event.clientX - startX) * elastic;
    lastY = (event.clientY - startY) * elastic;
    node.style.transform = `translate3d(${lastX}px, ${lastY}px, 0) scale(${pressScale})`;
  }

  function up() {
    if (!dragging) return;
    dragging = false;
    node.style.cursor = "grab";
    if (!snapBack) return;
    animate(
      node,
      { x: [lastX, 0], y: [lastY, 0], scale: 1 },
      { type: "spring", stiffness, damping },
    ).finished.then(() => {
      node.style.transform = "none";
    });
  }

  node.addEventListener("pointerdown", down);
  node.addEventListener("pointermove", move);
  node.addEventListener("pointerup", up);
  node.addEventListener("pointercancel", up);

  return {
    element: node,
    destroy() {
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", up);
      node.removeEventListener("pointercancel", up);
      root.innerHTML = "";
    },
  };
}
