import { animate } from "motion";

export function createLiquidButton(root, options = {}) {
  const {
    label = "Liquid",
    delay = "0.3s",
    fillHeight = "3px",
    hoverScale = 1,
    tapScale = 0.97,
    className = "",
  } = options;
  const seconds = Number.parseFloat(delay) || 0.3;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hovered = false;

  root.innerHTML = `
    <button type="button" data-slot="liquid-button"
      class="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-lg border border-primary/20 bg-background px-4 text-[13px] font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}">
      <span data-fill aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 bottom-0 origin-bottom bg-primary"
        style="height:${fillHeight};opacity:0.55"></span>
      <span data-label class="relative z-10 text-foreground transition-colors"
        style="transition-duration:${seconds}s">${label}</span>
    </button>`;
  const button = root.querySelector("button");
  const fill = root.querySelector("[data-fill]");
  const labelEl = root.querySelector("[data-label]");

  function paint(next) {
    hovered = next;
    const active = next && !reduce();
    fill.style.height = next ? "100%" : fillHeight;
    labelEl.classList.toggle("text-primary-foreground", active);
    labelEl.classList.toggle("text-foreground", !active);
    animate(
      fill,
      { scaleY: active ? 1 : 0.06, opacity: active ? 1 : 0.55 },
      reduce() ? { duration: 0 } : { duration: seconds, ease: [0.25, 0.1, 0.35, 1] },
    );
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

  button.addEventListener("pointerenter", () => {
    paint(true);
    if (reduce() || hoverScale === 1) return;
    animate(
      button,
      { scale: hoverScale },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  });
  button.addEventListener("pointerleave", () => {
    paint(false);
    release();
  });
  button.addEventListener("focus", () => paint(true));
  button.addEventListener("blur", () => paint(false));
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);

  return {
    element: button,
    destroy() {
      root.innerHTML = "";
    },
  };
}
