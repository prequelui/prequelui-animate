import { animate } from "motion";

const BASE =
  "inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50";

export function createButton(root, options = {}) {
  const {
    label = "Button",
    className = "",
    hoverScale = 1,
    tapScale = 0.97,
    type = "button",
    disabled = false,
  } = options;
  const reduce = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hovered = false;

  root.innerHTML = `<button type="${type}" data-slot="button" ${disabled ? "disabled" : ""} class="${BASE} ${className}">${label}</button>`;
  const button = root.querySelector("button");

  function move(scale) {
    if (!button || reduce()) return;
    animate(
      button,
      { scale },
      { type: "spring", stiffness: 550, damping: 30, restSpeed: 10 },
    );
  }

  button.addEventListener("pointerdown", () => !disabled && move(tapScale));
  button.addEventListener("pointerup", () =>
    move(hovered && hoverScale !== 1 ? hoverScale : 1),
  );
  button.addEventListener("pointerenter", () => {
    hovered = true;
    if (hoverScale !== 1) move(hoverScale);
  });
  button.addEventListener("pointerleave", () => {
    hovered = false;
    move(1);
  });

  return {
    element: button,
    destroy() {
      root.innerHTML = "";
    },
  };
}
