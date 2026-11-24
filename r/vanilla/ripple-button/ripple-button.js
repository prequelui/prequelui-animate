import { animate } from "motion";

export function createRippleButton(root, options = {}) {
  const {
    label = "Ripple",
    hoverScale = 1,
    tapScale = 0.97,
    className = "",
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hovered = false;
  let nextId = 0;
  const timers = new Set();

  root.innerHTML = `
    <button type="button" data-slot="ripple-button"
      class="relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground ${className}">
      <span>${label}</span>
      <span data-ripples aria-hidden="true" class="pointer-events-none absolute inset-0"></span>
    </button>`;
  const button = root.querySelector("button");
  const wrap = root.querySelector("[data-ripples]");

  function click(event) {
    const rect = button.getBoundingClientRect();
    const scaleX = rect.width ? button.offsetWidth / rect.width : 1;
    const scaleY = rect.height ? button.offsetHeight / rect.height : 1;
    const node = document.createElement("span");
    node.className = "absolute size-5 rounded-full bg-current opacity-50";
    node.style.left = `${(event.clientX - rect.left) * scaleX - 10}px`;
    node.style.top = `${(event.clientY - rect.top) * scaleY - 10}px`;
    wrap.appendChild(node);
    const id = nextId++;
    node.dataset.ripple = String(id);
    const start = reduce() ? 10 : 0;
    animate(
      node,
      { scale: [start, 10], opacity: [0.5, 0] },
      { duration: 0.6, ease: "easeOut" },
    );
    const timer = setTimeout(() => {
      timers.delete(timer);
      node.remove();
    }, 600);
    timers.add(timer);
  }

  function press() {
    if (reduce()) return;
    animate(
      button,
      { scale: tapScale },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  function release() {
    if (reduce()) return;
    animate(
      button,
      { scale: hovered && hoverScale !== 1 ? hoverScale : 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  button.addEventListener("click", click);
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerenter", () => {
    hovered = true;
    if (hoverScale !== 1) release();
  });
  button.addEventListener("pointerleave", () => {
    hovered = false;
    release();
  });

  return {
    element: button,
    destroy() {
      for (const timer of timers) clearTimeout(timer);
      timers.clear();
      root.innerHTML = "";
    },
  };
}
