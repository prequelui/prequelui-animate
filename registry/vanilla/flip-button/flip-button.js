import { animate } from "motion";

export function createFlipButton(root, options = {}) {
  const {
    from = "top",
    front = "Hover me",
    back = "Hello",
    tapScale = 0.97,
    className = "",
  } = options;
  const vertical = from === "top" || from === "bottom";
  const axis = vertical ? "rotateX" : "rotateY";
  const frontSide = from === "top" || from === "left";
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.innerHTML = `
    <button type="button" data-slot="flip-button" data-from="${from}"
      class="inline-grid place-items-center rounded-lg text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring/50 ${className}"
      style="perspective:1000px">
      <span data-slot="flip-button-front"
        class="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-primary-foreground"
        style="grid-area:1 / 1">${front}</span>
      <span data-slot="flip-button-back" aria-hidden="true"
        class="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-4 text-secondary-foreground"
        style="grid-area:1 / 1;opacity:0">${back}</span>
    </button>`;
  const button = root.querySelector("button");
  const frontEl = root.querySelector('[data-slot="flip-button-front"]');
  const backEl = root.querySelector('[data-slot="flip-button-back"]');

  if (!reduce()) {
    animate(
      backEl,
      {
        [axis]: 90,
        [vertical ? "y" : "x"]: frontSide ? "-50%" : "50%",
        opacity: 0,
      },
      { duration: 0 },
    );
  }

  function place(element, rotate, offset, opacity) {
    if (!element) return;
    animate(
      element,
      { [axis]: rotate, [vertical ? "y" : "x"]: offset, opacity },
      reduce() ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 20 },
    );
  }

  function apply(next) {
    const active = next && !reduce();
    const outward = frontSide ? "50%" : "-50%";
    place(frontEl, active ? 90 : 0, active ? outward : "0%", active ? 0 : 1);
    place(
      backEl,
      active ? 0 : 90,
      active ? "0%" : frontSide ? "-50%" : "50%",
      active ? 1 : 0,
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
      { scale: 1 },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointerenter", () => apply(true));
  button.addEventListener("pointerleave", () => {
    release();
    apply(false);
  });

  return {
    element: button,
    destroy() {
      root.innerHTML = "";
    },
  };
}
