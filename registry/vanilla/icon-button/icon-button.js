import { animate } from "motion";

export function createIconButton(root, options = {}) {
  const {
    icon = "+",
    label = "Icon",
    size = 4,
    count = 8,
    distance = 24,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const dots = Array.from({ length: count }, () => "<span></span>").join("");

  root.innerHTML = `
    <button type="button" data-slot="icon-button" aria-label="${label}"
      class="relative inline-flex size-10 items-center justify-center rounded-lg border bg-background p-0 text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}">
      <span>${icon}</span>
      <span data-slot="icon-button-particles" aria-hidden="true"
        class="pointer-events-none absolute inset-0">${dots}</span>
    </button>`;
  const button = root.querySelector("button");
  const particles = root.querySelector('[data-slot="icon-button-particles"]');
  for (const node of particles.children) {
    node.className = "absolute left-1/2 top-1/2 rounded-full bg-current opacity-0";
    node.style.width = `${size}px`;
    node.style.height = `${size}px`;
  }

  function burst() {
    if (reduce()) return;
    const nodes = Array.from(particles.children);
    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * Math.PI * 2;
      animate(
        node,
        {
          opacity: [1, 0],
          x: [0, Math.cos(angle) * distance],
          y: [0, Math.sin(angle) * distance],
          scale: [0.8, 0.2],
        },
        { duration: 0.55, ease: [0.23, 1, 0.32, 1] },
      );
    });
  }

  function press() {
    if (reduce()) return;
    animate(
      button,
      { scale: 0.97 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  function release() {
    if (reduce()) return;
    animate(
      button,
      { scale: 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  button.addEventListener("click", burst);
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerleave", release);

  return {
    element: button,
    destroy() {
      button.removeEventListener("click", burst);
      button.removeEventListener("pointerdown", press);
      button.removeEventListener("pointerup", release);
      button.removeEventListener("pointerleave", release);
      root.innerHTML = "";
    },
  };
}
